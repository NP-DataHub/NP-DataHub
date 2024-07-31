import itertools
import os

os.environ['DGLBACKEND'] = 'pytorch'  # tell DGL what backend to use
import dgl
import dgl.data
import torch
import numpy as np
import scipy.sparse as sp
import torch.nn as nn
import torch.nn.functional as F
from dgl.nn import SAGEConv
import dgl.function as fn
from sklearn.metrics import roc_auc_score


# load the data from working directory
graphs, _ = dgl.data.load_graphs('REAL.dgl')
g = graphs[0]
print("Number of nodes in the graph:", g.num_nodes())
print("Number of edges in the graph:", g.num_edges())
if(g.number_of_edges() == 0):
    print("The graph is empty, exiting")
    exit(1)

# Split edge set for training and testing
u, v = g.edges()



eids = np.arange(g.num_edges())
eids = np.random.permutation(eids)
test_size = int(len(eids) * 0.1)
train_size = g.num_edges() - test_size
test_pos_u, test_pos_v = u[eids[:test_size]], v[eids[:test_size]]
train_pos_u, train_pos_v = u[eids[test_size:]], v[eids[test_size:]]



# Find all negative edges and split them for training and testing
adj = sp.coo_matrix((np.ones(len(u)), (u.numpy(), v.numpy())), shape=(g.num_nodes(), g.num_nodes()))

adj_neg = 1 - adj.todense() - np.eye(g.num_nodes())
neg_u, neg_v = np.where(adj_neg != 0)

neg_eids = np.random.choice(len(neg_u), g.num_edges())
test_neg_u, test_neg_v = (
    neg_u[neg_eids[:test_size]],
    neg_v[neg_eids[:test_size]],
)
train_neg_u, train_neg_v = (
    neg_u[neg_eids[test_size:]],
    neg_v[neg_eids[test_size:]],
)

train_g = dgl.remove_edges(g, eids[:test_size])

# create model, using SageConv
class GraphSAGE(nn.Module):
    def __init__(self, in_feats, h_feats):
        super(GraphSAGE, self).__init__()
        self.conv1 = SAGEConv(in_feats, h_feats, "mean")
        self.conv2 = SAGEConv(h_feats, h_feats, "mean")
    
    def forward(self, g, in_feat):
        h = self.conv1(g, in_feat)
        h = F.relu(h)
        h = self.conv2(g, h)
        return h
    
train_pos_g = dgl.graph((train_pos_u, train_pos_v), num_nodes=g.num_nodes())
train_neg_g = dgl.graph((train_neg_u, train_neg_v), num_nodes=g.num_nodes())

test_pos_g = dgl.graph((test_pos_u, test_pos_v), num_nodes=g.num_nodes())
test_neg_g = dgl.graph((test_neg_u, test_neg_v), num_nodes=g.num_nodes())



class DotPredictor(nn.Module):
    def forward(self, g, h):
        with g.local_scope():
            g.ndata["h"] = h
            # Compute a new edge feature named 'score' by a dot-product between the
            # source node feature 'h' and destination node feature 'h'.
            g.apply_edges(fn.u_dot_v("h", "h", "score"))
            # u_dot_v returns a 1-element vector for each edge so you need to squeeze it.
            return g.edata["score"].squeeze()
        
class MLPPredictor(nn.Module):
    def __init__(self, h_feats):
        super().__init__()
        self.W1 = nn.Linear(h_feats * 2, h_feats)
        self.W2 = nn.Linear(h_feats, 1)

    def apply_edges(self, edges):
        """
        Computes a scalar score for each edge of the given graph.

        Parameters
        ----------
        edges :
            Has three members ``src``, ``dst`` and ``data``, each of
            which is a dictionary representing the features of the
            source nodes, the destination nodes, and the edges
            themselves.

        Returns
        -------
        dict
            A dictionary of new edge features.
        """
        h = torch.cat([edges.src["h"], edges.dst["h"]], 1)
        return {"score": self.W2(F.relu(self.W1(h))).squeeze(1)}

    def forward(self, g, h):
        with g.local_scope():
            g.ndata["h"] = h
            g.apply_edges(self.apply_edges)
            return g.edata["score"]
        


# Assuming train_g.ndata contains all the relevant fields
#state = train_g.ndata["State"]
print(train_g.ndata)


# convert all the features to float



rev = train_g.ndata["Revs"].float()
exp = train_g.ndata["Exps"].float()
asts = train_g.ndata["Asts"].float()
liabs = train_g.ndata["Liabs"].float()

# Concatenate all features along the last dimension
all_features = torch.cat([rev, exp, asts, liabs], dim=-1)

# Update the node data with the concatenated features
train_g.ndata["AllFeatures"] = all_features

# Initialize the model with the concatenated features
model = GraphSAGE(train_g.ndata["AllFeatures"].shape[1], g.num_nodes())




        
# # no idea what is going on here
# train_g.ndata["State"] = train_g.ndata["State"].float()

# model = GraphSAGE(train_g.ndata["State"].shape[0], g.num_nodes())
# # You can replace DotPredictor with MLPPredictor.
# # pred = MLPPredictor(16)
pred = DotPredictor()

def compute_loss(pos_score, neg_score):
    scores = torch.cat([pos_score, neg_score])
    labels = torch.cat(
        [torch.ones(pos_score.shape[0]), torch.zeros(neg_score.shape[0])]
    )
    return F.binary_cross_entropy_with_logits(scores, labels)


def compute_auc(pos_score, neg_score):
    scores = torch.cat([pos_score, neg_score]).numpy()
    labels = torch.cat(
        [torch.ones(pos_score.shape[0]), torch.zeros(neg_score.shape[0])]
    ).numpy()
    return roc_auc_score(labels, scores)

# in this case, loss will in training loop
optimizer = torch.optim.Adam(
    itertools.chain(model.parameters(), pred.parameters()), lr=0.01
)


# ----------- 4. training -------------------------------- #
all_logits = []
for e in range(100):
    # forward
    h = model(train_g, train_g.ndata["AllFeatures"])
    pos_score = pred(train_pos_g, h)
    neg_score = pred(train_neg_g, h)
    loss = compute_loss(pos_score, neg_score)

    # backward
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if e % 5 == 0:
        print("In epoch {}, loss: {}".format(e, loss))

with torch.no_grad():
    pos_score = pred(test_pos_g, h)
    neg_score = pred(test_neg_g, h)
    print("AUC", compute_auc(pos_score, neg_score))

# print the predicted edges
print("Predicted edges:")
print(pred(test_pos_g, h))
print(pred(test_neg_g, h))

import networkx as nx
import matplotlib.pyplot as plt

nx_g = g.to_networkx().to_undirected()
nx.draw(nx_g, with_labels=True)
plt.show()


# create a new graph with the predicted edges
new_edges = []
for i in range(len(test_pos_u)):
    if pred(test_pos_g, h)[i] > 0:
        new_edges.append((test_pos_u[i].item(), test_pos_v[i].item()))
for i in range(len(test_neg_u)):
    if pred(test_neg_g, h)[i] > 0:
        new_edges.append((test_neg_u[i].item(), test_neg_v[i].item()))
new_g = dgl.graph(new_edges, num_nodes=g.num_nodes())
print("Number of nodes in the new graph:", new_g.num_nodes())
print("Number of edges in the new graph:", new_g.num_edges())
nx_new_g = new_g.to_networkx().to_undirected()
nx.draw(nx_new_g, with_labels=True) 
plt.show()