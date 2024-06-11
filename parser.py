import os
import xml.etree.ElementTree as ET
from pymongo import MongoClient

def extract_data_from_xml(file_path):
    # Parse the XML file
    tree = ET.parse(file_path)
    root = tree.getroot()
    # Define the namespace
    namespace = {'irs': 'http://www.irs.gov/efile'}
    # Extract EIN
    ein_element = root.find('.//irs:Filer/irs:EIN', namespace)
    ein = ein_element.text if ein_element is not None else None
    # Extract TotalRevenue
    total_revenue_element = root.find('.//irs:TotalRevenueGrp/irs:TotalRevenueColumnAmt', namespace)
    total_revenue = total_revenue_element.text if total_revenue_element is not None else None
    # Extract Tax period
    tax_period_element = root.find('.//irs:TaxYr', namespace)
    tax_period = tax_period_element.text if tax_period_element is not None else None
    # Extract Name of Organization
    name_organization_element = root.find('.//irs:Filer/irs:BusinessName/irs:BusinessNameLine1Txt', namespace)
    name_organization = name_organization_element.text if name_organization_element is not None else None

    return {
        'ein': ein,
        'tax_period':tax_period,
        'name_organization':name_organization,
        'total_revenue': total_revenue
    }

def process_all_xml_files(directory):
    data_list = []

    # List all files in the directory
    for filename in os.listdir(directory):
        if filename.endswith('.xml'):
            file_path = os.path.join(directory, filename)
            file_data = extract_data_from_xml(file_path)
            data_list.append(file_data)

    return data_list

def insert_data_into_mongodb(data_list, db_name, collection_name):
    # Connect to MongoDB
    client = MongoClient("mongodb+srv://youssef:TryAgain@youssef.bl2lv86.mongodb.net/?retryWrites=true&w=majority&appName=Youssef")
    database = client[db_name]
    collection = database[collection_name]

    # Insert data into the collection
    collection.insert_many(data_list)

if __name__ == "__main__":

    # Specify the directory containing the XML files
    directory = '/Users/mr.youssef/Desktop/NP-DataHub/unitTesting'

    # Process all XML files and store data in a list
    all_data = process_all_xml_files(directory)

    # Insert the data into MongoDB
    insert_data_into_mongodb(all_data, 'Test', 'test')

    print("Data has been successfully inserted into MongoDB.")
