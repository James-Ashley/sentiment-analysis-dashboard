# Dependencies
from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv
import nltk
from nltk.tokenize import word_tokenize, RegexpTokenizer
from nltk.corpus import stopwords
import pandas as pd

# Pull passwords from your .env file for when you are working locally
# TODO: Create a .env file at the same level as this file - include these two lines:
# db_username='mongodbusername'
# db_password='mongodbpassword'

load_dotenv()
username = os.getenv("db_username")
password = os.getenv("db_password")

# Initialize stop words for NLTK analysis
stop_words = stopwords.words("english")

# This function tokenizes text (removes punctuation and stop words)
# Input = list of strings
# Output = list of tokens
def process_corpus(titles):
    tokens = []
    for title in titles:

        # Remove punctuation while tokenizing
        tokenizer = RegexpTokenizer(r"\w+")
        toks = tokenizer.tokenize(title)

        # Convert tokens to lowercase and then remove stop words
        toks = [t.lower() for t in toks if t.lower() not in stop_words]
        tokens.extend(toks)
    return tokens

# Cache "find all" searches to reduce number of calls to MongoDB
cache_news_data = None
def getNFTA():
    global cache_news_data
    if not cache_news_data:
        cache_news_data = list(mongo.db.NFTA.find({}, {'text_complete':0, 'text_excerpt':0, 'negative_score':0, 'positive_score':0, 'neutral_score':0}))
    return cache_news_data
        

# Initialize the Flask app
app = Flask(__name__)

# Connection to MongoDB database
etfl_database = f"mongodb+srv://{username}:{password}@cluster0.32kwu.mongodb.net/ETL?retryWrites=true&w=majority"

# Configure MongoDB cluster 1
app.config["MONGO_URI"] = os.environ.get("MONGODB_URI2", etfl_database)

# Initialize MongoDB application
mongo = PyMongo(app)

# Configure MongoDB cluster 2
app.config["MONGO_URI"] = os.environ.get("MONGODB_URI", etfl_database)

# Initialize MongoDB application
mongo_throttled = PyMongo(app)

# Format of db in MONGODB:
# Database: ETL
# Collection: NFTA
#   Fields: ['keyword', 'source', 'author', 'title', 'url', 'published',
#   'compound_score', 'negative_score', 'positive_score', 'neutral_score', 'text_excerpt', 'text_complete', 'sentiment_category']
# Collection: bigrams
#   Fields: ['nodes', 'links', 'text_source']
# Collection: sentiment_counts
#   Fields: ['source', 'sentiment_category', 'count']

# Routes that return webpages
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/nav")
def nav():
    return render_template("nav.html")


@app.route("/domains")
def domains():
    return render_template("domains.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/keywords")
def keywords():
    return render_template("keywords.html")


@app.route("/methods")
def methods():

    return render_template("methods.html")

@app.route("/mlearning")
def mlearning():

    return render_template("mlearning.html")

@app.route("/datatable")
def datatable():
    return render_template("datatable.html")


# Routes that return data from MongoDB
# Returns a list of unique domains (news sources) in dataset
@app.route("/api/domainlist")
def getDomainList():

    domains = mongo_throttled.db.NFTA.distinct("source")

    return jsonify(domains)

# This route requires two search terms - which domain and which sentiment category. If no filter is desired, "all" should be used instead.
# This route returns the most frequent keywords of the headlines
@app.route("/api/keywords/<domain_name>/<sent_cat>", methods=["GET"])
def getFilteredKeywords(domain_name, sent_cat):

    # Check if filter was included
    if domain_name == "all":
        if sent_cat == "all":
            news_data = getNFTA()
        else:
            filter = {"sentiment_category": sent_cat}
            news_data = mongo.db.NFTA.find(filter, {'text_complete':0, 'text_excerpt':0, 'negative_score':0, 'positive_score':0, 'neutral_score':0})

    else:
        if sent_cat == "all":
            filter = {"source": domain_name}
        else:
            filter = {"source": domain_name, "sentiment_category": sent_cat}

        news_data = mongo.db.NFTA.find(filter, {'text_complete':0, 'text_excerpt':0, 'negative_score':0, 'positive_score':0, 'neutral_score':0})

    # Extract data
    headlines = []

    for article in news_data:
        headline = article["title"]
        headlines.append(headline)

    # Create token list of headlines
    headlines_tokens = process_corpus(headlines)

    # Determine frequency of words in token list and pull top 52
    headlines_freq = nltk.FreqDist(headlines_tokens)
    keywords_initial = headlines_freq.most_common(52)

    # Parse NLTK anlaysis and remove junk words
    keywords_final = []
    for item in keywords_initial:
        keyword = {}
        if item[0] not in ["u", "19", "4", "11", "5"]:
            keyword = {"keyword": item[0], "frequency": item[1]}
            keywords_final.append(keyword)

    return jsonify(keywords_final)

# This route requires a domain name filter. If not filter is desired, use "all" instead.
# This route returns the news headline, compound sentiment score, sentiment category, source and publication date for each article.
# It also returns a count of the sentiment categories.
@app.route("/api/domainscores/<domain_name>", methods=["GET"])
def getFilteredDomainScores(domain_name):
    # Check if filter was included
    if domain_name == "all":

        news_data = getNFTA()
        sent_data = mongo_throttled.db.sentiment_counts.find({"aggregation": "all"})

    else:
        filter = {"source": domain_name}

        news_data = mongo.db.NFTA.find(filter, {'text_complete':0, 'text_excerpt':0, 'negative_score':0, 'positive_score':0, 'neutral_score':0})
        sent_data = mongo_throttled.db.sentiment_counts.find(filter)

    # Extract data pt.1
    domains = []

    for article in news_data:
        item = {
            "title": article["title"],
            "compound_score": article["compound_score"],
            "sentiment_category": article["sentiment_category"],
            "domain": article["source"],
            "published": article["published"],
        }
        domains.append(item)

    # Extract data pt.2
    sent_counts = []

    for article in sent_data:
        item = {"category": article["sentiment_category"], "count": article["count"]}
        sent_counts.append(item)

    domain_scores = {"article_data": domains, "category_counts": sent_counts}

    return jsonify(domain_scores)

# This route returns the most relevant bigrams for the text of choice - headlines or full_text
@app.route("/api/bigrams/<text_source>", methods=["GET"])
def getFilteredBigrams(text_source):
    # Create filter
    filter = {"text_source": text_source}

    bigrams_data = mongo.db.bigrams.find(filter)

    # Extract data
    bigrams = {}

    for obj in bigrams_data:
        bigrams = {"nodes": obj["nodes"], "links": obj["links"]}

    return jsonify(bigrams)

# This route returns the data formatted for the data table
@app.route("/api/datatable")
def getDataTable():
    data = getNFTA()

    # Extract data
    news = {"data": []}

    for article in data:
        item = {
            "Keyword": article["keyword"],
            "Source": article["source"],
            "Author": article["author"],
            "Title": article["title"],
            "URL": article["url"],
            "Published": article["published"],
            "Compound Score": article["compound_score"],
            "Sentiment Category": article["sentiment_category"],
        }
        news["data"].append(item)

    return jsonify(news)

# This route returns the sentiment count by domain
@app.route("/api/domainsentiment")
def getDomainSentiment():

    data = mongo_throttled.db.sentiment_counts.find({"aggregation": "domain"})

    # Extract data
    sent_counts = []

    for article in data:
        item = {
            "sentiment": article["sentiment_category"],
            "source": article["source"],
            "count": article["count"],
        }
        sent_counts.append(item)

    return jsonify(sent_counts)

# This route returns the percent of each sentiment by domain
@app.route("/api/domainsentimentpercents")
def getDomainSentimentPercent():
    data = mongo_throttled.db.sentiment_percents.find({}, {'_id':0})

    # Extract data
    sent_percents = []

    for source in data:
        item = {
            "neg_perc": source["negative"],
            "pos_perc": source["positive"],
            "neu_perc": source["neutral"],
            "source": source["source"],
            "source_bias": source["source_bias"],
        }
        sent_percents.append(item)

    return jsonify(sent_percents)

# This route returns a random headline with its corresponding sentiment category and news source
@app.route("/api/randomheadline")
def getRandomHeadline():
    data = mongo_throttled.db.NFTA.aggregate([{ "$sample": { "size": 1 }}])

    headline_info = []

    for article in data:
        headline = {
            'title': article['title'],
            'sentiment': article['sentiment_category'],
            'source': article['source']
        }
        headline_info.append(headline)

    return jsonify(headline_info)

if __name__ == "__main__":
    app.run(debug=True)
