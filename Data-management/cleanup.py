from pymongo import MongoClient
from dotenv import load_dotenv

if __name__ == "__main__":
	load_dotenv('../frontend/.env')
	mongo_client = MongoClient(os.getenv('MONGODB_URI'))
	database = mongo_client["Nonprofitly"]
	collection = database["NonProfitData"]
	result = collection.delete_many({"Nm": {"$exists": False}})
	print(f"Deleted {result.deleted_count} incomplete rows.")