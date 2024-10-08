from pymongo import MongoClient
from dotenv import load_dotenv
import os
import shutil

class Cleanup:
    def __init__(self):
        load_dotenv('../frontend/.env')
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.non_profits_table = self.mongo_client["Nonprofitly"]["NonProfitData"]
        self.ntee_table = self.mongo_client["Nonprofitly"]["NationalAndStateStatistics"]
    
    def remove_incomplete_rows(self):
        # only incomplete rows don't have the Name column
        result = self.non_profits_table.delete_many({"Nm": {"$exists": False}})
        print(f"Deleted {result.deleted_count} incomplete rows.")

    def reset_ntee_table(self):
        # need to do this everytime the NonProfitData table is updated
        # in order for the NationalAndStateStatistics to be rebuilt
        self.ntee_table.deleteMany({})
        print("Deleted all rows in NationalAndStateStatistics table")

    def delete_created_files_and_folders(self, created_files, created_folders ):
        for i in range(len(created_files)):
            os.remove(created_files[i])
            print(f"Successfully deleted {created_files[i]}")
            shutil.rmtree(created_folders[i])
            print(f"Successfully deleted {created_folders[i]}")
