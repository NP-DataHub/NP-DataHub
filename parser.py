import os
import xml.etree.ElementTree as ET
import json
import requests
from pymongo import MongoClient

class Database:
    def __init__(self):
        self.public_data = {}
        self.private_data = {}
        self.root = None
        self.namespace = {'irs': 'http://www.irs.gov/efile'}

    def get_ein_and_tax_period(self):
        ein_element = (self.root).find('.//irs:Filer/irs:EIN', self.namespace)
        ein = int(ein_element.text) or None
        # Extract Tax period
        tax_period_element = (self.root).find('.//irs:TaxYr', self.namespace)
        tax_period = tax_period_element.text or None
        return ein,tax_period

    def get_ntee_and_subsection(self,ein):
        url = "https://projects.propublica.org/nonprofits/api/v2/organizations/"+ ein+".json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            ntee  = data["organization"]["ntee_code"] or "None"
            major_group = ntee[0];
            subsection = data["organization"]["subsection_code"]
            return ntee, major_group, subsection
        else:
            print("ERROR: Could not find the company") 

    def get_general_information(self,ein):
        name_element = (self.root).find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', self.namespace)
        name = name_element.text or None
        state_element = (self.root).find('.//irs:Filer/irs:USAddress/irs:StateAbbreviationCd', self.namespace)
        state = state_element.text or None
        city_element = (self.root).find('.//irs:Filer/irs:USAddress/irs:CityNm', self.namespace)
        city = city_element.text or None
        zip_code_element = (self.root).find('.//irs:Filer/irs:USAddress/irs:ZIPCd', self.namespace)
        zip_code = zip_code_element.text or None
        ntee,major_group,subsection_code = self.get_ntee_and_subsection(str(ein))
        return name,state,city,zip_code,ntee,major_group,subsection_code


    def get_public_financial_information(self):
        total_revenue_element = (self.root).find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', self.namespace)
        total_revenue = total_revenue_element.text or None
        return total_revenue

    def build_database(self,file_path):
        self.root = (ET.parse(file_path)).getroot()

        #Check for public or private
        return_type_element = (self.root).find('.//irs:ReturnTypeCd', self.namespace)
        return_type = return_type_element.text or None

        if return_type == "990PF":
            print("tkt")
        else :
            ein,tax_period = self.get_ein_and_tax_period()
            if ein not in self.public_data:
                name,state,city,zip_code,ntee,major_group,subsection_code = self.get_general_information(ein)
                total_revenue = self.get_public_financial_information()
                self.public_data[ein] = {
                    "Name": name,
                    "City": city,
                    "State": state,
                    "Zipcode": zip_code,
                    "NTEE" : ntee,
                    "Major Group": major_group,
                    "Subsection code": subsection_code,
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
                self.build_database(file_path)

    def insert_data_into_mongodb(self, db_name, collection_name):
        # Connect to MongoDB
        client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/?retryWrites=true&w=majority&appName=Youssef")
        database = client[db_name]
        collection = database[collection_name]
        # Insert data into the collection
        collection.insert_many(self.public_data)


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

    print("Data has been successfully inserted into MongoDB.")