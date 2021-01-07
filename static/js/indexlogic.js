// Reference: https://medium.com/@tbarrasso/plotly-tip-6-positioning-axis-titles-in-horizontal-bar-chart-56b0713f9745 

// This function plots a stacked bar chart
function generateStackedChart() {
    var neg = {
        y: ['giraffes', 'orangutans', 'monkeys'],
        x: [20, 14, 23],
        name: 'Negative Headlines',
        type: 'bar',
        orientation: 'h'
      };
      
    var pos = {
        y: ['giraffes', 'orangutans', 'monkeys'],
        x: [12, 18, 29],
        name: 'Positive Headlines',
        type: 'bar',
        orientation: 'h'
      };
      
    var data = [neg, pos];
      
    var layout = {barmode: 'stack', bargroupgap: 0.1, xaxis: {zeroline: false}};
      
    Plotly.newPlot('stacked-chart', data, layout);

    document.getElementById('stacked-chart').on('plotly_afterplot', function() {
        var yAxisLabels = [].slice.call(document.querySelectorAll('[class^="yaxislayer"] .ytick text, [class*=" yaxislayer"] .ytick text'))
        var bar = document.querySelector('.plot .barlayer .bars path')
        var barHeight = bar.getBBox().height
        var offset = 12
        
        for (var i = 0; i < yAxisLabels.length; i++) {
          var yAxisLabel = yAxisLabels[i];
          yAxisLabel.setAttribute('text-anchor', 'start')
          yAxisLabel.setAttribute('y', yAxisLabel.getAttribute('y') - (barHeight / 2) - offset)
        }
      })
}


// Initialize the plot 
d3.json("api/domainscores/all").then((sent_cats) => {
    console.log(sent_cats)
});

generateStackedChart()