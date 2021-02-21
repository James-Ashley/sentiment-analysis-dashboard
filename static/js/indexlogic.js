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

// Function that generates scatter plot of % negative headlines
function generateNegBubbleChart(data) {
  console.log(data)
    // Create trace
    let bubbleTrace = {
      y: data.map(source => source.neg_perc),
      x: data.map(source => source.source_bias),
      mode: 'markers',
      marker: {
          color: data.map(source => Math.abs(source.neg_perc)/10),
          size: data.map(source => Math.abs(source.neg_perc)), 
          sizeref: 0.3,
          sizemode: 'area',
          colorscale: [['0.0', '#104b6d'], ['0.3333', '#a3d2a0'], ['0.6666','#6f2b6e'], ['1','#5ac4f8']]
      },
      text: data.map(source => source.source),
      type: 'scatter'
  };
  // Create layout
  let layout = {
      title: `Bias and Negative Sentiment`,
      hovermode: 'closest',
      showlegend: false,
      xaxis: { title: 'News Source Bias' },
      yaxis: { title: '% Negative Headlines' },
      config: {responsive: true}
  };
  // Generate plot
  Plotly.newPlot('bubble-chart', [bubbleTrace], layout);
};

// Initialize the plots 
d3.json("api/domainsentimentpercents").then((sent_percent) => {
    generateStackedChart(sent_percent)
    generateNegBubbleChart(sent_percent)
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

