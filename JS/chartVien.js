var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("Data/Combined_Data.csv", function(censusData) {
    var years = []
    var year = String("1960");
    var dataChart = [];
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // console.log(censusData[0]);
    // console.log(censusData[1]);
    // console.log(censusData[2]);
    // console.log(censusData[3]);

    for (i = 0; i <= 1053; i += 4) {
      if (isNaN(parseFloat(censusData[i][year])) || isNaN(parseFloat(censusData[i+1][year])) || isNaN(parseFloat(censusData[i+3][year]))) {continue;}
      dataChart.push(
        {
          "Country": censusData[i].CountryCode,
          "CountryName": censusData[i].CountryName,
          "Year": year,
          "GDP": parseFloat(censusData[i][year]),
          "Life": parseFloat(censusData[i+1][year]),
          "Population": parseFloat(censusData[i+3][year]),  
        }
      );
    }

    console.log(dataChart);

  // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(dataChart, d => d.GDP)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(dataChart, d => d.Life)])
      .range([height, 0]);

  //   // Step 3: Create axis functions
  //   // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  //   // Step 4: Append Axes to the chart
  //   // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

  //Step 5: Create Circles
  //==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(dataChart)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.GDP))
    .attr("cy", d => yLinearScale(d.Life))
    .attr("r", function(d) { return (d.Country === "USA" || d.Country === "VNM" || d.Country === "WLD" || d.Country === "CHN" ? "8" : "5"); })
    .attr("fill", function(d) { return (d.Country === "USA" || d.Country === "VNM" || d.Country === "WLD" || d.Country === "CHN" ? "red" : "grey"); })
    .attr("opacity", function(d) { return (d.Country === "USA" || d.Country === "VNM" || d.Country === "WLD" || d.Country === "CHN" ? "0.75" : "0.5"); });

  //Step 6: Initialize tool tip
  //==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.CountryName}<br>GDP per capita: $${Math.round(d.GDP/1000)}k<br>Life Expectancy: ${Math.round(d.Life)}`);
      });

  //Step 7: Create tooltip in the chart
  //==============================
    chartGroup.call(toolTip);

  //Step 8: Create event listeners to display and hide the tooltip
  //==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  //Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Life Expectancy");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("GDP per capita");
  });

  // Time
  var dataTime = d3.range(1960, 2017).map(function(d) {
    return new Date(1960 + d, 10, 3);
  });

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(1960, 10, 3))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));