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

    def get_ein_and_tax_period(self,file_path):
        ein_element = (self.root).find('.//irs:Filer/irs:EIN', self.namespace)
        ein = int(ein_element.text) if ein_element is not None else print("ein not found in file: ",file_path) or None
        # Extract Tax period
        tax_period_element = (self.root).find('.//irs:TaxYr', self.namespace)
        tax_period = tax_period_element.text if tax_period_element is not None else print("taxyear not found in file: ",file_path) or None
        return ein,tax_period

    def get_ntee_and_subsection(self,ein):
        url = "https://projects.propublica.org/nonprofits/api/v2/organizations/"+ ein+".json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            ntee = data["organization"]["ntee_code"] if data["organization"]["ntee_code"] else print("ntee not found at  ", ein) or "None"
            major_group = ntee[0];
            subsection = data["organization"]["subsection_code"] if data["organization"]["subsection_code"] else print("subsection code not found at  ", ein) or "None"
            return ntee, major_group, subsection
        else:
            print("ERROR: Could not find the company") 

    def get_general_information(self,ein,file_path):
        name_element = (self.root).find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', self.namespace)
        name = name_element.text if name_element is not None else print("name not found in file: ",file_path) or None
        state_element = (self.root).find('.//irs:Filer/irs:USAddress/irs:StateAbbreviationCd', self.namespace)
        state = state_element.text if state_element is not None else print("state not found in file: ",file_path) or None
        city_element = (self.root).find('.//irs:Filer/irs:USAddress/irs:CityNm', self.namespace)
        city = city_element.text if city_element is not None else print("city not found in file: ",file_path) or None
        zip_code_element = (self.root).find('.//irs:Filer/irs:USAddress/irs:ZIPCd', self.namespace)
        zip_code = zip_code_element.text if zip_code_element is not None else print("zipcode not found in file: ",file_path) or None
        ntee,major_group,subsection_code = self.get_ntee_and_subsection(str(ein))
        return name,state,city,zip_code,ntee,major_group,subsection_code


    def get_master_financial_information(self,file_path):
        total_revenue_element = (self.root).find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', self.namespace)
        total_revenue = total_revenue_element.text if total_revenue_element is not None else print("revenue not found in file: ",file_path) or None
        total_assets_element = (self.root).find('.//irs:TotalAssetsGrp/irs:EOYAmt', self.namespace)
        total_assets = total_assets_element.text if total_assets_element is not None else print("assets not found in file: ",file_path) or None
        total_liabilities_element = (self.root).find('.//irs:TotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
        total_liabilities = total_liabilities_element.text if total_liabilities_element is not None else print("Liabilities not found in file: ",file_path) or None
        total_expenses_element = (self.root).find('.//irs:TotalFunctionalExpensesGrp/irs:TotalAmt', self.namespace)
        total_expenses = total_expenses_element.text if total_expenses_element is not None else print("expenses not found in file: ",file_path) or None
        #total_contributions = (self.root).find('.//irs:TotalContributionsAmt', self.namespace)
        return total_revenue,total_assets,total_liabilities,total_expenses

    def get_EZ_financial_information(self,file_path):
        total_revenue_element = (self.root).find('.//irs:TotalRevenueAmt', self.namespace)
        total_revenue = total_revenue_element.text if total_revenue_element is not None else print("revenue not found in file ((only one var found)): ",file_path) or None
        total_assets_element = (self.root).find('.//irs:Form990TotalAssetsGrp/irs:EOYAmt', self.namespace)
        total_assets = total_assets_element.text if total_assets_element is not None else print("assets not found in file: ",file_path) or None
        total_liabilities_element = (self.root).find('.//irs:SumOfTotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
        total_liabilities = total_liabilities_element.text if total_liabilities_element is not None else print("Liabilities (only one var found) not found in file: ",file_path) or None
        total_expenses_element = (self.root).find('.//irs:TotalExpensesAmt', self.namespace)
        total_expenses = total_expenses_element.text if total_expenses_element is not None else print("expenses not found in file (only one var found): ",file_path) or None
        #total_contributions = (self.root).find('.//irs:TotalContributionsAmt', self.namespace)
        return total_revenue,total_assets,total_liabilities,total_expenses

    def build_database(self,file_path):
        self.root = (ET.parse(file_path)).getroot()

        #Check for public or private
        return_type_element = (self.root).find('.//irs:ReturnTypeCd', self.namespace)
        return_type = return_type_element.text if return_type_element is not None else print("return type not found in file: ",file_path) or None

        if return_type == "990":
            ein,tax_period = self.get_ein_and_tax_period(file_path)
            if ein not in self.public_data:
                name,state,city,zip_code,ntee,major_group,subsection_code = self.get_general_information(ein,file_path)
                total_revenue,total_assets,total_liabilities,total_expenses = self.get_master_financial_information(file_path)
                self.public_data[ein] = {
                    "Name": name,
                    "City": city,
                    "State": state,
                    "Zipcode": zip_code,
                    "NTEE" : ntee,
                    "Major Group": major_group,
                    "Subsection code": subsection_code,
                    tax_period: {
                        "Total Revenue": total_revenue,
                        "Total Assets" : total_assets,
                        "Total Liabilities" : total_liabilities,
                        "Total Expenses" : total_expenses
                    }
                }
            else :
                print("two MASTER filings of same company in same folder spotted:", file_path, ein)
                if tax_period not in self.public_data[ein]:
                    total_revenue,total_assets,total_liabilities,total_expenses = self.get_master_financial_information(file_path)
                    self.public_data[ein][tax_period] = {
                        "Total Revenue": total_revenue,
                        "Total Assets" : total_assets,
                        "Total Liabilities" : total_liabilities,
                        "Total Expenses" : total_expenses

                   }
                else:
                    print("This shouldn't happen, two MASTER files of same company of same tax year exists",file_path)

        elif return_type == "990EZ":
            ein,tax_period = self.get_ein_and_tax_period(file_path)
            if ein not in self.public_data:
                name,state,city,zip_code,ntee,major_group,subsection_code = self.get_general_information(ein,file_path)
                total_revenue,total_assets,total_liabilities,total_expenses = self.get_EZ_financial_information(file_path)
                self.public_data[ein] = {
                    "Name": name,
                    "City": city,
                    "State": state,
                    "Zipcode": zip_code,
                    "NTEE" : ntee,
                    "Major Group": major_group,
                    "Subsection code": subsection_code,
                    tax_period: {
                        "Total Revenue": total_revenue,
                        "Total Assets" : total_assets,
                        "Total Liabilities" : total_liabilities,
                        "Total Expenses" : total_expenses
                    }
                }
            else :
                print("two EZ filings of same company in same folder spotted:", file_path, ein)
                if tax_period not in self.public_data[ein]:
                    total_revenue,total_assets,total_liabilities,total_expenses = self.get_EZ_financial_information(file_path)
                    self.public_data[ein][tax_period] = {
                        "Total Revenue": total_revenue,
                        "Total Assets" : total_assets,
                        "Total Liabilities" : total_liabilities,
                        "Total Expenses" : total_expenses

                   }
                else:
                    print("This shouldn't happen, two EZ files of same company of same tax year exists", file_path)


    def process_all_xml_files(self,directory):
        # List all files in the directory
        for filename in os.listdir(directory):
            if filename.endswith('.xml'):
                file_path = os.path.join(directory, filename)
                self.build_database(file_path)


if __name__ == "__main__":

    # Specify the directory containing the XML files
    directory = '/Users/mr.youssef/Desktop/2020files'
    obj = Database()
    # Process all XML files and store data in a list
    obj.process_all_xml_files(directory)
    lst  = []
    for ein, details in obj.public_data.items():
        new_ein = str(ein) if len(str(ein)) == 9 else '0' + str(ein)
        new_dict = {"EIN": new_ein}
        new_dict.update(details)
        lst.append(new_dict)
    #Insert the data into MongoDB
    client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
    database = client["Test"]
    collection = database["test"]
    # Insert data into the collection
    collection.insert_many(lst)


    print("Data has been successfully inserted into MongoDB.")