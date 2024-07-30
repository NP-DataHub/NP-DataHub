from pymongo import MongoClient

if __name__ == "__main__":
	mongo_client = MongoClient("mongodb+srv://hassay:TryAgain@npdatahub.f3sg8sf.mongodb.net/")
	database = mongo_client["NpDatahub"]
	collection = database["NonProfitData"]
	result = collection.delete_many({"Nm": {"$exists": False}})
	print(f"Deleted {result.deleted_count} incomplete rows.")