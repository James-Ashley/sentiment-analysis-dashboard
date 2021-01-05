// This script creates an arc diagram

// Read dummy data
d3.json('api/bigrams/headlines').then( function(data) {

    // set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 20, left: 30},
width = 800 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;

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
  console.log(allNodes)

  // A linear scale to position the nodes on the y axis
  var y = d3.scalePoint()
    .range([0, height])
    .domain(allNodes)

  // Add the circle for the nodes
  svg
    .selectAll("mynodes")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("cx", 30)
      .attr("cy", function(d){ return(y(d.id))})
      .attr("r", 4)
      .style("fill", "#69b3a2")

  // And give them a label
  svg
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
  svg
    .selectAll('mylinks')
    .data(data.links)
    .enter()
    .append('path')
    .attr('d', function (d) {
      start = y(d.source)    // X position of start node on the X axis
      end = y(d.target)      // X position of end node
      return ['M', 30, start,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
        'A',                            // This means we're gonna build an elliptical arc
        (start - end)/2*4, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
        (start - end)/2, 0, 0, ',',
        start < end ? 1 : 0, 30, ',', end] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
        .join(' ');
    })
    .style("fill", "none")
    .attr("stroke", "black")

})
