//SVG dimensions are determined by current width and height of the browser window
var svgWidth = 1200
var svgHeight = 600;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

//create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#map-id")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//D3 has some internal functionality that can turn GeoJSON data into screen coordinates based on the projection you set.
// This is not unlike other libraries such as Leaflet, but the result is much more open-ended, not constrained to shapes on a tiled Mercator map.1 So, yes, D3 supports projections.
var projection = d3.geoEquirectangular();

var path = d3.geoPath()
    .projection(projection);


d3.json("Data/world-countries.json").then(function(topology)  {
    // if (error) throw error;
    console.log(topology.objects)

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.ne_10m_admin_0_countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "land-boundary")
}).catch(function(error){console.log(error)}) 