var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>"+d.id+" </span><strong>" + d.followers + " followers</strong>";
  });

var margin = {top: 0, right: 40, bottom: 40, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//define scale of x to be from 0 to width of SVG, with .1 padding in between
var scaleX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

//define scale of y to be from the height of SVG to 0
var scaleY = d3.scale.pow().exponent(0.35)
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(scaleX)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(scaleY)
  .orient("left");

//create svg
var svg = d3.select("#d3starterchart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//get json object which contains media counts
d3.json('/twitterMediaCounts', function(error, data) {
  //set domain of x to be all the usernames contained in the data
  scaleX.domain(data.friends.map(function(d) { return d.name; }));

  //set domain of y to be from 0 to the maximum media count returned
  var max = d3.max(data.friends, function(d) { return d.count; });
  //f(max > 1000000)
  scaleY.domain([0, max]);

  //set up bars in bar graph
  svg.selectAll(".bar")
  .data(data.friends)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return scaleX(d.name); })
  .attr("width", scaleX.rangeBand())
  .attr("y", function(d) { return scaleY(d.count); })
  .attr("height", function(d) { return height - scaleY(d.count); })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = scaleX.domain(data.friends.sort(this.checked
      ? function(a, b) { return b.count - a.count; }
      : function(a, b) { return d3.ascending(a.name, b.name); })
    .map(function(d) { return d.name; }))
    .copy();

    svg.selectAll(".bar")
    .sort(function(a, b) { return x0(a.name) - x0(b.name); });

    var transition = svg.transition().duration(750),
    delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
    .delay(delay)
    .attr("x", function(d) { return x0(d.name); });

    transition.select(".x.axis")
    .call(xAxis)
    .selectAll("g")
    .delay(delay);
  }
});
