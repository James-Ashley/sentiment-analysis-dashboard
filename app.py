# Dependencies
from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

# Pull passwords from your .env file for when you are working locally
# TODO: Create a .env file at the same level as this file - include these two lines:
# db_username='mongodbusername'
# db_password='mongodbpassword'

load_dotenv()
username = os.getenv("db_username")
password = os.getenv("db_password")

# Initialize the Flask app
app = Flask(__name__)

# Connection to MongoDB database
etfl_database = f'mongodb+srv://{username}:{password}@clusterprime.mpaq0.mongodb.net/ETL?retryWrites=true&w=majority'

# Configure MongoDB
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI', etfl_database)

# Initialize MongoDB application
mongo = PyMongo(app)

# Format of db in MONGODB:
# Database: ETL
# Collection: NFTA
# Keys: 
# ['keyword', 'source', 'author', 'title', 'url', 'published', 'compound_score', 'negative_score', 'positive_score', 'neutral_score', 'text_excerpt', 'text_complete']

@app.route('/')
def home():
    return render_template('index.html')

# Will need to add template rendering for all webpages as we build them

@app.route('/api/testdata')
def getNewsMongo():
    tasks = mongo.db.NFTA.find({})
    data = []

    for task in tasks:
        item = {
            'id': str(task['_id']),
            'source': task['source'],
            'title': task['title'],
            'published': task['published'],
            'compound_score': task['compound_score']
        }
        data.append(item)
    return jsonify(data)

# Will need to add following routes for dataviz page 1 (filtering by domains): 
# 1. Return list of domains in dataset
# 2. Return title, compound_score, domain - default to return all or filter by domain
#       Should be in format: [{title: 'headline', compound_score: score(int), domain: 'news source'}, {title: 'headline', compound_score: score(int), domain: 'news source'}]
# 3. Return word frequency lists for headlines - default all, filter by domain, and/or filter by sentiment (pos/neg/neut)
#       Should be in format: [{word: 'word here', frequency: frequency (int)}, {word: 'word2 here', frequency: frequency2 (int)}]


if __name__ == '__main__':
    app.run(debug=True)