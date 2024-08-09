import requests
import os
import json

# To set your environment variables in your terminal, run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = os.environ.get("BEARER_TOKEN")

def create_url(keyword):
    query = f"query={keyword}"
    tweet_fields = "tweet.fields=lang,author_id,created_at,text"
    url = f"https://api.twitter.com/2/tweets/search/recent?{query}&{tweet_fields}"
    return url

def bearer_oauth(r):
    # Method required by bearer token authentication.
    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2TweetSearchPython"
    return r

def connect_to_endpoint(url):
    response = requests.request("GET", url, auth=bearer_oauth)
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(
            "Request returned an error: {} {}".format(
                response.status_code, response.text
            )
        )
    return response.json()

def main():
    keyword = input("Enter the keyword to search for: ")
    url = create_url(keyword)
    json_response = connect_to_endpoint(url)
    print(json.dumps(json_response, indent=4, sort_keys=True))

if __name__ == "__main__":
    main()