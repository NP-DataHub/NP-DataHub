import csv
import os
from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor

mongo_client = MongoClient("mongodb+srv://Admin:Admin@np-data.fytln2i.mongodb.net/?retryWrites=true&w=majority&appName=NP-Data")
database = mongo_client["Np-Datahub"]
collections = {
    "990": database["Master"],
    "990EZ": database["EZ"],
    "990PF": database["Private"]
}

def update_document(ein, subsection, ntee_cd):
    for collection_name, collection in collections.items():
        result = collection.find_one({"ein": ein})
        if result:
            collection.update_one(
                {"ein": ein},
                {"$set": {"NTEE": ntee_cd, "Subsection Code": subsection}},
            )
            return

def process_row(row):
    ein = row['EIN'] 
    ntee_cd = row['NTEE_CD'] # add check if empty, then keep None
    #subsection = row['SUBSECTION'] # add check if empty, then keep None
    update_document(ein, subsection, ntee_cd)

if __name__ == "__main__":
    # Read the CSV file and process each row in parallel
    with open('/Users/mr.youssef/Desktop/eo1.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)

    num_cores = os.cpu_count()
    with ThreadPoolExecutor(max_workers=num_cores) as executor:
        executor.map(process_row, rows)

    print("Update process completed.")
