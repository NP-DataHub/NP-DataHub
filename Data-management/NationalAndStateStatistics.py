from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor, as_completed
import statistics
import os
from dotenv import load_dotenv

class NationalAndStateStatistics:
    def __init__(self):
        # Only load .env if MONGODB_URI is not already in the environment, because
        # it's already stored in the repository's settings as a secret
        if not os.getenv('MONGODB_URI'):
            load_dotenv('frontend/.env')
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.database = self.mongo_client["Nonprofitly"]
        self.source_collection = self.database["NonProfitData"]
        self.new_collection = self.database["NationalAndStateStatistics"]
        self.table = {}

    def get_mean(self, values):
        return statistics.mean(values) if values else 0

    def get_median(self,values):
        return statistics.median(values) if values else 0

    def get_data(self, row):
        if len(row) == 4:
            return
        major_group = row["MajGrp"]
        if major_group not in self.table:
            self.table[major_group] = {}
        for field, data in row.items():
            if field.isdigit():
                tax_year = field

                tot_rev = data.get("TotRev")
                tot_exp = data.get("TotExp")
                tot_ast = data.get("TotAst")
                tot_lia = data.get("TotLia")
                num_emp = 0
                oth_sal = 0
                off_comp = 0
                if row['RetTyp'] == "990":
                    num_emp = data.get("NumEmp", 0)
                    oth_sal = data.get("OthSal", 0)
                    off_comp = data.get("OffComp", 0)

                master_complete_financials = (
                    row['RetTyp'] == "990" and
                    tot_rev != 0 and
                    tot_exp != 0 and
                    tot_ast != 0 and
                    tot_lia != 0 and
                    num_emp != 0 and
                    oth_sal != 0 and
                    off_comp != 0
                )

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

                    if master_complete_financials:
                        self.table[major_group][tax_year].update({
                            "NatSumRev": [],
                            "NatSumExp": [],
                            "NatSumLia": [],
                            "NatSumAst": [],
                            "NatSumEmp": [],
                            "NatSumOthSal": [],
                            "NatSumOffComp": [],
                            "NatCount990Np": []
                        })
                else:
                    if master_complete_financials and ("NatSumRev" not in self.table[major_group][tax_year]):
                        self.table[major_group][tax_year].update({
                            "NatSumRev": [],
                            "NatSumExp": [],
                            "NatSumLia": [],
                            "NatSumAst": [],
                            "NatSumEmp": [],
                            "NatSumOthSal": [],
                            "NatSumOffComp": [],
                            "NatCount990Np": []
                        })

                state = row["St"].upper()
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

                    if master_complete_financials:
                        self.table[major_group][tax_year][state].update({
                            "SumRev": [],
                            "SumExp": [],
                            "SumLia": [],
                            "SumAst": [],
                            "SumEmp": [],
                            "SumOthSal": [],
                            "SumOffComp": [],
                            "Count990Np": []
                        })
                else:
                    if master_complete_financials and ("SumRev" not in self.table[major_group][tax_year][state]):
                        self.table[major_group][tax_year][state].update({
                            "SumRev": [],
                            "SumExp": [],
                            "SumLia": [],
                            "SumAst": [],
                            "SumEmp": [],
                            "SumOthSal": [],
                            "SumOffComp": [],
                            "Count990Np": []
                        })

                self.table[major_group][tax_year]["NatAvgRev"].append(tot_rev)
                self.table[major_group][tax_year]["NatAvgExp"].append(tot_exp)
                self.table[major_group][tax_year]["NatAvgLia"].append(tot_lia)
                self.table[major_group][tax_year]["NatAvgAst"].append(tot_ast)
                self.table[major_group][tax_year][state]["RevAvg"].append(tot_rev)
                self.table[major_group][tax_year][state]["ExpAvg"].append(tot_exp)
                self.table[major_group][tax_year][state]["LiaAvg"].append(tot_lia)
                self.table[major_group][tax_year][state]["AstAvg"].append(tot_ast)
                if master_complete_financials:
                    self.table[major_group][tax_year]["NatSumRev"].append(tot_rev)
                    self.table[major_group][tax_year]["NatSumExp"].append(tot_exp)
                    self.table[major_group][tax_year]["NatSumLia"].append(tot_lia)
                    self.table[major_group][tax_year]["NatSumAst"].append(tot_ast)
                    self.table[major_group][tax_year]["NatSumEmp"].append(num_emp)
                    self.table[major_group][tax_year]["NatSumOthSal"].append(oth_sal)
                    self.table[major_group][tax_year]["NatSumOffComp"].append(off_comp)

                    self.table[major_group][tax_year][state]["SumRev"].append(tot_rev)
                    self.table[major_group][tax_year][state]["SumExp"].append(tot_exp)
                    self.table[major_group][tax_year][state]["SumLia"].append(tot_lia)
                    self.table[major_group][tax_year][state]["SumAst"].append(tot_ast)
                    self.table[major_group][tax_year][state]["SumEmp"].append(num_emp)
                    self.table[major_group][tax_year][state]["SumOthSal"].append(oth_sal)
                    self.table[major_group][tax_year][state]["SumOffComp"].append(off_comp)

    def get_averages_and_medians(self, major_group, data):
        national_revenue_data = data["NatAvgRev"]
        national_expenses_data = data["NatAvgExp"]
        national_liabilities_data = data["NatAvgLia"]
        national_assets_data = data["NatAvgAst"]

        if "NatSumRev" in data:
            data["NatCount990Np"] = len(data["NatSumRev"])
            data["NatSumRev"] = sum(data["NatSumRev"])
            data["NatSumExp"] = sum(data["NatSumExp"])
            data["NatSumLia"] = sum(data["NatSumLia"])
            data["NatSumAst"] = sum(data["NatSumAst"])
            data["NatSumEmp"] = sum(data["NatSumEmp"])
            data["NatSumOthSal"] = sum(data["NatSumOthSal"])
            data["NatSumOffComp"] = sum(data["NatSumOffComp"])

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
                if "SumRev" in state_data:
                    state_data["Count990Np"] = len(state_data["SumRev"])
                    state_data["SumRev"] = sum(state_data["SumRev"])
                    state_data["SumExp"] = sum(state_data["SumExp"])
                    state_data["SumLia"] = sum(state_data["SumLia"])
                    state_data["SumAst"] = sum(state_data["SumAst"])
                    state_data["SumEmp"] = sum(state_data["SumEmp"])
                    state_data["SumOthSal"] = sum(state_data["SumOthSal"])
                    state_data["SumOffComp"] = sum(state_data["SumOffComp"])

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
                    futures.append(executor.submit(self.get_averages_and_medians, major_group, data))
            
            for future in futures:
                future.result()

        final_table = []
        for major_group, data in self.table.items():
            row = {"MajGrp": major_group}
            row.update(data)
            final_table.append(row)
        # Reset Table
        self.new_collection.drop()
        self.new_collection.insert_many(final_table)
        print("NationalAndStateStatistics table has been successfully updated")

if __name__ == "__main__":
    obj = NationalAndStateStatistics()
    obj.build_collection()
