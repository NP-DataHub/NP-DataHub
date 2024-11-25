from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import json_util 

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)
db = client['Nonprofitly']
collection = db['NonProfitData']

first_major_group_A = collection.find_one({'MajGrp': 'A'})
if first_major_group_A:
    print("First document with MajGrp 'A':")
    print(json.dumps(first_major_group_A, default=json_util.default, indent=4))
else:
    print("No document found with MajGrp 'A'.")

client.close()
