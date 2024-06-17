import os
import requests
from lxml import etree as ET
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed

class Database:
    def __init__(self):
        self.namespace = {'irs': 'http://www.irs.gov/efile'}
        self.mongo_client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
        self.database = self.mongo_client["Np-Datahub"]
        self.collections = {
            "990": self.database["Master"],
            "990EZ": self.database["EZ"],
            "990PF": self.database["Private"]
        }
        self.cache = {}

    def get_ein_and_tax_period(self, root):
        ein_element = root.find('.//irs:Filer/irs:EIN', self.namespace)
        ein = ein_element.text if ein_element is not None else "None"
        ein = '0' + ein if len(str(ein)) == 8 else ein
        tax_period_element = root.find('.//irs:TaxYr', self.namespace)
        tax_period = tax_period_element.text if tax_period_element is not None else "None"
        return ein, tax_period

    def get_ntee_and_subsection(self, ein):
        if ein in self.cache:
            return self.cache[ein]

        url = f"https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            ntee = data["organization"]["ntee_code"] if data["organization"]["ntee_code"] else "None"
            major_group = ntee[0] if ntee else "None"
            subsection = data["organization"]["subsection_code"] if data["organization"]["subsection_code"] else "None"
            self.cache[ein] = (ntee, major_group, subsection)
            return ntee, major_group, subsection
        else:
            return "None", "None", "None"

    def get_general_information(self, root):
        name_element = root.find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', self.namespace)
        name = name_element.text if name_element is not None else "None"
        state_element = root.find('.//irs:Filer/irs:USAddress/irs:StateAbbreviationCd', self.namespace)
        state = state_element.text if state_element is not None else "None"
        city_element = root.find('.//irs:Filer/irs:USAddress/irs:CityNm', self.namespace)
        city = city_element.text if city_element is not None else "None"
        zip_code_element = root.find('.//irs:Filer/irs:USAddress/irs:ZIPCd', self.namespace)
        zip_code = zip_code_element.text if zip_code_element is not None else "None"
        return name, state, city, zip_code

    def get_financial_information(self, root, return_type):
        if return_type == "990":
            total_revenue_element = root.find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', self.namespace)
            total_assets_element = root.find('.//irs:TotalAssetsGrp/irs:EOYAmt', self.namespace)
            total_liabilities_element = root.find('.//irs:TotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
            total_expenses_element = root.find('.//irs:TotalFunctionalExpensesGrp/irs:TotalAmt', self.namespace)
        elif return_type == "990EZ":
            total_revenue_element = root.find('.//irs:TotalRevenueAmt', self.namespace)
            total_assets_element = root.find('.//irs:Form990TotalAssetsGrp/irs:EOYAmt', self.namespace)
            total_liabilities_element = root.find('.//irs:SumOfTotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
            total_expenses_element = root.find('.//irs:TotalExpensesAmt', self.namespace)
        elif return_type == "990PF":
            total_revenue_element = root.find('.//irs:TotalRevAndExpnssAmt', self.namespace)
            total_assets_element = root.find('.//irs:TotalAssetsEOYAmt', self.namespace)
            total_liabilities_element = root.find('.//irs:DividendsRevAndExpnssAmt/irs:EOYAmt', self.namespace) #its not liabilities, its
            total_expenses_element = root.find('.//irs:TotalExpensesRevAndExpnssAmt', self.namespace)

        total_revenue = int(total_revenue_element.text) if total_revenue_element is not None else 0
        total_assets = int(total_assets_element.text) if total_assets_element is not None else 0
        total_liabilities = int(total_liabilities_element.text) if total_liabilities_element is not None else 0
        total_expenses = int(total_expenses_element.text) if total_expenses_element is not None else 0
        return total_revenue, total_assets, total_liabilities, total_expenses

    def build_database(self, file_path):
        root = ET.parse(file_path).getroot()
        return_type_element = root.find('.//irs:ReturnTypeCd', self.namespace)
        return_type = return_type_element.text if return_type_element is not None else None

        if return_type not in ["990", "990EZ", "990PF"]:
            return None, None

        ein, tax_period = self.get_ein_and_tax_period(root)
        if not ein or not tax_period:
            return None, None

        name, state, city, zip_code = self.get_general_information(root)
        ntee, major_group, subsection_code = self.get_ntee_and_subsection(ein)
        total_revenue, total_assets, total_liabilities, total_expenses = self.get_financial_information(root, return_type)

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

        insertion = UpdateOne(
            {"EIN": ein},
            {"$set": update_fields},
            upsert=True
        )
        return return_type, insertion

    def process_all_xml_files(self, directory):
        num_cores = os.cpu_count()
        insertions = {"990": [], "990EZ": [], "990PF": []}
        with ThreadPoolExecutor(max_workers=num_cores) as executor:
            futures = []
            for filename in os.listdir(directory):
                if filename.endswith('.xml'):
                    file_path = os.path.join(directory, filename)
                    future = executor.submit(self.build_database, file_path)
                    futures.append(future)

            for future in as_completed(futures):
                return_type, insertion = future.result()
                if insertion:
                    insertions[return_type].append(insertion)
                    if len(insertions[return_type]) >= 1000:  # Perform bulk write every 1000 operations
                        self.bulk_write_to_mongo(insertions[return_type], return_type)
                        insertions[return_type] = []

        for return_type in insertions:
            if insertions[return_type]:  # Write remaining operations
                self.bulk_write_to_mongo(insertions[return_type], return_type)

    def bulk_write_to_mongo(self, operations, return_type):
        collection = self.collections[return_type]
        collection.bulk_write(operations)

if __name__ == "__main__":
    directory = '/Users/mr.youssef/Desktop/NpDatahub/unitTesting'
    obj = Database()
    obj.process_all_xml_files(directory)
    print("Data has been successfully inserted into MongoDB.")