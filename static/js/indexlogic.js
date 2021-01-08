// Reference: https://medium.com/@tbarrasso/plotly-tip-6-positioning-axis-titles-in-horizontal-bar-chart-56b0713f9745 

// This function plots a stacked bar chart
function generateStackedChart(data) {
  let neg_data = data.filter(object => object.sentiment === 'negative')
  let pos_data = data.filter(object => object.sentiment === 'positive')
  let neu_data = data.filter(object => object.sentiment === 'neutral')

  var neg = {
      x: neg_data.map(domain => domain.source),
      y: neg_data.map(domain => domain.count),
      name: 'Negative',
      type: 'bar',
      marker: {color: '#104b6d'}
  };
    
  var neu = {
    x: neu_data.map(domain => domain.source),
    y: neu_data.map(domain => domain.count),
    name: 'Neutral',
    type: 'bar',
    marker: {color: '#a3d2a0'}
  };
  
  var pos = {
    x: pos_data.map(domain => domain.source),
    y: pos_data.map(domain => domain.count),
    name: 'Positive',
    type: 'bar',
    marker: {color: '#6f2b6e'}
  };
      
  var data = [neg, neu, pos];
      
  var layout = {barmode: 'stack', bargroupgap: 0.1, xaxis: {zeroline: false}};
      
  Plotly.newPlot('stacked-chart', data, layout);

};


// Initialize the plot 
d3.json("api/domainsentiment").then((domain_sent) => {
    generateStackedChart(domain_sent)
});