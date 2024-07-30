from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor, as_completed
import statistics
import os

class NationalAndStateStatistics:
    def __init__(self):
        self.mongo_client = MongoClient("mongodb+srv://hassay:TryAgain@npdatahub.f3sg8sf.mongodb.net/")
        self.database = self.mongo_client["NpDatahub"]
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
                        "NatAvgRev": [],
                        "NatAvgExp": [],
                        "NatAvgLia": [],
                        "NatAvgAst": [],
                        "NatMedRev": [],
                        "NatMedExp": [],
                        "NatMedLia": [],
                        "NatMedAst": []
                    }

                state = row["State"]
                if state not in self.table[major_group][tax_year]:
                    self.table[major_group][tax_year][state] = {
                        "RevAvg": [],
                        "ExpAvg": [],
                        "LiaAvg": [],
                        "AstAvg": [],
                        "RevMed": [],
                        "ExpMed": [],
                        "LiaMed": [],
                        "AstMed": []
                    }
                self.table[major_group][tax_year]["NatAvgRev"].append(data.get("TotRev"))
                self.table[major_group][tax_year]["NatAvgExp"].append(data.get("TotExp"))
                self.table[major_group][tax_year]["NatAvgLia"].append(data.get("TotLia"))
                self.table[major_group][tax_year]["NatAvgAst"].append(data.get("TotAst"))
                self.table[major_group][tax_year][state]["RevAvg"].append(data.get("TotRev"))
                self.table[major_group][tax_year][state]["ExpAvg"].append(data.get("TotExp"))
                self.table[major_group][tax_year][state]["LiaAvg"].append(data.get("TotLia"))
                self.table[major_group][tax_year][state]["AstAvg"].append(data.get("TotAst"))

    def get_averages_and_medians(self, major_group, year, data):
        national_revenue_data = data["NatAvgRev"]
        national_expenses_data = data["NatAvgExp"]
        national_liabilities_data = data["NatAvgLia"]
        national_assets_data = data["NatAvgAst"]
        data["NatAvgRev"] = self.get_mean(national_revenue_data)
        data["NatAvgExp"] = self.get_mean(national_expenses_data)
        data["NatAvgLia"] = self.get_mean(national_liabilities_data)
        data["NatAvgAst"] = self.get_mean(national_assets_data)
        data["NatMedRev"] = self.get_median(national_revenue_data)
        data["NatMedExp"] = self.get_median(national_expenses_data)
        data["NatMedLia"] = self.get_median(national_liabilities_data)
        data["NatMedAst"] = self.get_median(national_assets_data)
        for state, state_data in data.items():
            if isinstance(state_data, dict):
                state_revenue_data = state_data["RevAvg"]
                state_expenses_data = state_data["ExpAvg"]
                state_liabilities_data = state_data["LiaAvg"]
                state_assets_data = state_data["AstAvg"]
                state_data["RevAvg"] = self.get_mean(state_revenue_data)
                state_data["ExpAvg"] = self.get_mean(state_expenses_data)
                state_data["LiaAvg"] = self.get_mean(state_liabilities_data)
                state_data["AstAvg"] = self.get_mean(state_assets_data)
                state_data["RevMed"] = self.get_median(state_revenue_data)
                state_data["ExpMed"] = self.get_median(state_expenses_data)
                state_data["LiaMed"] = self.get_median(state_liabilities_data)
                state_data["AstMed"] = self.get_median(state_assets_data)
    
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
            row = {"MajGrp": major_group}
            row.update(data)
            final_table.append(row)
        
        self.new_collection.insert_many(final_table)

if __name__ == "__main__":
    obj = NationalAndStateStatistics()
    obj.build_collection()
