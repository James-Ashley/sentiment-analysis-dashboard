from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

load_dotenv()

username = os.getenv("db_username")
password = os.getenv("db_password")

app = Flask(__name__)

# Connection to MongoDB database
etfl_database = f'mongodb+srv://{username}:{password}@clusterprime.mpaq0.mongodb.net/ETL?retryWrites=true&w=majority'

# Configure MongoDB
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI', etfl_database)

# Initialize MongoDB application
mongo = PyMongo(app)


@app.route('/')
def index():
    return 'test string'

@app.route('/api/news-authors')
def getNewsMongo():
    tasks = mongo.db.NFTA.find({})
    data = []

    for task in tasks:
        item = {
            'id': str(task['_id']),
            'author': task['author']
        }
        data.append(item)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)