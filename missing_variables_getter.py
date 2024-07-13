import os
import pandas as pd
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed

mongo_client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
database = mongo_client["Np-Datahub"]
collections = [database["Master"], database["EZ"], database["Private"]]

# Function to update documents in batches
def update_documents(batch): # a batch contain rows
    requests = []
    for row in batch:
        ein = row.get('EIN')
        ntee_cd = row.get('NTEE_CD')
        subsection_code = row.get('SUBSECTION')
    
        if ein == '':
            continue        
        update_fields = {}
        if ntee_cd != '':
            update_fields["NTEE"] = ntee_cd
        if subsection_code != '':
            update_fields["Subsection Code"] = subsection_code
        
        # Skip if no fields to update
        if not update_fields:
            continue
        
        # Flag to check if EIN is found
        for collection in collections:
            requests.append(UpdateOne(
                {"EIN": ein},
                {"$set": update_fields}
            ))

    for collection in collections:
        if requests:
            collection.bulk_write(requests, ordered=False)

# Function to process the CSV in batches
def process_csv_in_batches(file_path, batch_size=1000):
    df = pd.read_csv(file_path)
    rows = df.to_dict(orient='records')
    total_rows = len(rows)
    
    # Calculate the number of batches
    num_batches = total_rows // batch_size + (1 if total_rows % batch_size > 0 else 0)
    
    num_cores = os.cpu_count()
    with ThreadPoolExecutor(max_workers=num_cores) as executor:
        futures = []
        for i in range(num_batches):
            start_index = i * batch_size
            end_index = min(start_index + batch_size, total_rows) #Calculate the ending index, ensuring it does not exceed total_rows.
            batch = rows[start_index:end_index] #Slice the list to get the current batch
            futures.append(executor.submit(update_documents, batch)) #Submit the batch to be processed in a separate thread
        
        for future in as_completed(futures):
            future.result()

if __name__ == "__main__":
    csv_file_path = '/Users/mr.youssef/Desktop/eo1.csv'
    process_csv_in_batches(csv_file_path)
    print("Update process completed.")
