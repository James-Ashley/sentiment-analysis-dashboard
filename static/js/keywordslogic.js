// This function creates an arc diagram
function createArc(data) {

        // Remove chart already present
        d3.select("svg").remove();
        
        // Sort nodes
        data.nodes.sort((a, b) => d3.ascending(a.id , b.id))
        
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 30, bottom: 20, left: 30},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select("#arc-diagram")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
        // List of node names
        var allNodes = data.nodes.map(function(d){return d.id})
    
        // A linear scale to position the nodes on the y axis
        var y = d3.scalePoint()
            .range([0, height])
            .domain(allNodes)
    
        // Add the circle for the nodes
        var nodes = svg
            .selectAll("mynodes")
            .data(data.nodes)
            .enter()
            .append("circle")
                .attr("cx", 100)
                .attr("cy", function(d){ return(y(d.id))})
                .attr("r", 6)
                .style("fill", "#5ac4f8")
                .attr("stroke", "white")
    
        // Add node labels
        var labels = svg
            .selectAll("mylabels")
            .data(data.nodes)
            .enter()
            .append("text")
                .attr("x", 90)
                .attr("y", function(d){ return(y(d.id)+2)})
                .text(function(d){ return(d.id)})
                .style("text-anchor", "end")
                .style("font-size", 10)
    
        // Add the links
        var links = svg
            .selectAll('mylinks')
            .data(data.links)
            .enter()
            .append('path')
            .attr('d', function (d) {
                start = y(d.source)    // y position of start node on the y axis
                end = y(d.target)      // y position of end node
                return ['M', 100, start,    // the arc starts at the coordinate 100, start (where the starting node is)
                    'A',                            // Build an elliptical arc
                    (start - end)/2*2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                    (start - end)/2, 0, 0, ',',
                    start < end ? 1 : 0, 100, ',', end] // Make sure the arc is on top, so if the end is before start, putting 0 here turns the arc upside down.
                    .join(' ');
            })
            .style("fill", "none")
            .attr("stroke", "black");
        
        // Highlight links/nodes on mouseover
        nodes
            .on('mouseover', function (d) {
                // Highlight the nodes
                nodes.style('fill', "#B8B8B8")
                d3.select(this).style('fill', "#5ac4f8")
                // Highlight the connections
                links
                    .style('stroke', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? '#5ac4f8' : '#b8b8b8';})
                    .style('stroke-width', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? 2 : 1;})
                labels
                    .style("font-size", function(label_d){ return label_d.id === d.id ? 15 : 10 } )
            })
            .on('mouseout', function (d) {
                nodes.style('fill', "#5ac4f8")
                links
                    .style('stroke', 'black')
                    .style('stroke-width', '1')
                labels
                    .style("font-size", 10 )
            });

}

// Initialize arc diagram
d3.json('api/bigrams/headlines').then( function(data) {
    createArc(data);
    })

// Select dropdown menu
var nodeOrder = d3.select('#text-type');

// Function which changes data source
function changeData(){
    let selected = d3.select('#text-type').property('value');
    let api_call = 'api/bigrams/' + selected;
    d3.json(api_call).then(function(data){
        createArc(data);
    });
};

// Create event listener which listens for change in dropdown menu
nodeOrder.on('change', changeData);
