# News Headlines on Immigration

Version 2.0.0

## [View the Website](https://immigrant-headlines-sentiment.herokuapp.com/)

## Description
This project had two parts: 1) display data on newspaper headlines related to immigration on an interactive website and 2) create a machine learning classification model which identifies the sentiment of each headline.

## Background
This project builds on our prior projects ([Sentiment Analysis](https://github.com/James-Ashley/sentiment_analysis), [Article Web Scraping](https://github.com/James-Ashley/News_Full_Text_Articles)) and examines the sentiment of newspaper headlines and bigrams of both newspaper headlines and full length articles. 

Newspapers are notoriously biased which would suggest that the language of news articles is not neutral. News sources are also criticized for always focusing on sensational or negative topics rather than providing more balanced reporting. We were interested in exploring this by analyzing frequent bigrams and the sentiment of news covering a politically charged topic in the US: immigration.

## Data
We collected the articles using NewsAPI's keyword search. We searched for the terms immigration, immigrant(s), refugee(s), and migrant(s). NewsAPI does not return the full text of the articles, so we then webscraped the full text using Newspapers3k. Duplicate articles and articles with missing urls/headlines/text were removed. In addition, any news source with fewer than 50 articles was removed from the dataset. 

After cleaning, the dataset included 3094 articles published from September 2020 - December 2020. 9 news sources were included:
* Al Jazeera
* Breitbart News
* CBS News
* CNN
* Fox News
* NBC News 
* The Washington Post
* USA Today

## Methods
### Data Analysis
The sentiment scores of the headlines were determined by a professional linguist. We classified sentiment categories as positive, negative or neutral.

Bigrams of the headlines and the full length articles were determined using NLTK's bigrams analysis. Bigrams containing non-word text and function words were excluded from this analysis. Bigrams were then sorted by raw frequency (full length text) or PMI (headlines) and the top bigrams were selected. 

### Machine Learning Classification Models
#### Text Preprocessing
The headlines were tokenized using the NLTK RegexpTokenizer, tagged for POS using NLTK, and lemmatized using the NLTK WordNet Lemmatizer. We also used one hot encoding to normalize the newspaper source. This dataset was then hashed and TF-IDF was generated using pySpark. 

### Training the Models
70% of the data was used to train the models and 30% was used to test the models. Two models were chosen due to their prevoius success in classifying sentiment: NaiveBayes and OnevsRest (using a logistic regression classifier). Originally, both models were trained using TF-IDF and newspaper source as the features, but the accuracy was extremely low (under 0.30). Then, both models were trained using only TF-IDF and this yielded more accurate models (0.55 and 0.60 respectively).

### App Architecture
![alt text](https://github.com/James-Ashley/sentiment-analysis-dashboard/blob/main/static/images/architecture.jpg "App Architecture")

In this full stack application, data is stored in MongoDB and then pulled, filtered and analyzed in a Flask API. There were 5 types of API routes used in this app.
1. News Sources: This route returns a list of all news sources in the database.
2. Sentiment Scores: This route returns the raw data and can be filtered by news source.
3. Sentiment Counts: This route returns the total number of occurrences of each sentiment category. This route can be filtered by news source.
4. Keywords: This route pulls the headlines from the database and then determines and returns the top 50 most frequent words using NLTK. This route can be filtered by news source.
5. Bigrams: This route returns the headline or full text bigrams.

We conducted API calls in JS and then created visualizations using D3.js, D3-cloud.js and Plotly.js.

## Results: [View the Website](https://immigrant-headlines-sentiment.herokuapp.com/)
### Headline Sentiment
As can be seen from the graph below, more than half of the headlines had negative sentiment.

OVERALL SENTIMENT GRAPH HERE

SENTIMENT BY NEWS SOURCE HERE


### Machine Learning Models
As can be seen from the graph below, our sentiment classifiers performed almost as well as NLTK Vader, and our OneVsRest model performed better than the trained TextBlob model. NLTK Vader performed slightly better than either of our models. 


## Limitations
As can be seen in the keyword and bigram analyses, the news cycle is heavily influenced by current events, and we could only access the last few months of news. Continuing to collect news articles over time will allow us to better evaluate which words are related to immigration vs. words that are frequently occuring due to specific events.

With regards to our machine learning models, it is clear that a larger dataset is needed in order to more accurately classify headline sentiment using machine learning. We could also try other models such as deep neural networks or a different set of features such as n-grams. We were limited due to both time and resources for collecting and classifying the data and training the models. 

## References 
Chaithra, V. D. (2019). Hybrid approach: naive bayes and sentiment VADER for analyzing sentiment of mobile unboxing video comments. *International Journal of Electrical and Computer Engineering (IJECE), 9*(5), 4452-4459.

Gilbert, C. H. E., & Hutto, E. (2014, June). Vader: A parsimonious rule-based model for sentiment analysis of social media text. In *Eighth International Conference on Weblogs and Social Media (ICWSM-14)*. Available at (20/04/16) http://comp.social.gatech.edu/papers/icwsm14.vader.hutto.pdf (Vol. 81, p. 82).

Gramazio, Connor C. and Laidlaw, David H. and Schloss, Karen B. (2017). Colorgorical: creating discriminable and preferable color palettes for information visualization. *IEEE Transactions on Visualization and Computer Graphics*.

Martin, B. & Koufos, N. (2020). Sentiment analysis on Reddit news headlines with Python’s Natural Language Toolkit (NLTK). *Learn Data Science.* https://www.learndatasci.com/tutorials/sentiment-analysis-reddit-headlines-pythons-nltk/.


## Contributors
James Ashley, Rebekah Callari-Kaczmarczyk, Rohan Patel, Ted Phillips, Morgan Spencer, Scot Wilson

## License and Copyright
&copy; James Ashley, Rebekah Callari-Kaczmarczyk, Rohan Patel, Ted Phillips, Morgan Spencer, Scot Wilson
