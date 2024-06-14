import os
import xml.etree.ElementTree as ET
from pymongo import MongoClient

def extract_non_profit_data(file_path):
    # Parse the XML file
    tree = ET.parse(file_path)
    root = tree.getroot()
    # Define the namespace
    namespace = {'irs': 'http://www.irs.gov/efile'}
    # Extract EIN
    ein_element = root.find('.//irs:Filer/irs:EIN', namespace)
    ein = ein_element.text if ein_element is not None else None
    # Extract Tax period
    tax_period_element = root.find('.//irs:TaxYr', namespace)
    tax_period = tax_period_element.text if tax_period_element is not None else None
    # Extract Name of Organization
    name_organization_element = root.find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', namespace)
    name_organization = name_organization_element.text if name_organization_element is not None else None
    #Check for public or private
    return_type_element = root.find('.//irs:ReturnTypeCd', namespace)
    return_type = return_type_element.text if return_type_element is not None else None
    if return_type == "990PF":
        return False,{
            'ein': ein,
            'tax_period':tax_period,
            'name_organization':name_organization
        }
    else :
        # Extract TotalRevenue
        total_revenue_element = root.find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', namespace)
        total_revenue = total_revenue_element.text if total_revenue_element is not None else None

        return True,{
            'ein': ein,
            'tax_period':tax_period,
            'name_organization':name_organization,
            'total_revenue': total_revenue
        }

def process_all_xml_files(directory):
    public_data_list = []
    private_data_list = []
    # List all files in the directory
    for filename in os.listdir(directory):
        if filename.endswith('.xml'):
            file_path = os.path.join(directory, filename)
            public_or_private,file_data = extract_non_profit_data(file_path)
            public_data_list.append(file_data) if public_or_private else private_data_list.append(file_data)

    return public_data_list,private_data_list

def insert_data_into_mongodb(data_list, db_name, collection_name):
    # Connect to MongoDB
    client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/?retryWrites=true&w=majority&appName=Youssef")
    database = client[db_name]
    collection = database[collection_name]

    # Insert data into the collection
    collection.insert_many(data_list)

if __name__ == "__main__":

    # Specify the directory containing the XML files
    directory = '/Users/mr.youssef/Desktop/NpDataHub/unitTesting'

    # Process all XML files and store data in a list
    public_data,private_data = process_all_xml_files(directory)

    # Insert the data into MongoDB
    #insert_data_into_mongodb(all_data, 'Test', 'test')
    for company in public_data:
        print("Public NP Name is {} and Tax_period is ".format(company['name_organization']),company['tax_period'])
    for company in private_data:
        print("Private NP Name is {} and Tax_period is ".format(company['name_organization']),company['tax_period'])

    #print("Data has been successfully inserted into MongoDB.")
