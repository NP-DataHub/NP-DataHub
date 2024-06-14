import requests
import json

ein = "750964565"

url = "https://projects.propublica.org/nonprofits/api/v2/organizations/"+ein+".json"
response = requests.get(url)

if response.status_code == 200:
	data = response.json()
	ntee  = data["organization"]["ntee_code"]
	name = data["organization"]["name"]
	subsection = data["organization"]["subsection_code"]
else:
	print("No")