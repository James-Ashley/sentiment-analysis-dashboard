// This function rounds numbers to a given number of decimal places
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  };

// This function generates a bar chart
function generateBar(acc_data) {
    var data = [
        {
            x: acc_data.map(model => model.model),
            y: acc_data.map(model => model.accuracy),
            marker:{
                color: ['#6f2b6e', '#6f2b6e', '#6f2b6e', '#a3d2a0', '#a3d2a0']
            },
            type: 'bar'
        }
    ];
    // Customize layout
    var layout = {xaxis: {tickangle: 25, tickfont: {size: 10}, zeroline: false}};
  
    // Plot chart
    Plotly.newPlot('accuracy-chart', data, layout);
}

// Initialize Data
var acc_data = [
    {'model': 'Naive Bayes', 'accuracy': 0.635, 'type': 'ours'},
    {'model': 'One vs. Rest', 'accuracy': 0.639, 'type': 'ours'},
    {'model': 'Multilayer Perceptron', 'accuracy': 0.628, 'type': 'ours'},
    {'model': 'TextBlob (trained)', 'accuracy': 0.56, 'type': 'prof'},
    {'model': 'NLTK Vader', 'accuracy': 0.67, 'type': 'prof'}];

generateBar(acc_data);
