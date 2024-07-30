import requests
from bs4 import BeautifulSoup
import os
from zipfile import ZipFile
import io
from urllib.request import urlretrieve

def changeToZIP(fp):
    base, ext = os.path.splitext(fp)
    if ext != '.zip':
        newFP = base + '.zip'
        os.rename(fp, newFP)

def openAndDownload(ziplink):
    path = os.path.join(os.getcwd(), 'ZIPfolders')
    print(f"Current working directory: {os.getcwd()}")
    print(f"Target directory: {path}")

    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")

    os.chdir(path)
    print("Path changed to:", os.getcwd())

    try:
        r = requests.get(ziplink, allow_redirects=True)
        r.raise_for_status()
        filename = ziplink.split('/')[-1]
        with open(filename, 'wb') as f:
            f.write(r.content)
        print(f"Downloaded and saved as: {filename}")
        with ZipFile(filename, 'r') as zObject:
        	zObject.extractall(path)
    except Exception as e:
        print(f"Error: {e}")
        exit()

def extractZipsFromHtml():
	url = "https://www.irs.gov/charities-non-profits/form-990-series-downloads"
	response = requests.get(url)
	html_content = response.content
	soup = BeautifulSoup(html_content, 'html.parser')
	zip_links = soup.select('a[href$=".zip"]')
	for ziplink in zip_links:
		zipfilelink = ziplink['href']
		openAndDownload(zipfilelink)
		exit()

def main():
	extractZipsFromHtml()

if __name__ == '__main__':
	main()