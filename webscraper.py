import requests
from bs4 import BeautifulSoup
import os
import zipfile
import io

def extract_link(string, start_del, end_del):
    start_index = string.find(start_del) + len(start_del)
    end_index = string.find(end_del, start_index)
    return string[start_index:end_index]

def extractFilesFromZip(ziplink):
	r = requests.get(ziplink)
	z = zipfile.ZipFile(io.BytesIO(r.content))
	zipfile.extractall("C:/Users/troys.LAPTOP-C5UOFQ8K/OneDrive - Rensselaer Polytechnic Institute/RPI/RCOS/NP-DataHub/ZIPfolders")
		
def extractZipsFromHtml():
	url = "https://www.irs.gov/charities-non-profits/form-990-series-downloads"
	response = requests.get(url)
	html_content = response.content
	soup = BeautifulSoup(html_content, 'html.parser')
	zip_links = soup.select('a[href$=".zip"]')
	for ziplink in zip_links:
		zipfilelink = ziplink['href']
        print(zipfilelink)
        # if not zipfilelink.startswith("http"):
            # zipfilelink = "https://www.irs.gov" + zipfilelink

def main():
	extractZipsFromHtml()

if __name__ == '__main__':
	main()