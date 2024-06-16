import os
import requests
from lxml import etree as ET
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed
import multiprocessing

class Database:
    def __init__(self):
        self.public_data = {}
        self.namespace = {'irs': 'http://www.irs.gov/efile'}
        self.cache = {}

    def get_ein_and_tax_period(self, root):
        ein_element = root.find('.//irs:Filer/irs:EIN', self.namespace)
        ein = int(ein_element.text) if ein_element is not None else "None"
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
            return "None", "N", "None"

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
        total_revenue = int(total_revenue_element.text) if total_revenue_element is not None else 0
        total_assets = int(total_assets_element.text) if total_assets_element is not None else 0
        total_liabilities = int(total_liabilities_element.text) if total_liabilities_element is not None else 0
        total_expenses = int(total_expenses_element.text) if total_expenses_element is not None else 0
        return total_revenue, total_assets, total_liabilities, total_expenses

    def build_database(self, file_path):
        root = ET.parse(file_path).getroot()

        return_type_element = root.find('.//irs:ReturnTypeCd', self.namespace)
        return_type = return_type_element.text if return_type_element is not None else None

        if return_type not in ["990", "990EZ"]:
            return None

        ein, tax_period = self.get_ein_and_tax_period(root)
        if not ein or not tax_period:
            return None

        name, state, city, zip_code = self.get_general_information(root)
        ntee, major_group, subsection_code = self.get_ntee_and_subsection(str(ein))
        total_revenue, total_assets, total_liabilities, total_expenses = self.get_financial_information(root, return_type)

        if ein not in self.public_data:
            self.public_data[ein] = {
                "Name": name,
                "City": city,
                "State": state,
                "Zipcode": zip_code,
                "NTEE": ntee,
                "Major Group": major_group,
                "Subsection code": subsection_code,
                tax_period: {
                    "Total Revenue": total_revenue,
                    "Total Assets": total_assets,
                    "Total Liabilities": total_liabilities,
                    "Total Expenses": total_expenses
                }
            }
        else:
            if tax_period not in self.public_data[ein]:
                self.public_data[ein][tax_period] = {
                    "Total Revenue": total_revenue,
                    "Total Assets": total_assets,
                    "Total Liabilities": total_liabilities,
                    "Total Expenses": total_expenses
                }
            #else:
               # print("This shouldn't happen, two files of the same company for the same tax year exist:", file_path)

        return ein, tax_period

    def process_all_xml_files(self, directory):
        num_cores = multiprocessing.cpu_count()
        with ThreadPoolExecutor(max_workers=num_cores) as executor:
            futures = []
            for filename in os.listdir(directory):
                if filename.endswith('.xml'):
                    file_path = os.path.join(directory, filename)
                    future = executor.submit(self.build_database, file_path)
                    futures.append(future)

            for future in as_completed(futures):
                future.result()

    def insert_into_mongo(self):
        lst = []
        for ein, details in self.public_data.items():
            new_ein = str(ein) if len(str(ein)) == 9 else '0' + str(ein)
            new_dict = {"EIN": new_ein}
            new_dict.update(details)
            lst.append(new_dict)
        client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
        database = client["Test"]
        collection = database["test"]
        collection.insert_many(lst)

if __name__ == "__main__":
    directory = '/Users/mr.youssef/Desktop/NpDataHub/unitTesting'
    obj = Database()
    obj.process_all_xml_files(directory)
    obj.insert_into_mongo()
    print("Data has been successfully inserted into MongoDB.")
