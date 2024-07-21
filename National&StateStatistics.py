from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor, as_completed
import statistics
import os

class NationalAndStateStatistics:
    def __init__(self):
        self.mongo_client = MongoClient("mongodb+srv://Admin:Admin@np-data.fytln2i.mongodb.net/?retryWrites=true&w=majority&appName=NP-Data")
        self.database = self.mongo_client["Np-Datahub"]
        self.source_collection = self.database["NonProfitData"]
        self.new_collection = self.database["NationalAndStateStatistics"]
        self.table = {}

    def get_mean(self, values):
        return statistics.mean(values) if values else 0

    def get_median(self,values):
        return statistics.median(values) if values else 0

    def get_data(self, row):
        ntee_code = row["NTEE"]
        major_group = ntee_code[0]
        if major_group not in self.table:
            self.table[major_group] = {}
        for field, data in row.items():
            if field.isdigit():
                tax_year = field
                if tax_year not in self.table[major_group]:
                    self.table[major_group][tax_year] = {
                        "National Average Revenue": [],
                        "National Average Expenses": [],
                        "National Average Liabilities": [],
                        "National Average Assets": [],
                        "National Median Revenue": [],
                        "National Median Expenses": [],
                        "National Median Liabilities": [],
                        "National Median Assets": []
                    }

                state = row["State"]
                if state not in self.table[major_group][tax_year]:
                    self.table[major_group][tax_year][state] = {
                        "Revenue Average": [],
                        "Expenses Average": [],
                        "Liabilities Average": [],
                        "Assets Average": [],
                        "Revenue Median": [],
                        "Expenses Median": [],
                        "Liabilities Median": [],
                        "Assets Median": []
                    }
                self.table[major_group][tax_year]["National Average Revenue"].append(data.get("Total Revenue"))
                self.table[major_group][tax_year]["National Average Expenses"].append(data.get("Total Expenses"))
                self.table[major_group][tax_year]["National Average Liabilities"].append(data.get("Total Liabilities"))
                self.table[major_group][tax_year]["National Average Assets"].append(data.get("Total Assets"))
                self.table[major_group][tax_year][state]["Revenue Average"].append(data.get("Total Revenue"))
                self.table[major_group][tax_year][state]["Expenses Average"].append(data.get("Total Expenses"))
                self.table[major_group][tax_year][state]["Liabilities Average"].append(data.get("Total Liabilities"))
                self.table[major_group][tax_year][state]["Assets Average"].append(data.get("Total Assets"))

    def get_averages_and_medians(self, major_group, year, data):
        national_revenue_data = data["National Average Revenue"]
        national_expenses_data = data["National Average Expenses"]
        national_liabilities_data = data["National Average Liabilities"]
        national_assets_data = data["National Average Assets"]
        data["National Average Revenue"] = self.get_mean(national_revenue_data)
        data["National Average Expenses"] = self.get_mean(national_expenses_data)
        data["National Average Liabilities"] = self.get_mean(national_liabilities_data)
        data["National Average Assets"] = self.get_mean(national_assets_data)
        data["National Median Revenue"] = self.get_median(national_revenue_data)
        data["National Median Expenses"] = self.get_median(national_expenses_data)
        data["National Median Liabilities"] = self.get_median(national_liabilities_data)
        data["National Median Assets"] = self.get_median(national_assets_data)
        for state, state_data in data.items():
            if isinstance(state_data, dict):
                state_revenue_data = state_data["Revenue Average"]
                state_expenses_data = state_data["Expenses Average"]
                state_liabilities_data = state_data["Liabilities Average"]
                state_assets_data = state_data["Assets Average"]
                state_data["Revenue Average"] = self.get_mean(state_revenue_data)
                state_data["Expenses Average"] = self.get_mean(state_expenses_data)
                state_data["Liabilities Average"] = self.get_mean(state_liabilities_data)
                state_data["Assets Average"] = self.get_mean(state_assets_data)
                state_data["Revenue Median"] = self.get_median(state_revenue_data)
                state_data["Expenses Median"] = self.get_median(state_expenses_data)
                state_data["Liabilities Median"] = self.get_median(state_liabilities_data)
                state_data["Assets Median"] = self.get_median(state_assets_data)
    
    def build_collection(self):
        data = list(self.source_collection.find())

        with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
            executor.map(self.get_data, data)

        with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
            futures = []
            for major_group, _ in self.table.items():
                for year, data in _.items():
                    futures.append(executor.submit(self.get_averages_and_medians, major_group, year, data))
            
            for future in futures:
                future.result()

        final_table = []
        for major_group, data in self.table.items():
            row = {"Major Group": major_group}
            row.update(data)
            final_table.append(row)
        
        self.new_collection.insert_many(final_table)

if __name__ == "__main__":
    obj = NationalAndStateStatistics()
    obj.build_collection()
