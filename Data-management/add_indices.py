from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Establish connection
if not os.getenv('MONGODB_URI'):
    load_dotenv('../frontend/.env')
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['Nonprofitly']
collection = db['NonProfitData']

indices = [
    {'field': {'Nm': 1}, 'name': 'index_name'},  # Index for name
    {'field': {'St': 1}, 'name': 'index_state'},  # Index for state
    {'field': {'MajGrp': 1}, 'name': 'index_major_group'},  # Index for major group
    {'field': {'St': 1, 'Cty': 1}, 'name': 'index_state_city'},  # Compound index for state and city
    {'field': {'St': 1, 'Cty': 1, 'MajGrp': 1}, 'name': 'index_state_city_major_group'},  # Compound index for state, city, and major group
    {'field': {'St': 1, 'MajGrp': 1}, 'name': 'index_state_major_group'}  # Compound index for state and major group
]

for index in indices:
    collection.create_index(index['field'], name=index['name'])
    print(f"Index created: {index['name']} on fields {index['field']}")

print("All indices have been added.")
