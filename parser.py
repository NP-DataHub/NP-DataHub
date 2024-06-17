import os
import requests
from lxml import etree as ET
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed

class Database:
    def __init__(self):
        self.master = {}
        self.private = {}
        self.ez = {}
        self.cache = {}
        self.namespace = {'irs': 'http://www.irs.gov/efile'}

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

        if return_type not in ["990", "990EZ" , "990PF"]:
            return None

        ein, tax_period = self.get_ein_and_tax_period(root)
        if not ein or not tax_period:
            return None

        name, state, city, zip_code = self.get_general_information(root)
        ntee, major_group, subsection_code = self.get_ntee_and_subsection(str(ein))
        total_revenue, total_assets, total_liabilities, total_expenses = self.get_financial_information(root, return_type)

        if return_type == "990" :
            if ein not in self.master:
                self.master[ein] = {
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
                if tax_period not in self.master[ein]:
                    self.master[ein][tax_period] = {
                        "Total Revenue": total_revenue,
                        "Total Assets": total_assets,
                        "Total Liabilities": total_liabilities,
                        "Total Expenses": total_expenses
                    }
                #else:
                   # print("This shouldn't happen, two files of the same company for the same tax year exist:", file_path)
        elif return_type == "990EZ":
            if ein not in self.ez:
                self.ez[ein] = {
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
                if tax_period not in self.ez[ein]:
                    self.ez[ein][tax_period] = {
                        "Total Revenue": total_revenue,
                        "Total Assets": total_assets,
                        "Total Liabilities": total_liabilities,
                        "Total Expenses": total_expenses
                    }
                #else:
                   # print("This shouldn't happen, two files of the same company for the same tax year exist:", file_path)
        elif return_type == "990PF":
            if ein not in self.private:
                self.private[ein] = {
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
                if tax_period not in self.private[ein]:
                    self.private[ein][tax_period] = {
                        "Total Revenue": total_revenue,
                        "Total Assets": total_assets,
                        "Total Liabilities": total_liabilities,
                        "Total Expenses": total_expenses
                    }
                #else:
                   # print("This shouldn't happen, two files of the same company for the same tax year exist:", file_path)

        return ein, tax_period

    def process_all_xml_files(self, directory):
        num_cores = os.cpu_count()
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
        client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
        database = client["Np-Datahub"]

        def insert_data(collection_name, data_dict):
            requests = []
            for ein, details in data_dict.items():
                new_ein = str(ein) if len(str(ein)) == 9 else '0' + str(ein)
                new_dict = {"EIN": new_ein}
                new_dict.update(details)
                requests.append(
                    UpdateOne(
                        {"EIN": new_ein},  # Filter to match documents by EIN
                        {"$set": new_dict},  # Update operation to set the new data
                        upsert=True  # If no document matches, insert a new one
                    )
                )
            if requests:
                collection = database[collection_name]
                collection.bulk_write(requests)

        insert_data("Master", self.master)
        insert_data("EZ", self.ez)
        insert_data("Private", self.private)

if __name__ == "__main__":
    directory = '/Users/mr.youssef/Desktop/NpDataHub/unitTesting'
    obj = Database()
    obj.process_all_xml_files(directory)
    obj.insert_into_mongo()
    print("Data has been successfully inserted into MongoDB.")
