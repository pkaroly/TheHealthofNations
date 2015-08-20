d3.json("nations.json", function(nations) { 
	
	// select chart area
	var chart_area = d3.select("#chart_area");
	var frame = chart_area.append("svg");

	// create canvas
	var canvas = frame.append("g");

	// set plot margins
	var margin = {top: 19.5, right: 19.5, bottom: 20.5, left: 39.5};
	var frame_width = 960;
	var frame_height = 350;
	var canvas_width = frame_width - margin.left - margin.right;
	var canvas_height = frame_height - margin.top - margin.bottom;

	// Set frame attributes width and height.
	frame.attr("width", frame_width);
	frame.attr("height", frame_height);

	// Shift the canvas and make it slightly smaller than the svg canvas.
	canvas.attr("transform", "translate("+ margin.left +","+ margin.top +")");

	// var first_circle = canvas.append("circle");
	// first_circle.attr("r", '40px');
	// first_circle.attr("fill",'green');
	// first_circle.attr("stroke",'black');
	// first_circle.attr("cx",50);
	// first_circle.attr("cy",30);

	// axes scales
	var xScale = d3.scale.log()
	.domain([250, 1e5])
	.range([0, canvas_width]);
	var yScale = d3.scale.linear()
	.domain([85, 10])
	.range([0, canvas_height]);

	// create the axes
	var xAxis = d3.svg.axis()
	.orient("bottom")
	.scale(xScale);
	var yAxis = d3.svg.axis()
	.orient("left")
	.scale(yScale);

	// draw axes
	canvas.append("g")
	.attr("class","x axis")
	.attr("transform", "translate(0, "+ canvas_height +")")
	.call(xAxis);
	canvas.append("g")
	.attr("class","y axis")
	.call(yAxis);

});