from pymongo import MongoClient
from dotenv import load_dotenv
import os
class UnitTests:
    def __init__(self):
        # Only load .env if MONGODB_URI is not already in the environment, because
        # it's already stored in the repository's settings as a secret
        if not os.getenv('MONGODB_URI'):
            load_dotenv('frontend/.env')
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI'))
        self.database = self.mongo_client["Nonprofitly"]
        self.nonprofits = self.database["NonProfitData"]
        self.statistics = self.database["NationalAndStateStatistics"]

    def check_averages(self, state=""):
        years = range(2015, 2024)
        mismatched = False
        for year in years:
            pipeline = [
                {"$match": {"MajGrp": "Z"}},
                {"$match": {f"{year}.TotRev": {"$exists": True}}},
            ]
            
            if state != "":
                pipeline.insert(1, {"$match": {"St": state}})  # Add state match if state is not empty

            pipeline.extend([
                {"$group": {
                    "_id": None,
                    "averageTotRev": {"$avg": f"${year}.TotRev"}
                }}
            ])

            result = list(self.nonprofits.aggregate(pipeline))
            expected_average = result[0]["averageTotRev"]
            
            # check the value in other table
            national_row = self.statistics.find_one({"MajGrp": "Z"}, {str(year): 1})
            if state == "": 
                avg_rev = national_row[str(year)].get("NatAvgRev")
            else:
                avg_rev = national_row[str(year)][state].get("RevAvg")

            if avg_rev != expected_average:
                print(f"Average Revenues mismatch for {year}, for Major group Z")
                mismatched = True
        
        if not mismatched:
            if state == "":
                print("National Fiscal health tool values are correct")
            else:
                print("State Fiscal health tool values are correct")


    def check_sums(self, state=""):
        years = range(2016, 2023)
        for year in years:
            pipeline = [
                {"$match": {"MajGrp": "Z", "RetTyp": "990"}}
            ]

            if state != "":
                pipeline.insert(1, {"$match": {"St": state}})  # Add state match if state is not empty

            pipeline.extend([
                {
                    "$match": {
                        "$expr": {
                            "$and": [
                                {"$ne": [{"$ifNull": [f"${year}.TotRev", None]}, None]},
                                {"$ne": [{"$ifNull": [f"${year}.TotExp", None]}, None]},
                                {"$ne": [{"$ifNull": [f"${year}.TotAst", None]}, None]},
                                {"$ne": [{"$ifNull": [f"${year}.TotLia", None]}, None]},
                                {"$ne": [{"$ifNull": [f"${year}.NumEmp", None]}, None]},
                                {"$ne": [{"$ifNull": [f"${year}.OthSal", None]}, None]},
                                {"$ne": [{"$ifNull": [f"${year}.OffComp", None]}, None]},
                                {"$ne": [f"${year}.TotRev", 0]},
                                {"$ne": [f"${year}.TotExp", 0]},
                                {"$ne": [f"${year}.TotAst", 0]},
                                {"$ne": [f"${year}.TotLia", 0]},
                                {"$ne": [f"${year}.NumEmp", 0]},
                                {"$ne": [f"${year}.OthSal", 0]},
                                {"$ne": [f"${year}.OffComp", 0]}
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "TotalRevenue": {"$sum": f"${year}.TotRev"},
                        "TotalExpenses": {"$sum": f"${year}.TotExp"},
                        "TotalAssets": {"$sum": f"${year}.TotAst"},
                        "TotalLiabilities": {"$sum": f"${year}.TotLia"},
                        "NumEmployees": {"$sum": f"${year}.NumEmp"},
                        "OtherSalaries": {"$sum": f"${year}.OthSal"},
                        "OfficerCompensation": {"$sum": f"${year}.OffComp"},
                        "Count": {"$sum": 1}
                    }
                }
            ])

            result = list(self.nonprofits.aggregate(pipeline))
            # Get actual values
            national_row = self.statistics.find_one({"MajGrp": "Z"}, {str(year): 1})
            mismatched = False

            for field, expected_field in [
                ("TotalRevenue", "NatSumRev"),
                ("TotalExpenses", "NatSumExp"),
                ("TotalAssets", "NatSumAst"),
                ("TotalLiabilities", "NatSumLia"),
                ("NumEmployees", "NatSumEmp"),
                ("OtherSalaries", "NatSumOthSal"),
                ("OfficerCompensation", "NatSumOffComp"),
                ("Count", "NatCount990Np")
            ]:
                calculated_sum = result[0].get(field)
                if state != "":
                    expected_field = expected_field[3:]  # Remove 'Nat' from the field name
                    expected_sum = national_row[str(year)][state].get(expected_field)
                else:
                    expected_sum = national_row[str(year)].get(expected_field)
                if calculated_sum != expected_sum:
                    print(f"Mismatch for {year}: {field} (Calculated: {calculated_sum}, expected: {expected_sum})")
                    mismatched = True

        if not mismatched:
            if state == "":
                print(f"National Calculator tool values are correct")
            else:
                print(f"State Calculator tool values are correct")

if __name__ == "__main__":
    obj = UnitTests()
    #National values
    obj.check_averages()
    obj.check_sums()
    #State values
    obj.check_averages("NY")
    obj.check_sums("NY")
    print("Unit testing completed")
