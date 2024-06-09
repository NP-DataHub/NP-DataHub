import os
import xml.etree.ElementTree as ET

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

    return {
        'ein': ein,
        'total_revenue': total_revenue
    }

def process_all_xml_files(directory):
    data_dict = {}
    for filename in os.listdir(directory):
        if filename.endswith('.xml'):
            file_path = os.path.join(directory, filename)
            file_data = extract_data_from_xml(file_path)
            data_dict[filename] = file_data

    return data_dict

if __name__ == "__main__":

    directory = '/Users/mr.youssef/Desktop/test'

    # Process all XML files and store data in a dictionary of dictionaries
    all_data = process_all_xml_files(directory)

    print(all_data)
