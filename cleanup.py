from pymongo import MongoClient

if __name__ == "__main__":
	mongo_client = MongoClient("mongodb+srv://Admin:Admin@np-data.fytln2i.mongodb.net/?retryWrites=true&w=majority&appName=NP-Data")
	database = mongo_client["Np-Datahub"]
	collection = database["NonProfitData"]
	result = collection.delete_many({"Name": {"$exists": False}})
	print(f"Deleted {result.deleted_count} incomplete rows.")