from requests_html import HTMLsession

# based on a given input of a company name perform a google search returning the top 5 most popular aritcle results 
# from the search. Pull the link to the article and the body of the article. Feed the body into a text summarizer given a
# short paragraph description of what the article is about

session = HTMLsession()
url = 'website.com'
r = session.get(url)

r.html.render(sleep = 1, scrolldown = 5)

articles = r.html.find('article')

print(articles)