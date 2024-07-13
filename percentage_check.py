from pymongo import MongoClient

# Define the MongoDB connection and collections
mongo_client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
database = mongo_client["Np-Datahub"]
collections = {
    "Master": database["Master"],
    "EZ": database["EZ"],
    "Private": database["Private"]
}

def calculate_none_ntee_percentage(collection):
    total_documents = collection.count_documents({})
    none_ntee_documents = collection.count_documents({"NTEE": "None"})
    
    if total_documents == 0:
        return 0.0  # Avoid division by zero

    percentage_none_ntee = (none_ntee_documents / total_documents) * 100
    return percentage_none_ntee

if __name__ == "__main__":
    for collection_name, collection in collections.items():
        percentage = calculate_none_ntee_percentage(collection)
        print(f"Collection '{collection_name}' has {percentage:.2f}% of documents with 'NTEE' field set to None.")
