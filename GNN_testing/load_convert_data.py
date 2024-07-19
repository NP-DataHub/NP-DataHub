import pymongo
import dgl
import torch
import networkx as nx
from sklearn.preprocessing import LabelEncoder
import os
from progress.bar import Bar

os.environ['DGLBACKEND'] = 'pytorch'  # tell DGL what backend to use, not really used but it complains if you dont

# Connect to MongoDB
uri = "mongodb+srv://ingress:HuoRitgcs5TsmcZX@np-data.fytln2i.mongodb.net/Np-Datahub"
client = pymongo.MongoClient(uri)
database = client['Np-Datahub']
collection = database['EZ']

# NetworkX digraph for eventual conversion to DGL graph
G = nx.DiGraph()

# Since a dgl graph only supports numerical node attributes, we need to encode the string attributes
name_encoder = LabelEncoder()
city_encoder = LabelEncoder()
state_encoder = LabelEncoder()


# Grab nodes from the collection
num_test_nodes = 130 # for initial 5 simulated NTEE codes
print(f"Grabbing the first {num_test_nodes} nodes from the collection")

nonprofits = list(collection.find().limit(num_test_nodes))

names = []
cities = []
states = []

for i in nonprofits:
    names.append(i['Name'])
    cities.append(i['City'])
    states.append(i['State'])

# Fit the encoders
print("Fitting the encoders")
name_encoder.fit(names)
city_encoder.fit(cities)
state_encoder.fit(states)

# Create the nodes using the encoders and the data
bar = Bar('Creating Nodes from MongoDB', max = num_test_nodes)
for cur_np in nonprofits:
    attributes = {
        'Name': name_encoder.transform([cur_np['Name']])[0],
        'EIN': int(cur_np['EIN']),
        'City': city_encoder.transform([cur_np['City']])[0],
        'State': state_encoder.transform([cur_np['State']])[0],
        'Zipcode': int(cur_np['Zipcode']),
        '_id': hash(cur_np['_id'])
    }
    G.add_node(cur_np['_id'], **attributes)
    bar.next()
bar.finish()

# create the dgl graph
print("Creating the DGL graph")
dgl_G = dgl.from_networkx(G, node_attrs=['Name', 'EIN', 'City', 'State', 'Zipcode', '_id'])

# Save the graph
print("Saving the graph")
dgl.save_graphs("EZ.dgl", dgl_G)