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

    // Set color scale
    var colors = ['#104b6d', '#a3d2a0', '#6f2b6e', '#5ac4f8']
    var colorScale = d3.scaleQuantile()
        .domain([d3.min(wordArray.map(function(d) {return d.frequency})), d3.max(wordArray.map(function(d) {return d.frequency}))])
        .range(colors);
    
    // Append the svg object to the body of the page
    var svg = d3.select("#word-cloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Construct a new cloud layout instance
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(wordArray.map(function(d) { return {text: d.keyword, size:d.frequency, color:colorScale(d.frequency)}; }))
        .padding(10)
        .rotate(0)
        .fontSize(function(d) { return fontScale(d.size); })
        .on("end", draw);
        layout.start();

    // This function takes the output of 'layout' above and draw the words
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

    // Append the svg object to the body of the page
    var svg = d3.select("#lollipop-chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // Sort data and pull top ten
    data.sort(function(b, a) {
    return a.frequency - b.frequency;
    })

    data = data.slice(0,10);

    // Add x axis
    var x = d3.scaleLinear()
        .domain([0, data[0].frequency])
        .range([ 0, width]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    // Add y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.keyword; }))
        .padding(1);
        svg.append("g")
        .call(d3.axisLeft(y))

    // Add lollipop lines
    svg.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
            .attr("x1", x(0))
            .attr("x2", function(d) { return x(d.frequency); })
            .attr("y1", function(d) { return y(d.keyword); })
            .attr("y2", function(d) { return y(d.keyword); })
            .attr("stroke", "grey")

    // Add lollipop circles
    svg.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x(d.frequency); })
            .attr("cy", function(d) { return y(d.keyword); })
            .attr("r", "7")
            .style("fill", "#a3d2a0")
            .attr("stroke", "grey")
            .append("svg:title")
                .text(function(d) { return d.frequency; })

};

// This function creates a bubble chart of headline sentiment scores using Plotly
function generateBubbleChart(data) {

    // Create trace
    let bubbleTrace = {
        y: data.map(headline => headline.compound_score),
        x: data.map(headline => headline.published),
        mode: 'markers',
        marker: {
            color: data.map(headline => (Math.abs(headline.compound_score) + 1) *10),
            size: data.map(headline => (Math.abs(headline.compound_score) + 1) *10), 
            sizeref: 0.3,
            sizemode: 'area',
            colorscale: [['0.0', '#104b6d'], ['0.3333', '#a3d2a0'], ['0.6666','#6f2b6e'], ['1','#5ac4f8']]
        },
        text: data.map(headline => headline.sentiment_category),
        type: 'scatter'
    };
    // Create layout
    let layout = {
        title: `Sentiment Scores`,
        hovermode: 'closest',
        showlegend: false,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Compound Sentiment Score' },
        config: {responsive: true}
    };
    // Generate plot
    Plotly.newPlot('bubble-chart', [bubbleTrace], layout);
};

// This function generates a bar chart with a breakdown of sentiment category using Plotly
function generateBarChart(data) {

    // Trace for sentiment categories
    var trace = {
        y: data.map(category => category.count),
        x: data.map(category => category.category),
        type: "bar",
        marker: {color: ['#104b6d', '#a3d2a0', '#6f2b6e']}
    };

    // Turn trace into array
    var data = [trace];
    
    // Set layout
    var layout = {
        title: `Sentiment Frequency`
    };
    
    // Render the plot in the html
    Plotly.newPlot("bar-chart", data, layout);
}

//This function adds zoom capability to the bubble chart
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

// Initialize header
// Select header html
var header = d3.select('#news-source')
    
// Add initial head
header.append('p').text('All News Source Headlines')

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

// Select the loading buttons
var keyword_loading = d3.select("#loading-keywords")
var domain_loading = d3.select("#loading-domains")


// Import the keywords data and generate the lollipop chart and word cloud 
d3.json("/api/keywords/all/all").then((keywords) => {
    // Hide the loading button once the data loads
    keyword_loading.classed("d-none", true);
    // Generate plots
    generateWordCloud(keywords);
    generateLollipopChart(keywords);
});

// Import the domain scores data and generate the bubble chart and bar chart 
d3.json("api/domainscores/all").then((domainscores) => {
    // Hide the loading button once the data loads
    domain_loading.classed("d-none", true)
    // Generate plots
    generateBubbleChart(domainscores.article_data);
    generateBarChart(domainscores.category_counts);
});

// Function which changes data source for keyword plots
function changeKeywordData(selected_domains){
    // Pass in another variable (selected_sentiments)
    // Use both variables to create api call
     let api_call = 'api/keywords/' + selected_domains + '/all';
    d3.json(api_call).then(function(keywords){
        generateWordCloud(keywords);
        generateLollipopChart(keywords);
    });
 };

// Function which changes data source for domain plots 
function changeData(){
    // Clear header
    header.html('')

    // Pull dropdown selection value
    let selected = d3.select('#domain-names').property('value');

    // Create new header
    header.append('p').text(`${selected} Headlines`)

    let api_call = 'api/domainscores/' + selected;
    d3.json(api_call).then(function(domainscores){
        generateBubbleChart(domainscores.article_data);
        generateBarChart(domainscores.category_counts);
      });
    changeKeywordData(selected)
  };

// This function clears filter and returns to all data by reloading the page
function clearFilter(){
    location.reload()
};

// This function updates the keyword data based on the button clicked
function filterKeywords() {
    let sel_domain = d3.select('#domain-names').property('value');
    let sent_filter = this.id;
    let api_call = 'api/keywords/' + sel_domain + '/' + sent_filter;

    d3.json(api_call).then(function(keywords){
        generateWordCloud(keywords);
        generateLollipopChart(keywords);
    });
};

// Select dropdown menu
var dropdown = d3.select('#domain-names');

// Select the clear filter button
var clearFilterButton = d3.select('#refresh-btn');

// Add a button to the html (options: ---- (all), positive, neutral, negative)
var sentFilterButtons = d3.selectAll('.sent-btn')

// Create event handler which listens for change in dropdown menu
dropdown.on('change', changeData);

// Create event handler which listens for click on clear filter button
clearFilterButton.on('click', clearFilter);

// Create event handler which listens for click on sentiment filter buttons
sentFilterButtons.on('click', filterKeywords);