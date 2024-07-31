import pymongo
import dgl
import torch
import networkx as nx
from sklearn.preprocessing import LabelEncoder
import os
from progress.bar import Bar
import json
import numpy as np
import matplotlib.pyplot as plt

os.environ['DGLBACKEND'] = 'pytorch'  # tell DGL what backend to use, not really used but it complains if you dont

# Connect to MongoDB
uri = open("MONGO_DB_URI.txt", "r").read()
client = pymongo.MongoClient(uri)
database = client['Np-Datahub']
collection = database['NonProfitData']

# NetworkX digraph for eventual conversion to DGL graph
G = nx.DiGraph()

# Since a dgl graph only supports numerical node attributes, we need to encode the string attributes
name_encoder = LabelEncoder()
city_encoder = LabelEncoder()
state_encoder = LabelEncoder()
ntee_encoder = LabelEncoder()


# Grab nodes from the collection
num_test_nodes = 1000
print(f"Grabbing the first {num_test_nodes} nodes from the collection")

nonprofits = list(collection.find().limit(num_test_nodes))

names = []
cities = []
states = []
ntees = []

for i in nonprofits:
    names.append(i['Nm'])
    cities.append(i['Cty'])
    states.append(i['St'])
    # For now, ignore the subcode and use only the main code, ie the first char in the ntee code
    ntees.append(i['NTEE'][0])

# Fit the encoders
print("Fitting the encoders")
name_encoder.fit(names)
city_encoder.fit(cities)
state_encoder.fit(states)
ntee_encoder.fit(ntees)

# Determine the maximum length of the financial attributes
max_length = max(
    max(len([year_data['TotRev'] for year, year_data in cur_np.items() if year.isdigit() and 'TotRev' in year_data]) for cur_np in nonprofits),
    max(len([year_data['TotExp'] for year, year_data in cur_np.items() if year.isdigit() and 'TotExp' in year_data]) for cur_np in nonprofits),
    max(len([year_data['TotLia'] for year, year_data in cur_np.items() if year.isdigit() and 'TotLia' in year_data]) for cur_np in nonprofits),
    max(len([year_data['TotAst'] for year, year_data in cur_np.items() if year.isdigit() and 'TotAst' in year_data]) for cur_np in nonprofits)
)

# Create the nodes using the encoders and the data
bar = Bar('Creating Nodes from MongoDB', max=num_test_nodes)
for cur_np in nonprofits:
    name_encoded = name_encoder.transform([cur_np['Nm']])[0]
    attributes = {
        'City': city_encoder.transform([cur_np['Cty']])[0],
        'State': state_encoder.transform([cur_np['St']])[0],
        'Zipcode': int(cur_np['Zip']),
        'NTEE': ntee_encoder.transform([cur_np['NTEE'][0]])[0],
        'Revs': np.pad([year_data['TotRev'] for year, year_data in cur_np.items() if year.isdigit() and 'TotRev' in year_data], (0, max_length - len([year_data['TotRev'] for year, year_data in cur_np.items() if year.isdigit() and 'TotRev' in year_data]))),
        'Exps': np.pad([year_data['TotExp'] for year, year_data in cur_np.items() if year.isdigit() and 'TotExp' in year_data], (0, max_length - len([year_data['TotExp'] for year, year_data in cur_np.items() if year.isdigit() and 'TotExp' in year_data]))),
        'Liabs': np.pad([year_data['TotLia'] for year, year_data in cur_np.items() if year.isdigit() and 'TotLia' in year_data], (0, max_length - len([year_data['TotLia'] for year, year_data in cur_np.items() if year.isdigit() and 'TotLia' in year_data]))),
        'Asts': np.pad([year_data['TotAst'] for year, year_data in cur_np.items() if year.isdigit() and 'TotAst' in year_data], (0, max_length - len([year_data['TotAst'] for year, year_data in cur_np.items() if year.isdigit() and 'TotAst' in year_data])))
    }
    G.add_node(name_encoded, **attributes)
    bar.next()
bar.finish()

# Print the first 5 nodes in the graph, with their labels as well
print("Sample of the first 5 nodes in the graph:")
for node_id in list(G.nodes)[:5]:
    print(f"Node {node_id}: {G.nodes[node_id]}")






# create edges between the nodes:
# connect the nodes with edges if they share an NTEE code and are in the same state
# 
bar = Bar('Creating Edges between Nodes', max=num_test_nodes)
for node1 in G.nodes:
    for node2 in G.nodes:
        if(node1 == node2):
            continue
        if G.nodes[node1]['State'] == G.nodes[node2]['State'] and G.nodes[node1]['NTEE'] == G.nodes[node2]['NTEE']:
            G.add_edge(node1, node2)
    bar.next()
bar.finish()









# Create the DGL graph
print("Creating the DGL graph")
dgl_G = dgl.from_networkx(G, node_attrs=['City', 'State', 'Zipcode', 'NTEE', 'Revs', 'Exps', 'Liabs', 'Asts'])

# Save the graph
print("Saving the graph")
dgl.save_graphs("REAL.dgl", dgl_G)


# print the networkx graph in graph format
# plt.figure(figsize=(10, 10))
# nx.draw(G, with_labels=True)
# plt.show()


# # Create the nodes using the encoders and the data
# bar = Bar('Creating Nodes from MongoDB', max = num_test_nodes)
# for cur_np in nonprofits:
#     name_encoded = name_encoder.transform([cur_np['Nm']])[0]
#     attributes = {
#         #'Name': name_encoder.transform([cur_np['Nm']])[0],
#         'City': city_encoder.transform([cur_np['Cty']])[0],
#         'State': state_encoder.transform([cur_np['St']])[0],
#         'Zipcode': int(cur_np['Zip']),
#         'NTEE': ntee_encoder.transform([cur_np['NTEE'][0]])[0],
#         'Revs': np.array([year_data['TotRev'] for year, year_data in cur_np.items() if year.isdigit() and 'TotRev' in year_data]),
#         'Exps': np.array([year_data['TotExp'] for year, year_data in cur_np.items() if year.isdigit() and 'TotExp' in year_data]),
#         'Liabs': np.array([year_data['TotLia'] for year, year_data in cur_np.items() if year.isdigit() and 'TotLia' in year_data]),
#         'Asts': np.array([year_data['TotAst'] for year, year_data in cur_np.items() if year.isdigit() and 'TotAst' in year_data])
#     }
#     G.add_node(name_encoded, **attributes)
#     bar.next()
# bar.finish()

# # print the first 5 nodes in the graph, with their labels as well
# print("Sample of the first 5 nodes in the graph:")
# for node_id in list(G.nodes)[:5]:
#     print(f"Node {node_id}: {G.nodes[node_id]}")

# # create the dgl graph
# print("Creating the DGL graph")
# dgl_G = dgl.from_networkx(G, node_attrs=['City', 'State', 'Zipcode', 'NTEE', 'Revs', 'Exps', 'Liabs', 'Asts'])

# # Save the graph
# print("Saving the graph")
# dgl.save_graphs("REAL.dgl", dgl_G)