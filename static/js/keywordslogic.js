// This script creates an arc diagram

// Read dummy data
d3.json('api/bigrams/headlines').then( function(data) {

    // set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 20, left: 30},
width = 600 - margin.left - margin.right,
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
      .attr("cx", 30)
      .attr("cy", function(d){ return(y(d.id))})
      .attr("r", 6)
      .style("fill", "#69b3a2")

  // And give them a label
  var labels = svg
    .selectAll("mylabels")
    .data(data.nodes)
    .enter()
    .append("text")
      .attr("x", 20)
      .attr("y", function(d){ return(y(d.id)+2)})
      .text(function(d){ return(d.id)})
      .style("text-anchor", "end")
      .style("font-size", "10px")

  // Add links between nodes. Here is the tricky part.

  // Add the links
  var links = svg
    .selectAll('mylinks')
    .data(data.links)
    .enter()
    .append('path')
    .attr('d', function (d) {
      start = y(d.source)    // y position of start node on the y axis
      end = y(d.target)      // y position of end node
      return ['M', 30, start,    // the arc starts at the coordinate 30, start (where the starting node is)
        'A',                            // This means we're gonna build an elliptical arc
        (start - end)/2*4, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
        (start - end)/2, 0, 0, ',',
        start < end ? 1 : 0, 30, ',', end] // We always want the arc on top. So if end is before start, putting 0 here turns the arc upside down.
        .join(' ');
    })
    .style("fill", "none")
    .attr("stroke", "black")

    nodes
      .on('mouseover', function (d) {
        // Highlight the nodes
        nodes.style('fill', "#B8B8B8")
        d3.select(this).style('fill', '#69b3b2')
        // Highlight the connections
        links
          .style('stroke', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? '#69b3b2' : '#b8b8b8';})
          .style('stroke-width', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? 2 : 1;})
      })
      .on('mouseout', function (d) {
        nodes.style('fill', "#69b3a2")
        links
          .style('stroke', 'black')
          .style('stroke-width', '1')
      })

})
