import pandas as pd
from pymongo import MongoClient, InsertOne
from dotenv import load_dotenv
import os

def count_incomplete_ntee_in_csv():
    file_path = '/Users/mr.youssef/Desktop/'

    filing_req_codes = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14]
    
    counts = {code: 0 for code in filing_req_codes}
    pf_counts = {code: 0 for code in ["Public", "Private"]}
    total_rows = 0

    files = ['eo1.csv', 'eo2.csv', 'eo3.csv', 'eo4.csv']
    
    for file in files:
        df = pd.read_csv(file_path + file)
        total_rows += df.shape[0]
        
        for code in filing_req_codes:
            count = len(df[(df['FILING_REQ_CD'] == code) & (df['NTEE_CD'].isna())])
            counts[code] += count  # Accumulate the counts across files
        
        pf_counts["Public"] += len(df[(df['PF_FILING_REQ_CD'] == 0) & (df['NTEE_CD'].isna())])
        pf_counts["Private"] += len(df[(df['PF_FILING_REQ_CD'] == 1) & (df['NTEE_CD'].isna())])

    total_percentage = 0
    for code, count in counts.items():
        total_percentage += 100*(count/total_rows)
        print(f'FILING_REQ_CD = {code}: {100 * (count / total_rows):.2f}% rows with NTEE_CD as None')
    print(f"Total percentage is {total_percentage:.2f}")
    print(f'Private: {100*(pf_counts["Private"]/total_rows):.2f}% rows with NTEE_CD as None')

    return counts, pf_counts, total_rows

def count_incomplete_rows_and_ntee():
    # Only load .env if MONGODB_URI is not already in the environment, because
    # it's already stored in the repository's settings as a secret
    if not os.getenv('MONGODB_URI'):
        load_dotenv('frontend/.env')
    mongo_client = MongoClient(os.getenv('MONGODB_URI'))
    database = mongo_client["Nonprofitly"]
    collection = database["NonProfitData"]
    imcomplete_rows = collection.count_documents({"Nm": {"$exists": False}})
    complete_rows = collection.count_documents({"Nm": {"$exists": True}})
    total_rows = imcomplete_rows+complete_rows
    actual_missing_ntee = collection.count_documents({
        "Nm": {
            "$exists": True
        },
        "NTEE": {
            "$regex": "^Z"
        }
    })
    incomplete_missing_ntee = collection.count_documents({
        "Nm": {
            "$exists": False
        },
        "NTEE": {
            "$regex": "^Z"
        }
    })
    print(f"{imcomplete_rows} incomplete rows.")
    print(f"{complete_rows} complete rows.")
    print(f"Total {total_rows} rows.")
    print(f" - {100*(complete_rows/total_rows):.2f}% complete rows and {100*(imcomplete_rows/total_rows):.2f}% incomplete rows")
    print(f" - {actual_missing_ntee} valid documents where the 'NTEE' starts with 'Z'.")
    print(f" - Percentage of actual missing NTEE is {((actual_missing_ntee/complete_rows)*100):.2f}%")
    print(f" - Percentage of missing NTEE from incomplete rows {((incomplete_missing_ntee/imcomplete_rows)*100):.2f}%")
    return complete_rows

def count_years_per_row(complete_rows):
    # Only load .env if MONGODB_URI is not already in the environment, because
    # it's already stored in the repository's settings as a secret
    if not os.getenv('MONGODB_URI'):
        load_dotenv('frontend/.env')
    mongo_client = MongoClient(os.getenv('MONGODB_URI'))
    database = mongo_client["Nonprofitly"]
    collection = database["NonProfitData"]
    total = 0 #seems to start with 2022
    for x in range(19, 10, -1):
        result = collection.count_documents({
            "$expr": {
                "$eq": [{ "$size": { "$objectToArray": "$$ROOT" } }, x]
            }
        })
        total += result
        print(f"Counted {result} documents that have exactly {x-10} years of data, which represent {100*(result/complete_rows):.2f}% of all complete rows")        
        document = collection.find_one({
            "$expr": {
                "$eq": [{ "$size": { "$objectToArray": "$$ROOT" } }, x]
            }
        })
        print(f"Name of one of them: {document.get('Nm')} \n")
    assert (total == complete_rows)


if __name__ == "__main__":
    #count_incomplete_ntee_in_csv()
    complete_rows = count_incomplete_rows_and_ntee()
    print(50*'=','\n')
    count_years_per_row(complete_rows)
