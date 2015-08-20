d3.json("nations.json", function(nations) { 

    // init
	   var filtered_nations = nations.map(function(nation) { return nation; });
     var year_idx = parseInt(document.getElementById("year_slider").value)-1950;

    // the cursor pointer
    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")  
    .style("visibility", "hidden");

    // country regions
    var region_names = ["Sub-Saharan Africa", "South Asia", "Middle East & North Africa", 
    "America", "East Asia & Pacific", "Europe & Central Asia"];

    var region_data = [];
    for (var i in region_names) {
    var filtered_nations_by_regions = nations.filter(function(nation){
        return (nation.region == region_names[i]); 
    });
    region_data[i] = calc_mean(filtered_nations_by_regions);
    }
    var filtered_reg_nations = region_data.map(function(region) { return region;});

    function calc_mean(mean_nations) {
    var mean_income = [];
    var mean_lifeExpectancy = [];

    for (var year_idx2 in mean_nations[0].years) {
        var sum_income = 0;
        var sum_lifeExpectancy = 0;
        var sum_population = 0;

        for (var k in mean_nations) {
            var kpop = mean_nations[k].population[year_idx2];
            var kincome = mean_nations[k].income[year_idx2];
            var klife = mean_nations[k].lifeExpectancy[year_idx2];

            sum_income += kpop*kincome; 
            sum_lifeExpectancy += kpop*klife;
            sum_population += kpop;             
        }

        mean_income[year_idx2] = sum_income/sum_population;
        mean_lifeExpectancy[year_idx2] = sum_lifeExpectancy/sum_population;
    }
    averageData = {
        region: mean_nations[0].region,
        years: mean_nations[0].years,
        mean_income: mean_income,
        mean_lifeExpectancy: mean_lifeExpectancy
    };

    return averageData;
}
	
	// select chart area
	var chart_area = d3.select("#chart_area");
	var frame = chart_area.append("svg");

	// create canvas
	var canvas = frame.append("g");

	// set plot margins
	var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
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
	var circScale = d3.scale.sqrt()
	.domain([0, 5e8])
	.range([2, 40]);
    var colScale = d3.scale.category20();

	// create the axes
	var xAxis = d3.svg.axis()
	.orient("bottom")
	.scale(xScale);
	var yAxis = d3.svg.axis()
	.orient("left")
	.scale(yScale);

	// draw axes
	canvas.append("g")
	.attr("class","axis")
	.attr("transform", "translate(0, "+ canvas_height +")")
	.call(xAxis);
	canvas.append("g")
	.attr("class","axis")
	.call(yAxis);

	var data_canvas = canvas.append("g")
  .attr("class", "data_canvas");

  update(year_idx);

    d3.selectAll(".region_cb").on("change", function () { 
  	var this_region = this.value;
  	if (this.checked) { // adding data points 
  		var new_nations = nations.filter(function(nation){ return nation.region == this_region;});
  		filtered_nations = filtered_nations.concat(new_nations);
      console.log(filtered_reg_nations)
      var new_regions = region_data.filter(function(nation){return nation.region == this_region;});
      filtered_reg_nations = filtered_reg_nations.concat(new_regions);
        }
  	else {
      console.log(filtered_reg_nations)
  		filtered_nations = filtered_nations.filter(function(nation){ 
  			return nation.region != this_region;});
        filtered_reg_nations = filtered_reg_nations.filter(function(nation){
        return nation.region != this_region;});
        console.log(filtered_reg_nations)
  		}
        update(year_idx);
  });

    d3.select("#year_slider").on("input", function () {
    year_idx = parseInt(this.value) - 1950;
    update(year_idx);
});


    //"http://lorempixel.com/400/200/cats"/>
    
    function update(year_idx) {

       var dot = data_canvas.selectAll(".dot")
                            .data(filtered_nations, function(d){return d.name});

       var avdot = data_canvas.selectAll(".avdot")
                            .data(filtered_reg_nations, function(d){return d.region});


    dot.enter().append("circle").attr("class","dot")                        
            .style("fill", function(d) { return colScale(d.region); })
            .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.name);})
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
            .filter(function(d){return d.name == "Japan"})
            .on("click",function(){
              var cat = d3.select("#catpic")
              .style("display",'inline')
              .on("click",function(){
              var new_title = document.getElementById("heading");
              new_title.innerHTML = "The Wealth & Health of the Nations";
              var cat = d3.select("#catpic")
              .style("display",'none')
              d = new Date();
              $("#catpic").attr("src",'http://lorempixel.com/800/600/cats?'+d.getTime());
              });
              var new_title = document.getElementById("heading");
              new_title.innerHTML = "Arigato!! You are fanCATStic teachers xx";
              });
    
    dot.exit().remove();
    
    dot.transition().ease("linear").duration(200)
        // income - horizontal
      .attr("cx", function(d) {return xScale(d.income[year_idx]); })
      // life expectancy - vertical
      .attr("cy", function(d) {return yScale(d.lifeExpectancy[year_idx]);})
      // population - radii
      .attr("r", function(d) {return circScale(d.population[year_idx])})
      .attr("fill",function(d){return colScale(d.region)});


      // REGION DOTS

    avdot.enter().append("rect").attr("class","avdot")                        
            .attr("stroke",'black')
            .attr("stroke-width",'4')
            .attr("width",'20')
            .attr("height",'20')

    avdot.exit().remove();
    
    avdot.transition().ease("linear").duration(200)
        // income - horizontal
      .attr("x", function(d) {return xScale(d.mean_income[year_idx]); })
      // life expectancy - vertical
      .attr("y", function(d) {return yScale(d.mean_lifeExpectancy[year_idx]);})
      .attr("fill", function(d){return colScale(d.region)});

    }

});