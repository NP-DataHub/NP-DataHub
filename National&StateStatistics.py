from pymongo import MongoClient
import statistics

class NationalAndStateStatistics:
    def __init__(self):
        self.mongo_client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/")
        self.database = self.mongo_client["Np-Datahub"]
        self.source_collection = self.database["NonProfitData"]
        self.new_collection = self.database["NationalAndStateStatistics"]
    def get_mean(self, values):
        return statistics.mean(values) if values else 0

    def get_median(self,values):
    	return statistics.median(values) if values else 0

    def build_collection(self):
	    data = list(self.source_collection.find())
	    table = {}

	    for entry in data:  # for each row
	        ntee_code = entry["NTEE"]
	        major_group = ntee_code[0]
	        if major_group not in table:
	            table[major_group] = {}
	        for field, data in entry.items(): #for each key,value in that row
	            if field.isdigit():
	                tax_year = field
	                if tax_year not in table[major_group]:
	                    table[major_group][tax_year] = {
	                        "National Average Revenue": [],
	                        "National Average Expenses": [],
	                        "National Average Liabilities": [],
	                        "National Average Assets": [],
	                        "National Median Revenue": [],
	                        "National Median Expenses": [],
	                        "National Median Liabilities": [],
	                        "National Median Assets": []
	                    }

	                state = entry["State"]
	                if state not in table[major_group][tax_year]:
	                    table[major_group][tax_year][state] = {
	                        "Revenue Average": [],
	                        "Expenses Average": [],
	                        "Liabilities Average": [],
	                        "Assets Average": [],
	                        "Revenue Median": [],
	                        "Expenses Median": [],
	                        "Liabilities Median": [],
	                        "Assets Median": []
	                    }
	                table[major_group][tax_year]["National Average Revenue"].append(data.get("Total Revenue"))
	                table[major_group][tax_year]["National Average Expenses"].append(data.get("Total Expenses"))
	                table[major_group][tax_year]["National Average Liabilities"].append(data.get("Total Liabilities"))
	                table[major_group][tax_year]["National Average Assets"].append(data.get("Total Assets"))
	                table[major_group][tax_year][state]["Revenue Average"].append(data.get("Total Revenue"))
	                table[major_group][tax_year][state]["Expenses Average"].append(data.get("Total Expenses"))
	                table[major_group][tax_year][state]["Liabilities Average"].append(data.get("Total Liabilities"))
	                table[major_group][tax_year][state]["Assets Average"].append(data.get("Total Assets"))
	    for major_group, _ in table.items(): #for each inner dictionnary
	    	for year, data in _.items(): #for each year with corresponding dictionnary
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
	    			if isinstance(state_data, dict): # need to make sure to only get the state data and not the national averages again
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
	    final_table = []
	    for major_group, data in table.items():
	    	row = {"Major Group": major_group}
	    	row.update(data)
	    	final_table.append(row)
	    self.new_collection.insert_many(final_table)


if __name__ == "__main__":
	obj = NationalAndStateStatistics()
	obj.build_collection()


