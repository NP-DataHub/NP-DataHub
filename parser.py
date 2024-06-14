import os
import xml.etree.ElementTree as ET
import json
import requests
from pymongo import MongoClient

class Database:
    def __init__(self):
        self.public_data = {}
        self.private_data = {}

    def get_general_information(self,root,namespace):

    def extract_non_profit_data(self,file_path):
        # Parse the XML file
        tree = ET.parse(file_path)
        root = tree.getroot()
        # Define the namespace
        namespace = {'irs': 'http://www.irs.gov/efile'}
        
        #Check for public or private
        return_type_element = root.find('.//irs:ReturnTypeCd', namespace)
        return_type = return_type_element.text if return_type_element is not None else None

        if return_type == "990PF":
            print("tkt")
        else :
            # Extract EIN keep it string and add check for 0 in begining if too short
            ein_element = root.find('.//irs:Filer/irs:EIN', namespace)
            ein = int(ein_element.text) if ein_element is not None else None
            # Extract Tax period
            tax_period_element = root.find('.//irs:TaxYr', namespace)
            tax_period = tax_period_element.text if tax_period_element is not None else None
            if ein not in self.public_data:
                # Extract Name of Organization
                name_organization_element = root.find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', namespace)
                name_organization = name_organization_element.text if name_organization_element is not None else None
                # Extract TotalRevenue
                total_revenue_element = root.find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', namespace)
                total_revenue = total_revenue_element.text if total_revenue_element is not None else None
                self.public_data[ein] = {
                    "Name": name_organization,
                    tax_period: {
                        "Total Revenue": total_revenue
                    }
                }
            else :
                if tax_period not in self.public_data[ein]:
                   self.public_data[ein][tax_period] = {
                        "Total Revenue": total_revenue
                   }
                else:
                    print("This shouldn't happen, two files of same company of same tax year exists")


    def process_all_xml_files(self,directory):
        # List all files in the directory
        for filename in os.listdir(directory):
            if filename.endswith('.xml'):
                file_path = os.path.join(directory, filename)
                self.extract_non_profit_data(file_path)

    def insert_data_into_mongodb(self, db_name, collection_name):
        # Connect to MongoDB
        client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/?retryWrites=true&w=majority&appName=Youssef")
        database = client[db_name]
        collection = database[collection_name]

        # Insert data into the collection
        collection.insert_many(self.public_data)

    def get_from_api(ein):
        url = "https://projects.propublica.org/nonprofits/api/v2/organizations/"+ein+".json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            ntee  = data["organization"]["ntee_code"]
            ntee_section = ntee[0];
            subsection = data["organization"]["subsection_code"]
            return [ntee, ntee_section, subsection]
        else:
            print("ERROR: Could not find the company") 

if __name__ == "__main__":

    # Specify the directory containing the XML files
    directory = '/Users/mr.youssef/Desktop/NpDataHub/unitTesting'
    obj = Database()
    # Process all XML files and store data in a list
    obj.process_all_xml_files(directory)

    # Insert the data into MongoDB
    #insert_data_into_mongodb(all_data, 'Test', 'test')
    lst  = []
    for ein, details in obj.public_data.items():
        new_ein = str(ein) if len(str(ein)) == 9 else '0' + str(ein)
        new_dict = {"EIN": new_ein}
        new_dict.update(details)
        lst.append(new_dict)

    for company in lst:
        print(f"EIN: {company['EIN']}")
        print(f"Name: {company['Name']}")
        for year in sorted(key for key in company.keys() if key.isdigit()):
            print(f"  {year}:")
            print(f"    Revenue: {company[year]['Total Revenue']}")
        print()  # Blank line for readability between organizations

    #print("Data has been successfully inserted into MongoDB.")