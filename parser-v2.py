import os
import xml.etree.ElementTree as ET
import requests
from pymongo import MongoClient, UpdateOne

class Database:
    def __init__(self):
        self.root = None
        self.namespace = {'irs': 'http://www.irs.gov/efile'}
        self.mongo_client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
        self.database = self.mongo_client["Test"]
        self.collection = self.database["test"]

    def get_ein_and_tax_period(self, file_path):
        ein_element = self.root.find('.//irs:Filer/irs:EIN', self.namespace)
        ein = ein_element.text if ein_element is not None else "None"
        tax_period_element = self.root.find('.//irs:TaxYr', self.namespace)
        tax_period = tax_period_element.text if tax_period_element is not None else "None"
        return ein, tax_period

    def get_ntee_and_subsection(self, ein):
        url = f"https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            ntee = data["organization"]["ntee_code"] if data["organization"]["ntee_code"] else "None"
            major_group = ntee[0] if ntee else "None"
            subsection = data["organization"]["subsection_code"] if data["organization"]["subsection_code"] else "None"
            return ntee, major_group, subsection
        else:
            return "None", "None", "None"

    def get_general_information(self, ein, file_path):
        name_element = self.root.find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', self.namespace)
        name = name_element.text if name_element is not None else "None"
        state_element = self.root.find('.//irs:Filer/irs:USAddress/irs:StateAbbreviationCd', self.namespace)
        state = state_element.text if state_element is not None else "None"
        city_element = self.root.find('.//irs:Filer/irs:USAddress/irs:CityNm', self.namespace)
        city = city_element.text if city_element is not None else "None"
        zip_code_element = self.root.find('.//irs:Filer/irs:USAddress/irs:ZIPCd', self.namespace)
        zip_code = zip_code_element.text if zip_code_element is not None else "None"
        ntee, major_group, subsection_code = self.get_ntee_and_subsection(ein)
        return name, state, city, zip_code, ntee, major_group, subsection_code

    def get_financial_information(self, return_type):
        if return_type == "990":
            total_revenue_element = self.root.find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', self.namespace)
            total_assets_element = self.root.find('.//irs:TotalAssetsGrp/irs:EOYAmt', self.namespace)
            total_liabilities_element = self.root.find('.//irs:TotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
            total_expenses_element = self.root.find('.//irs:TotalFunctionalExpensesGrp/irs:TotalAmt', self.namespace)
        elif return_type == "990EZ":
            total_revenue_element = self.root.find('.//irs:TotalRevenueAmt', self.namespace)
            total_assets_element = self.root.find('.//irs:Form990TotalAssetsGrp/irs:EOYAmt', self.namespace)
            total_liabilities_element = self.root.find('.//irs:SumOfTotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
            total_expenses_element = self.root.find('.//irs:TotalExpensesAmt', self.namespace)
        total_revenue = int(total_revenue_element.text) if total_revenue_element is not None else 0
        total_assets = int(total_assets_element.text) if total_assets_element is not None else 0
        total_liabilities = int(total_liabilities_element.text) if total_liabilities_element is not None else 0
        total_expenses = int(total_expenses_element.text) if total_expenses_element is not None else 0
        return total_revenue, total_assets, total_liabilities, total_expenses

    def build_database(self, file_path, operations):
        self.root = ET.parse(file_path).getroot()
        return_type_element = self.root.find('.//irs:ReturnTypeCd', self.namespace)
        return_type = return_type_element.text if return_type_element is not None else None

        if return_type not in ["990", "990EZ"]:
            return

        ein, tax_period = self.get_ein_and_tax_period(file_path)
        if not ein or not tax_period:
            return

        name, state, city, zip_code, ntee, major_group, subsection_code = self.get_general_information(ein, file_path)
        total_revenue, total_assets, total_liabilities, total_expenses = self.get_financial_information(return_type)

        update_fields = {
            "Name": name,
            "City": city,
            "State": state,
            "Zipcode": zip_code,
            "NTEE": ntee,
            "Major Group": major_group,
            "Subsection code": subsection_code,
            f"{tax_period}.Total Revenue": total_revenue,
            f"{tax_period}.Total Assets": total_assets,
            f"{tax_period}.Total Liabilities": total_liabilities,
            f"{tax_period}.Total Expenses": total_expenses
        }

        operation = UpdateOne(
            {"EIN": ein},
            {"$set": update_fields},
            upsert=True
        )
        operations.append(operation)

    def process_all_xml_files(self, directory):
        count = 0
        operations = []
        for filename in os.listdir(directory):
            count = count + 1
            if count%100 == 0 :
                print("counted files:", count)
            if filename.endswith('.xml'):
                file_path = os.path.join(directory, filename)
                self.build_database(file_path, operations)
                if len(operations) >= 1000:  # Perform bulk write every 1000 operations
                    self.bulk_write_to_mongo(operations)
                    operations = []
        if operations:  # Write remaining operations
            self.bulk_write_to_mongo(operations)

    def bulk_write_to_mongo(self, operations):
        self.collection.bulk_write(operations)

if __name__ == "__main__":
    directory = '/Users/mr.youssef/Desktop/2020files'
    obj = Database()
    obj.process_all_xml_files(directory)
    print("Data has been successfully inserted into MongoDB.")
