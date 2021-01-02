//Initial check - REMOVE BEFORE DEPLOYING
console.log('this webpage is rendering')

//TODO: 
// Determine how many words to put in word cloud (determined by size of word cloud)
// May also need to fiddle with sizing of words (will depend on what happens when we limit the words going in)
// Randomize color(s) of words in word cloud (.style('fill', FUNCTION HERE))

// Functions

// This function generates a word cloud with word size proportional to word frequency. 
// Required format of data: [{keyword: 'word', frequency: int}, {keyword: 'word', frequency: int}]
function generateWordCloud(wordArray) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#word-cloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    var layout = d3.layout.cloud()
    .size([width, height])
    .words(wordArray.map(function(d) { return {text: d.keyword, size:d.frequency}; }))
    .padding(10)
    .rotate(0)
    .fontSize(function(d) { return d.size * .5; })
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
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#9f0438")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }
}

// Import the keywords data, generate the lollipop chart and word cloud and update as the user selects filters
d3.json("/api/keywords").then((keywords) => {
    console.log(keywords)
    generateWordCloud(keywords)



})