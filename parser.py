import os
import requests
from lxml import etree as ET
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed
class Database:
    def __init__(self):
        self.namespace = {'irs': 'http://www.irs.gov/efile'}
        self.mongo_client = MongoClient("mongodb+srv://Admin:Admin@np-data.fytln2i.mongodb.net/?retryWrites=true&w=majority&appName=NP-Data")
        self.database = self.mongo_client["Np-Datahub"]
        self.collections = {
            "990": self.database["Master"],
            "990EZ": self.database["EZ"],
            "990PF": self.database["Private"]
        }
        self.master_duplicate_files = {}
        self.private_duplicate_files = {}
        self.ez_duplicate_files = {}

    def get_ein_and_tax_period(self, root):
        ein_element = root.find('.//irs:Filer/irs:EIN', self.namespace)
        ein = ein_element.text if ein_element is not None else "None"
        ein = '0' + ein if len(str(ein)) == 8 else ein
        tax_period_element = root.find('.//irs:TaxYr', self.namespace)
        tax_period = tax_period_element.text if tax_period_element is not None else "None"
        return ein, tax_period

    def get_general_information(self, root):
        name_element = root.find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', self.namespace)
        name = name_element.text if name_element is not None else "None"
        state_element = root.find('.//irs:Filer/irs:USAddress/irs:StateAbbreviationCd', self.namespace)
        if (state_element is not None):
            state = state_element.text
            city_element = root.find('.//irs:Filer/irs:USAddress/irs:CityNm', self.namespace)
            city = city_element.text
            zip_code_element = root.find('.//irs:Filer/irs:USAddress/irs:ZIPCd', self.namespace)
            zip_code = zip_code_element.text
        else : #Foreign Address
            state_element = root.find('.//irs:Filer/irs:ForeignAddress/irs:CountryCd', self.namespace)
            state = state_element.text if state_element is not None else "None"
            city_element = root.find('.//irs:Filer/irs:ForeignAddress/irs:CityNm', self.namespace)
            city = city_element.text if city_element is not None else "None"
            zip_code_element = root.find('.//irs:Filer/irs:ForeignAddress/irs:ForeignPostalCd', self.namespace)
            zip_code = zip_code_element.text if zip_code_element is not None else "None"
        return name, state, city, zip_code

    def get_990_financial_information(self, root):
        total_revenue_element = root.find('.//irs:CYTotalRevenueAmt', self.namespace)
        if total_revenue_element is None:
            total_revenue_element = root.find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', self.namespace)

        total_assets_element = root.find('.//irs:TotalAssetsEOYAmt', self.namespace)
        if total_assets_element is None:
            total_assets_element = root.find('.//irs:TotalAssetsGrp/irs:EOYAmt', self.namespace)
      
        total_liabilities_element = root.find('.//irs:TotalLiabilitiesEOYAmt', self.namespace)
        if total_liabilities_element is None:
            total_liabilities_element = root.find('.//irs:TotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
        
        total_expenses_element = root.find('.//irs:TotalFunctionalExpensesGrp/irs:TotalAmt', self.namespace)
        if total_expenses_element is None:
            total_expenses_element = root.find('.//irs:CYTotalExpensesAmt', self.namespace)
        
        total_contributions_element = root.find('.//irs:TotalContributionsAmt', self.namespace)
        
        program_service_revenue_element = root.find('.//irs:TotalProgramServiceRevenueAmt', self.namespace)
        if program_service_revenue_element is None:
            program_service_revenue_element = root.find('.//irs:CYProgramServiceRevenueAmt', self.namespace)
        
        investment_income_element = root.find('.//irs:CYInvestmentIncomeAmt', self.namespace)
        if investment_income_element is None:
            investment_income_element = root.find('.//irs:InvestmentIncomeGrp/irs:TotalRevenueColumnAmt', self.namespace)
        
        gross_receipts_element = root.find('.//irs:GrossReceiptsAmt', self.namespace)
        
        fundraising_income_element = root.find('.//irs:NetIncmFromFundraisingEvtGrp/irs:TotalRevenueColumnAmt', self.namespace)
        
        fundraising_expenses_element = root.find('.//irs:FundraisingDirectExpensesAmt', self.namespace)
        
        compensation_of_current_officers_element = root.find('.//irs:CompCurrentOfcrDirectorsGrp/irs:TotalAmt', self.namespace)
        
        other_salaries_and_wages_element = root.find('.//irs:OtherSalariesAndWagesGrp/irs:TotalAmt', self.namespace)
        
        payroll_taxes_element = root.find('.//irs:PayrollTaxesGrp/irs:TotalAmt', self.namespace)
        
        gifts_grants_membership_fees_received_509_element = root.find('.//irs:GiftsGrantsContrisRcvd509Grp/irs:TotalAmt', self.namespace)
        
        number_of_employee_element = root.find('.//irs:TotalEmployeeCnt', self.namespace)
        
        return (
            int(total_revenue_element.text) if total_revenue_element is not None else 0,
            int(total_assets_element.text) if total_assets_element is not None else 0,
            int(total_liabilities_element.text) if total_liabilities_element is not None else 0,
            int(total_expenses_element.text) if total_expenses_element is not None else 0,
            "R" if total_contributions_element is not None and total_contributions_element.text == "RESTRICTED" else (int(total_contributions_element.text) if total_contributions_element is not None else 0),
            int(program_service_revenue_element.text) if program_service_revenue_element is not None else 0,
            int(investment_income_element.text) if investment_income_element is not None else 0,
            int(gross_receipts_element.text) if gross_receipts_element is not None else 0,
            int(fundraising_income_element.text) if fundraising_income_element is not None else 0,
            int(fundraising_expenses_element.text) if fundraising_expenses_element is not None else 0,
            int(compensation_of_current_officers_element.text) if compensation_of_current_officers_element is not None else 0,
            int(other_salaries_and_wages_element.text) if other_salaries_and_wages_element is not None else 0,
            int(payroll_taxes_element.text) if payroll_taxes_element is not None else 0,
            int(gifts_grants_membership_fees_received_509_element.text) if gifts_grants_membership_fees_received_509_element is not None else 0,
            int(number_of_employee_element.text) if number_of_employee_element is not None else 0
        )

    def get_990EZ_financial_information(self, root):
        total_revenue_element = root.find('.//irs:TotalRevenueAmt', self.namespace)
        
        total_assets_element = root.find('.//irs:Form990TotalAssetsGrp/irs:EOYAmt', self.namespace)
        
        total_liabilities_element = root.find('.//irs:SumOfTotalLiabilitiesGrp/irs:EOYAmt', self.namespace)
        
        total_expenses_element = root.find('.//irs:TotalExpensesAmt', self.namespace)
        
        program_service_revenue_element = root.find('.//irs:ProgramServiceRevenueAmt', self.namespace)
        
        investment_income_element = root.find('.//irs:InvestmentIncomeAmt', self.namespace)
        
        gifts_grants_membership_fees_received_509_element = root.find('.//irs:GiftsGrantsContrisRcvd509Grp/irs:TotalAmt', self.namespace)
        
        return (
            int(total_revenue_element.text) if total_revenue_element is not None else 0,
            int(total_assets_element.text) if total_assets_element is not None else 0,
            int(total_liabilities_element.text) if total_liabilities_element is not None else 0,
            int(total_expenses_element.text) if total_expenses_element is not None else 0,
            int(program_service_revenue_element.text) if program_service_revenue_element is not None else 0,
            int(investment_income_element.text) if investment_income_element is not None else 0,
            int(gifts_grants_membership_fees_received_509_element.text) if gifts_grants_membership_fees_received_509_element is not None else 0
        )

    def get_990PF_financial_information(self, root):
        total_revenue_element = root.find('.//irs:TotalRevAndExpnssAmt', self.namespace)
        
        total_expenses_element = root.find('.//irs:TotalExpensesRevAndExpnssAmt', self.namespace)
        
        total_assets_element = root.find('.//irs:TotalAssetsEOYAmt', self.namespace)
        
        total_liabilities_element = root.find('.//irs:TotalLiabilitiesEOYAmt', self.namespace)
        
        net_income_element = root.find('.//irs:ExcessRevenueOverExpensesAmt', self.namespace)
        
        contributions_received_element = root.find('.//irs:ContriRcvdRevAndExpnssAmt', self.namespace)
        
        interest_revenue_element = root.find('.//irs:InterestOnSavNetInvstIncmAmt', self.namespace)
        
        dividends_element = root.find('.//irs:DividendsRevAndExpnssAmt', self.namespace)
        
        net_gain_sales_assets_element = root.find('.//irs:NetGainSaleAstRevAndExpnssAmt', self.namespace)
        
        other_income_element = root.find('.//irs:OtherIncomeRevAndExpnssAmt', self.namespace)
        
        compensation_of_officers_element = root.find('.//irs:CompOfcrDirTrstRevAndExpnssAmt', self.namespace)
        
        total_fund_net_worth_element = root.find('.//irs:TotNetAstOrFundBalancesEOYAmt', self.namespace)
        
        investments_in_us_gov_obligations_element = root.find('.//irs:USGovernmentObligationsEOYAmt', self.namespace)
        if investments_in_us_gov_obligations_element is None:
            investments_in_us_gov_obligations_element = root.find('.//irs:USGovtObligationsEOYFMVAmt', self.namespace)
        
        investments_in_corporate_stock_element = root.find('.//irs:CorporateStockEOYAmt', self.namespace)
        
        investments_in_corporate_bonds_element = root.find('.//irs:CorporateBondsEOYAmt', self.namespace)
        
        cash_non_interest_bearing_element = root.find('.//irs:CashEOYAmt', self.namespace)
        
        adjusted_net_income_element = root.find('.//irs:TotalAdjNetIncmAmt', self.namespace)
        
        return (
            int(total_revenue_element.text) if total_revenue_element is not None else 0,
            int(total_expenses_element.text) if total_expenses_element is not None else 0,
            int(total_assets_element.text) if total_assets_element is not None else 0,
            int(total_liabilities_element.text) if total_liabilities_element is not None else 0,
            int(net_income_element.text) if net_income_element is not None else 0,
            int(contributions_received_element.text) if contributions_received_element is not None else 0,
            int(interest_revenue_element.text) if interest_revenue_element is not None else 0,
            int(dividends_element.text) if dividends_element is not None else 0,
            int(net_gain_sales_assets_element.text) if net_gain_sales_assets_element is not None else 0,
            int(other_income_element.text) if other_income_element is not None else 0,
            int(compensation_of_officers_element.text) if compensation_of_officers_element is not None else 0,
            int(total_fund_net_worth_element.text) if total_fund_net_worth_element is not None else 0,
            int(investments_in_us_gov_obligations_element.text) if investments_in_us_gov_obligations_element is not None else 0,
            int(investments_in_corporate_stock_element.text) if investments_in_corporate_stock_element is not None else 0,
            int(investments_in_corporate_bonds_element.text) if investments_in_corporate_bonds_element is not None else 0,
            int(cash_non_interest_bearing_element.text) if cash_non_interest_bearing_element is not None else 0,
            int(adjusted_net_income_element.text) if adjusted_net_income_element is not None else 0
        )

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
        ntee, subsec_cd = 'None', '0'

        if return_type == "990":
            financial_info = self.get_990_financial_information(root)
            update_fields = {
                "Name": name,
                "City": city,
                "State": state,
                "Zipcode": zip_code,
                "EIN": ein,
                "NTEE": ntee,
                "Subsection Code": subsec_cd,
                f"{tax_period}.Total Revenue": financial_info[0],
                f"{tax_period}.Total Assets": financial_info[1],
                f"{tax_period}.Total Liabilities": financial_info[2],
                f"{tax_period}.Total Expenses": financial_info[3],
                f"{tax_period}.Total Contributions": financial_info[4],
                f"{tax_period}.Program Service Revenue": financial_info[5],
                f"{tax_period}.Investment Income": financial_info[6],
                f"{tax_period}.Gross Receipts": financial_info[7],
                f"{tax_period}.Fundraising Income": financial_info[8],
                f"{tax_period}.Fundraising Expenses": financial_info[9],
                f"{tax_period}.Compensation of current officers": financial_info[10],
                f"{tax_period}.Other salaries and wages": financial_info[11],
                f"{tax_period}.Payroll Taxes": financial_info[12],
                f"{tax_period}.Gift Grants Membership Fees received 509": financial_info[13],
                f"{tax_period}.Number of employee": financial_info[14],
                f"{tax_period}.Filepath": file_path
            }
            if ein not in self.master_duplicate_files:
                self.master_duplicate_files[ein] = {tax_period: [file_path]  }
            else:
                if tax_period not in self.master_duplicate_files[ein]:
                    self.master_duplicate_files[ein][tax_period] = [file_path]
                else :
                    self.master_duplicate_files[ein][tax_period].append(file_path)

        elif return_type == "990EZ":
            financial_info = self.get_990EZ_financial_information(root)
            update_fields = {
                "Name": name,
                "City": city,
                "State": state,
                "Zipcode": zip_code,
                "EIN": ein,
                "NTEE": ntee,
                "Subsection Code": subsec_cd,
                f"{tax_period}.Total Revenue": financial_info[0],
                f"{tax_period}.Total Assets": financial_info[1],
                f"{tax_period}.Total Liabilities": financial_info[2],
                f"{tax_period}.Total Expenses": financial_info[3],
                f"{tax_period}.Program Service Revenue": financial_info[4],
                f"{tax_period}.Investment Income": financial_info[5],
                f"{tax_period}.Gift Grants Membership Fees received 509": financial_info[6],
                f"{tax_period}.Filepath": file_path
            }
            if ein not in self.ez_duplicate_files:
                self.ez_duplicate_files[ein] = {tax_period: [file_path]  }
            else:
                if tax_period not in self.ez_duplicate_files[ein]:
                    self.ez_duplicate_files[ein][tax_period] = [file_path]
                else :
                    self.ez_duplicate_files[ein][tax_period].append(file_path)
        else:
            financial_info = self.get_990PF_financial_information(root)
            update_fields = {
                "Name": name,
                "City": city,
                "State": state,
                "Zipcode": zip_code,
                "EIN": ein,
                "NTEE": ntee,
                "Subsection Code": subsec_cd,
                f"{tax_period}.Total Revenue": financial_info[0],
                f"{tax_period}.Total Expenses": financial_info[1],
                f"{tax_period}.Total Assets": financial_info[2],
                f"{tax_period}.Total Liabilities": financial_info[3],
                f"{tax_period}.Net Income (Less Deficit)": financial_info[4],
                f"{tax_period}.Contributions Received": financial_info[5],
                f"{tax_period}.Interest Revenue": financial_info[6],
                f"{tax_period}.Dividends": financial_info[7],
                f"{tax_period}.Net Gain (Sales of Assets)": financial_info[8],
                f"{tax_period}.Other Income": financial_info[9],
                f"{tax_period}.Compensation of Officers": financial_info[10],
                f"{tax_period}.Total Fund net worth": financial_info[11],
                f"{tax_period}.Investments in US Gov Obligations": financial_info[12],
                f"{tax_period}.Investments in Corporate Stock": financial_info[13],
                f"{tax_period}.Investments in Corporate Bonds": financial_info[14],
                f"{tax_period}.Cash": financial_info[15],
                f"{tax_period}.Adjusted net income": financial_info[16],
                f"{tax_period}.Filepath": file_path
            }
            if ein not in self.private_duplicate_files:
                self.private_duplicate_files[ein] = {tax_period: [file_path]  }
            else:
                if tax_period not in self.private_duplicate_files[ein]:
                    self.private_duplicate_files[ein][tax_period] = [file_path]
                else :
                    self.private_duplicate_files[ein][tax_period].append(file_path)

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

        for return_type in insertions:
            if insertions[return_type]:  # Write remaining operations
                self.bulk_write_to_mongo(insertions[return_type], return_type)

    def bulk_write_to_mongo(self, operations, return_type):
        collection = self.collections[return_type]
        collection.bulk_write(operations)

    def check_duplicates(self):
        dictionaries = {
            "master": self.master_duplicate_files,
            "ez": self.ez_duplicate_files,
            "private": self.private_duplicate_files
        }
        for collection_name, dictionary in dictionaries.items():
            print(f"Checking '{collection_name}' for duplicates")
            for ein, tax_periods in dictionary.items():
                for tax_period, file_paths in tax_periods.items():
                    if len(file_paths) > 1:
                        extracted_info = []
                        
                        for file_path in file_paths:
                            root = ET.parse(file_path).getroot()
                            return_type_element = root.find('.//irs:ReturnTypeCd', self.namespace)
                            return_type = return_type_element.text if return_type_element is not None else None

                            if return_type not in ["990", "990EZ", "990PF"]:
                                continue

                            name, state, city, zip_code = self.get_general_information(root)

                            if return_type == "990":
                                financial_info = self.get_990_financial_information(root)
                            elif return_type == "990EZ":
                                financial_info = self.get_990EZ_financial_information(root)
                            else:
                                financial_info = self.get_990PF_financial_information(root)

                            extracted_info.append((file_path, name, state, city, zip_code, financial_info))
                        # Perform pairwise comparison
                        for i in range(len(extracted_info)):
                            for j in range(i + 1, len(extracted_info)):
                                if extracted_info[i][1:] != extracted_info[j][1:]:
                                    print(f"Error: Duplicate files with different information found :")
                                    print(f"- File Path 1: {extracted_info[i][0]}")
                                    print(extracted_info[i][1:])
                                    print(f"- File Path 2: {extracted_info[j][0]}")
                                    print(extracted_info[j][1:])
                                    break

if __name__ == "__main__":
    directory = '/Users/mr.youssef/Desktop/NpDataHub/unitTesting'
    obj = Database()
    obj.process_all_xml_files(directory)
    print("Data has been successfully inserted into MongoDB.")
    obj.check_duplicates()
