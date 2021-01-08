# News Headlines on Immigration
Version 1.0.0

## Description
The purpose of this project was to display data on newspaper headlines related to immigration on an interactive website.

## Background
This project builds on prior projects ([Sentiment Analysis](https://github.com/James-Ashley/sentiment_analysis), [Article Web Scraping]()) and examines the sentiment of newspaper headlines and bigrams of both newspaper headlines and full length articles. 

Newspapers are notoriously biased which would suggest that the language of news articles is not neutral. News sources are also criticized for always focusing on sensational or negative topics rather than providing more balanced reporting. We were interested in exploring this by analyzing frequent bigrams and the sentiment of news covering a politically charged topic in the US: immigration.

## Data

## Methods
### Data Analysis

### App Architecture

## Results: [View the Website](https://immigrant-headlines-sentiment.herokuapp.com/)

## Limitations
Although NLTK Vader performs well on different types of text (Gilbert & Hutto, 2014), it was initially designed to evaluate the sentiment of social media, and we only loosely verified its accuracy in our sentiment analysis. Future research should include creating a training dataset of news headlines related to immigration to train a new sentiment classifier and/or improve Vader's performance.

In addition, as can be seen in the keyword and bigram analyses, the news cycle is heavily influenced by current events, and we could only access the last few months of news. Continuing to collect news articles over time will allow us to better evaluate which words are related to immigration vs. words that are frequently occuring due to specific events.

## References 
Chaithra, V. D. (2019). Hybrid approach: naive bayes and sentiment VADER for analyzing sentiment of mobile unboxing video comments. *International Journal of Electrical and Computer Engineering (IJECE), 9*(5), 4452-4459.

Gilbert, C. H. E., & Hutto, E. (2014, June). Vader: A parsimonious rule-based model for sentiment analysis of social media text. In *Eighth International Conference on Weblogs and Social Media (ICWSM-14)*. Available at (20/04/16) http://comp.social.gatech.edu/papers/icwsm14.vader.hutto.pdf (Vol. 81, p. 82).

Martin, B. & Koufos, N. (2020). Sentiment analysis on Reddit news headlines with Python’s Natural Language Toolkit (NLTK). *Learn Data Science.* https://www.learndatasci.com/tutorials/sentiment-analysis-reddit-headlines-pythons-nltk/.


## Contributors
James Ashley, Rebekah Callari-Kaczmarczyk, Rohan Patel, Ted Phillips, Morgan Spencer, Scot Wilson

## License and Copyright
&copy; James Ashley, Rebekah Callari-Kaczmarczyk, Rohan Patel, Ted Phillips, Morgan Spencer, Scot Wilson
