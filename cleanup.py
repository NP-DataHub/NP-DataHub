from pymongo import MongoClient

if __name__ == "__main__":
	mongo_client = MongoClient("mongodb+srv://hassay:TryAgain@cluster0.miuqsxd.mongodb.net/")
	database = mongo_client["Np-Datahub"]
	collection = database["NonProfitData"]
	result = collection.delete_many({"Name": {"$exists": False}})
	print(f"Deleted {result.deleted_count} incomplete rows.")