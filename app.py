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


# Initialize the Flask app
app = Flask(__name__)

# Connection to MongoDB database
etfl_database = f"mongodb+srv://{username}:{password}@clusterprime.mpaq0.mongodb.net/ETL?retryWrites=true&w=majority"

# Configure MongoDB
app.config["MONGO_URI"] = os.environ.get("MONGODB_URI", etfl_database)

# Initialize MongoDB application
mongo = PyMongo(app)

# Format of db in MONGODB:
# Database: ETL
# Collection: NFTA
# Keys:
# ['keyword', 'source', 'author', 'title', 'url', 'published',
# 'compound_score', 'negative_score', 'positive_score', 'neutral_score', 'text_excerpt', 'text_complete', 'sentiment_category']

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


# Routes that return data
@app.route("/api/testdata")
def getNewsMongo():
    news_data = mongo.db.NFTA.find({})
    data = []

    for task in news_data:
        item = {
            "id": str(task["_id"]),
            "source": task["source"],
            "title": task["title"],
            "published": task["published"],
            "compound_score": task["compound_score"],
        }
        data.append(item)
    return jsonify(data)


# TODO: Make this route dynamic w/ filter options: domain and/or sentiment category
@app.route("/api/keywords/")
def getKeywords():
    # Pull headlines from database
    # Will need to add filter here which filters by domain and/or sentiment
    # Check for what is passed into the route and then filter accordingly
    news_data = mongo.db.NFTA.find({})

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
        if item[0] not in ["u", "19"]:
            keyword = {"keyword": item[0], "frequency": item[1]}
            keywords_final.append(keyword)

    return jsonify(keywords_final)


# Will need to add following routes for dataviz page 1 (filtering by domains):
# 1. /sentimentcategories - need to aggregate data
# Filter by domain (optional)
# Return frequency count of each sentiment category
# Format: [{'category': 'neutral', 'frequency': freq(int)}, {'category': 'positive', 'frequency': freq(int)}, {'category': 'negative', 'frequency': freq(int)}]
# 2. /domainscores - default to return all or filter by domain
# 3. /keywords - need to figure out how to filter by domain and/or sentiment


@app.route("/api/domainlist")
def getDomainList():

    domains = mongo.db.NFTA.distinct("source")

    return jsonify(domains)


@app.route("/api/domainscores")
def getDomainScores():
    news_data = mongo.db.NFTA.find({})

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

    df = pd.DataFrame(domains)

    count = dict(df["sentiment_category"].value_counts())

    count_list = []

    for key, value in count.items():
        x = {"category": key, "frequency": int(value)}
        count_list.append(x)

    domain_scores = {"article_data": domains, "category_counts": count_list}

    return jsonify(domain_scores)


@app.route("/api/domainscores/<domain_name>", methods=["GET"])
def getFilteredDomainScores(domain_name):

    filter = {"source": domain_name}

    news_data = mongo.db.NFTA.find(filter)

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

    return jsonify(domains)


if __name__ == "__main__":
    app.run(debug=True)
