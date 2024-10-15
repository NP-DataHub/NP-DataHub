from pymongo import MongoClient
from dotenv import load_dotenv
import os
import shutil

class Cleanup:
    def __init__(self):
        # Only load .env if MONGODB_URI is not already in the environment, because
        # it's already stored in the repository's settings as a secret
        if not os.getenv('MONGODB_URI'):
            load_dotenv('../frontend/.env')
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.non_profits_table = self.mongo_client["Nonprofitly"]["NonProfitData"]
        self.ntee_table = self.mongo_client["Nonprofitly"]["NationalAndStateStatistics"]
        self.missing_non_profits_table = self.mongo_client["Nonprofitly"]["MissingNonProfits"]

    
    def move_missing_nonprofits(self):
        filter_query = {"Nm": {"$exists": False}}
        missing_nonprofits = list(self.non_profits_table.find(filter_query))
        if missing_nonprofits:
            #Reset MissingNonProfits
            self.missing_non_profits_table.drop()
            # Insert missing rows into the MissingNonProfits collection
            self.missing_non_profits_table.insert_many(missing_nonprofits)
            # Delete these rows from the NonProfitData collection
            self.non_profits_table.delete_many(filter_query)

    def restore_missing_nonprofits(self):
        missing_nonprofits = list(self.missing_non_profits_table.find({}))
        if missing_nonprofits:
            # Insert rows back into the NonProfitData collection
            self.non_profits_table.insert_many(missing_nonprofits)
            # Delete rows from the MissingNonProfits collection
            self.missing_non_profits_table.drop()

    def reset_ntee_table(self):
        # need to do this everytime the NonProfitData table is updated
        # in order for the NationalAndStateStatistics to be rebuilt
        self.ntee_table.drop()
        print("Deleted all rows in NationalAndStateStatistics table")

    def delete_created_files_and_folders(self, created_files, created_folders ):
        for i in range(len(created_files)):
            os.remove(created_files[i])
            print(f"Successfully deleted {created_files[i]}")
            shutil.rmtree(created_folders[i])
            print(f"Successfully deleted {created_folders[i]}")

    def create_indices(self):
        indices = [
            {'field': {'Nm': 1}, 'name': 'index_name'},  # Index for name
            {'field': {'St': 1}, 'name': 'index_state'},  # Index for state
            {'field': {'MajGrp': 1}, 'name': 'index_major_group'},  # Index for major group
            {'field': {'St': 1, 'Cty': 1}, 'name': 'index_state_city'},  # Compound index for state and city
            {'field': {'St': 1, 'Cty': 1, 'MajGrp': 1}, 'name': 'index_state_city_major_group'},  # Compound index for state, city, and major group
            {'field': {'St': 1, 'MajGrp': 1}, 'name': 'index_state_major_group'}  # Compound index for state and major group
        ]
        # Create indices
        for index in indices:
            self.non_profits_table.create_index(index['field'], name=index['name'])
        print("All indices have been added.")

    def drop_all_indices(self):
        # Drop all indices except for the default _id index
        self.non_profits_table.drop_indexes()
        print("All non-default indices have been temporarily removed.")
