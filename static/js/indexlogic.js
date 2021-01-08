// This function plots a stacked bar chart
function generateStackedChart(data) {

  // Create separate datasets for each sentiment category
  let neg_data = data.filter(object => object.sentiment === 'negative')
  let pos_data = data.filter(object => object.sentiment === 'positive')
  let neu_data = data.filter(object => object.sentiment === 'neutral')

  // Create trace for negative sentiment
  var neg = {
      x: neg_data.map(domain => domain.source),
      y: neg_data.map(domain => domain.count),
      name: 'Negative',
      type: 'bar',
      marker: {color: '#104b6d'}
  };
  
  // Create trace for neutral sentiment
  var neu = {
    x: neu_data.map(domain => domain.source),
    y: neu_data.map(domain => domain.count),
    name: 'Neutral',
    type: 'bar',
    marker: {color: '#a3d2a0'}
  };
  
  // Create trace for positive sentiment
  var pos = {
    x: pos_data.map(domain => domain.source),
    y: pos_data.map(domain => domain.count),
    name: 'Positive',
    type: 'bar',
    marker: {color: '#6f2b6e'}
  };
  
  // Create array of all traces
  var data = [neg, neu, pos];
  
  // Customize layout
  var layout = {barmode: 'stack', bargroupgap: 0.1, xaxis: {zeroline: false}};
  
  // Plot chart
  Plotly.newPlot('stacked-chart', data, layout);

};


// Initialize the plot 
d3.json("api/domainsentiment").then((domain_sent) => {
    generateStackedChart(domain_sent)
});