import os
import pandas as pd
from pymongo import MongoClient, InsertOne
from concurrent.futures import ThreadPoolExecutor, as_completed

class DatabaseStarter:
    def __init__(self):
        self.mongo_client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
        self.database = self.mongo_client["Np-Datahub"]
        self.initial_data = []

    def update_documents(self, batch):

        for row in batch:
            ein = str(row.get('EIN'))

            while len(ein) < 9:
                ein = '0' + ein
            
            ntee_cd = str(row.get('NTEE_CD'))
            if ntee_cd == "nan":
                ntee_cd = "Z"
            subsection_code = str(row.get('SUBSECTION'))
            if subsection_code == "nan": # wont happen they re all present
                subsection_code = "Z"

            self.initial_data.append({
                "EIN": ein,
                "NTEE": ntee_cd,
                "Subsection Code": subsection_code
            })

    def process_csv(self, file_path):
        df = pd.read_csv(file_path)
        rows = df.to_dict(orient='records')
        with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
            futures = [executor.submit(self.update_documents, [row]) for row in rows]
            for future in as_completed(futures):
                future.result()

    def insert_data(self):
        if self.initial_data:
            self.database["Table1"].insert_many(self.initial_data)

if __name__ == "__main__":
    file_path = '/Users/mr.youssef/Desktop/'
    files = ['eo1.csv','eo2.csv','eo3.csv','eo4.csv']
    obj = DatabaseStarter()
    for file in files:
        obj.process_csv(file_path+file)
    obj.insert_data()
    print("Process Completed.")
