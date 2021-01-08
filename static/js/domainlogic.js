//Initial check - REMOVE BEFORE DEPLOYING
console.log('this webpage is rendering')

//TODO: 

//WORD CLOUD
// Determine how many words to put in word cloud (determined by size of word cloud)
// May also need to fiddle with sizing of words (will depend on what happens when we limit the words going in)
// Randomize color(s) of words in word cloud (.style('fill', FUNCTION HERE))

// LOLLIPOP CHART
// Add transition: https://www.d3-graph-gallery.com/graph/lollipop_button_data_csv.html w/ filter options
// Edit color of circles based on color scheme chosen

// BUBBLE CHART
// Adjust colors
// Tweak hover text
// Add time series animation (?)


// Functions

// This function generates a word cloud with word size proportional to word frequency using D3-cloud. 
// Required format of data: [{keyword: 'word', frequency: int}, {keyword: 'word', frequency: int}]
function generateWordCloud(wordArray) {

    // Pull top 25 words
    wordArray = wordArray.sort((a, b) => d3.descending(a.frequency, b.frequency)).slice(0,30)

    // Remove chart already present
    word_cloud = d3.select("#word-cloud");
    word_cloud.select("svg").remove();

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    // Set continuous scale for fontsize
    var fontScale = d3.scaleLinear()
    .domain([d3.min(wordArray.map(function(d) {return d.frequency})), d3.max(wordArray.map(function(d) {return d.frequency}))])
    .range([20,70])

    // Set colors
    var colors = ['#104b6d', '#a3d2a0', '#6f2b6e', '#5ac4f8']
    var colorScale = d3.scaleQuantile()
        .domain([d3.min(wordArray.map(function(d) {return d.frequency})), d3.max(wordArray.map(function(d) {return d.frequency}))])
        .range(colors);

    // append the svg object to the body of the page
    var svg = d3.select("#word-cloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It runs an algorithm to find the position of words that suits your requirements
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(wordArray.map(function(d) { return {text: d.keyword, size:d.frequency, color:colorScale(d.frequency)}; }))
        .padding(10)
        .rotate(0)
        .fontSize(function(d) { return fontScale(d.size); })
        .on("end", draw);
        layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Better not to touch it. To change parameters, play with the 'layout' variable above
    function draw(words) {
    svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
            .data(words)
        .enter().append("text")
            .style("font-size", function(d) { return `${d.size}px`; })
            .style("fill", function(d) { return d.color })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
};

// This function creates a lollipop chart of the top 10 most frequent words using D3
function generateLollipopChart(data){
    // Remove chart already present
    lollipop = d3.select("#lollipop-chart");
    lollipop.select("svg").remove();

    // Set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 40, left: 100},
        width = 460 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#lollipop-chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // sort data and pull top ten
    data.sort(function(b, a) {
    return a.frequency - b.frequency;
    })

    data = data.slice(0,10);

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, data[0].frequency])
        .range([ 0, width]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.keyword; }))
        .padding(1);
        svg.append("g")
        .call(d3.axisLeft(y))

    // Lines
    svg.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", function(d) { return y(d.keyword); })
            .attr("y2", function(d) { return y(d.keyword); })
            .attr("stroke", "grey")

    // Circles
    svg.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", x(0))
            .attr("cy", function(d) { return y(d.keyword); })
            .attr("r", "7")
            .style("fill", "#a3d2a0")
            .attr("stroke", "grey")
    
    // Change the x coordinates of line and circle
    svg.selectAll("circle")
        .transition()
        .duration(2000)
        .attr("cx", function(d) { return x(d.frequency); })

    svg.selectAll("line")
        .transition()
        .duration(2000)
        .attr("x1", function(d) { return x(d.frequency); })

};

// This function creates a bubble chart of headline sentiment scores using Plotly
function generateBubbleChart(input, data) {
    // Create trace
    let bubbleTrace = {
        y: data.map(headline => headline.compound_score),
        x: data.map(headline => headline.published),
        mode: 'markers',
        marker: {
            color: data.map(headline => (Math.abs(headline.compound_score) + 1) *10),
            size: data.map(headline => (Math.abs(headline.compound_score) + 1) *10), 
            colorscale: 'Earth'
        }
    };
    // Create layout
    let layout = {
        title: `Sentiment Scores of ${input} Headlines`,
        showlegend: false,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Compound Sentiment Score' }
    };
    // Generate plot
    Plotly.newPlot('bubble-chart', [bubbleTrace], layout);
};

// This function generates a bar chart with a breakdown of sentiment category using Plotly
function generateBarChart(input, data) {
    // Trace1 for sentiment categories
    var trace1 = {
        x: data.map(category => category.frequency),
        y: data.map(category => category.category),
        type: "bar",
        orientation: "h"
    };

    
    // Turning trace into array
    var data = [trace1];
    
    // Set layout
    var layout = {
        title: `Frequency of ${input} Headline Sentiment Categories`
    };
    
    // Render the plot in the html
    Plotly.newPlot("bar-chart", data, layout);
}

//adding in zoom capability to the bubble chart
function zoom() {
    var min = 0.45 * Math.random();
    var max = 0.55 + 0.45 * Math.random();
    Plotly.animate('bubble-chart', {
      layout: {
        xaxis: {range: [min, max]},
        yaxis: {range: [min, max]}
      }
    }, {
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      }
    })
  };


// Initialize webpage with domain dropdown menu
d3.json("api/domainlist").then((domains) => {

    // Use domain names to generate dropdown menu
    // Select dropdown menu
    var dropdownOptions = d3.select('#domain-names');

    // Add "all" option to dropdown menu
    dropdownOptions.append('option').text('---').property('value', 'all')

    // Add domain names as dropdown menu options
    domains.forEach(domain => {
        dropdownOptions.append('option').text(`${domain}`).property('value', `${domain}`);
    });
});

// Import the keywords data and generate the lollipop chart and word cloud 
d3.json("/api/keywords/all").then((keywords) => {
    generateWordCloud(keywords);
    generateLollipopChart(keywords);
});

// // Import the domain scores data and generate the bubble chart and bar chart 
// d3.json("api/domainscores/all").then((domainscores) => {
//     generateBubbleChart('All', domainscores.article_data);
//     generateBarChart('All', domainscores.category_counts);
// });

// Function which changes data source
function changeKeywordData(selected){
     let api_call = 'api/keywords/' + selected;
    d3.json(api_call).then(function(keywords){
        generateWordCloud(keywords);
        generateLollipopChart(keywords);
    });
 };

// Function which changes data source
function changeData(){
    let selected = d3.select('#domain-names').property('value');
    let api_call = 'api/domainscores/' + selected;
    d3.json(api_call).then(function(domainscores){
        generateBubbleChart('All', domainscores.article_data);
        generateBarChart('All', domainscores.category_counts);
      });
    changeKeywordData(selected)
  };

// CThis function clears filter and returns to all data
function clearFilter(){
    location.reload()
};

// Select dropdown menu
var dropdown = d3.select('#domain-names')

// Select the clear filter button
var clearFilterButton = d3.select('#refresh-btn');

// Create event handler which listens for change in dropdown menu
dropdown.on('change', changeData);

// Create event handler which listens for click on clear filter button
clearFilterButton.on('click', clearFilter);