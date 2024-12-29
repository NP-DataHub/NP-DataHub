from pymongo import MongoClient
import os
from dotenv import load_dotenv

class AnomalyStats:
    def __init__(self):
        # Load environment variables
        if not os.getenv('MONGODB_URI'):
            load_dotenv('frontend/.env')
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.database = self.mongo_client["Nonprofitly"]
        self.anomaly_collection = self.database["anomaly"]
        self.anomaly_stats_collection = self.database["AnomalyStats"]

    def generate_stats(self):
        aggregated_data = {}

        for row in self.anomaly_collection.find({"AnomalyLabel": -1}):
            maj_grp = row["MajGrp"]
            state = row["State"]

            if maj_grp not in aggregated_data:
                aggregated_data[maj_grp] = {"MajGrp": maj_grp}

            # Increment state count
            aggregated_data[maj_grp][state] = aggregated_data[maj_grp].get(state, 0) + 1

        # Add National count for each MajGrp
        result_list = []
        for maj_grp, data in aggregated_data.items():
            national_count = sum(count for key, count in data.items() if key != "MajGrp")
            data["National"] = national_count
            result_list.append(data)
        self.anomaly_stats_collection.delete_many({})
        self.anomaly_stats_collection.insert_many(result_list)
        print("AnomalyStats table has been created successfully.")

if __name__ == "__main__":
    stats_generator = AnomalyStats()
    stats_generator.generate_stats()
