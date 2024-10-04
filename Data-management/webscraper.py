import requests
from bs4 import BeautifulSoup
import os
import shutil
from zipfile import ZipFile
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
from Database import Database
import random

class UpdateDatabase:
    #NOTE: THIS ONLY WORKS ASSUMING IRS DOESN'T CHANGE THE PREVIOUS URL LINKS, if they do, it will unnecessarily excecute main parser on already parsed folders

    def __init__(self):
        load_dotenv('frontend/.env')
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.database = self.mongo_client["Nonprofitly"]
        self.processed_folders = set()
        self.unprocessed_folders = list()
        self.created_files = []
        self.created_folders = []
    def get_already_parsed_folders(self):
        with open('Data-management/zip_files_processed.txt', 'r') as file:
            for line in file:
                self.processed_folders.add(line.strip())
    def get_missing_zip_folders(self):
        url = "https://www.irs.gov/charities-non-profits/form-990-series-downloads"
        response = requests.get(url)
        html_content = response.content
        soup = BeautifulSoup(html_content, 'html.parser')
        all_zip_folders = soup.select('a[href$=".zip"]')
        for folder in all_zip_folders:
            folder_link = folder['href']
            if not folder_link in self.processed_folders:
                self.unprocessed_folders.append(folder_link)

    def download_missing_zip_folders(self):
        # Iterate through each unprocessed folder link
        for ziplink in self.unprocessed_folders:
            try:
                # Download the ZIP file
                r = requests.get(ziplink, allow_redirects=True)
                r.raise_for_status()  # Raise an error for bad responses
                filename = ziplink.split('/')[-2] + '-' + ziplink.split('_')[-1]
                print(ziplink.split('/'))
                print(ziplink.split('_'))
                # Save the downloaded ZIP file
                with open(f"/tmp/{filename}", 'wb') as f:
                    f.write(r.content)
                self.created_files.append(f"/tmp/{filename}")
                print(f"Downloaded and saved as: {filename}")
                # Create a folder name by removing the .zip extension
                folder_name = filename.replace('.zip', '')
                # Unzip the file
                with ZipFile(f"/tmp/{filename}", 'r') as zObject:
                    zObject.extractall(f"/tmp/{folder_name}")
                self.created_folders.append(f"/tmp/{folder_name}")
                print(f"Extracted: {filename} to folder: {folder_name}")

                # Optionally, you can keep track of downloaded zip files
                with open('Data-management/zip_files_processed.txt', 'a') as processed_file:
                    processed_file.write('\n' + ziplink )
            except Exception as e:
                print(f"Error downloading {ziplink}: {e}")
    def delete_created_files_and_folders(self):
        for i in range(len(self.created_files)):
            os.remove(self.created_files[i])
            print(f"Successfully deleted {self.created_files[i]}")
            shutil.rmtree(self.created_folders[i])
            print(f"Successfully deleted {self.created_folders[i]}")

# Example usage
if __name__ == "__main__":
    updater = UpdateDatabase()
    updater.get_already_parsed_folders()
    updater.get_missing_zip_folders()
    updater.download_missing_zip_folders()
    updater.delete_created_files_and_folders()
    mongo_client = MongoClient(os.getenv('MONGODB_URI'))
    collection = mongo_client["Nonprofitly"]['NonProfitData']
    document = collection.find({ "Nm": "Rensselaer Polytechnic Institute" })

    if document:
        print("Random document from MongoDB:")
        print(document)
    else:
        print("No documents found in the MongoDB collection.")

    # t = Database()
    # t.test()