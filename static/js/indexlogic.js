// This function plots a stacked bar chart
function generateStackedChart(data) {

  // Create trace for negative sentiment
  var neg = {
      x: data.map(domain => domain.source),
      y: data.map(domain => domain.neg_perc),
      name: '% Negative',
      type: 'bar',
      marker: {color: '#104b6d'}
  };
  
  // Create trace for neutral sentiment
  var neu = {
    x: data.map(domain => domain.source),
    y: data.map(domain => domain.neu_perc),
    name: '% Neutral',
    type: 'bar',
    marker: {color: '#a3d2a0'}
  };
  
  // Create trace for positive sentiment
  var pos = {
    x: data.map(domain => domain.source),
    y: data.map(domain => domain.pos_perc),
    name: '% Positive',
    type: 'bar',
    marker: {color: '#6f2b6e'}
  };
  
  // Create array of all traces
  var data = [neg, neu, pos];
  
  // Customize layout
  var layout = {title: {text: 'Headline Sentiment'}, barmode: 'stack', bargroupgap: 0.1, xaxis: {tickangle: 35, tickfont: {size: 10}, zeroline: false}};
  
  // Plot chart
  Plotly.newPlot('stacked-chart', data, layout);

};

// Function that puts text into headline generator
function generateHeadline() {
  d3.json("api/randomheadline").then((headline_info) => {
    headline.text(headline_info[0]['title']);
    sentiment.text(headline_info[0]['sentiment']);
    news_source.text(headline_info[0]['source']);
  });
};

// Initialize the plot 
d3.json("api/domainsentimentpercents").then((domain_sent) => {
    generateStackedChart(domain_sent)
});

// Select the headline elements
var headline = d3.select("#headline")
var sentiment = d3.select("#sentiment")
var news_source = d3.select("#source")

// Initialize random headline
generateHeadline()

// Select the headline button
var headline_button = d3.select("#headline-button")

// Create event listener
headline_button.on('click', generateHeadline)

