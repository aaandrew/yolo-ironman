// Amazing Visualization from : http://bl.ocks.org/mbostock/raw/5415941/
// (following)friends = rings, statuses = speed, followers = size
// Scales for semimajor axis, planet radius, and planet period.
var x = d3.scale.linear().range([0, 400]),
    r = d3.scale.linear().domain([4, 40]).range([4 * .5, 40 * .5]).clamp(true),
    t = d3.scale.linear().range([0, 1]);

var padding = 16;

// Detect the appropriate vendor prefix.
var prefix = "-webkit-transform" in document.body.style ? "-webkit-"
  : "-moz-transform" in document.body.style ? "-moz-"
  : "";

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>"+d.name+" </span><strong>" + d.count + " followers</strong>";
  });

function showtip(d){
  var mousePos = d3.mouse(this);
  console.log('hellooo', d);
  console.log('from', mousePos);
}

d3.json("/twitterCustom", function(error, data) {
  var friendsArr = data.friends;
  for(var i in friendsArr){
    friendsArr[i] = ftype(friendsArr[i]);
  }

  // Add rings
  var friendsArrLen = friendsArr.length;
  for(var i=0; i<friendsArrLen; i++){
    var ringsCount = friendsArr[i].rings;
    if(ringsCount > 0){
      for(var j=1; j<=ringsCount; j++){
        var div = j+0.5;
        friendsArr.push({
          id: friendsArr[i].name,
          period: Math.random()*6 + 2,
          planet_radius: Math.random()*7 + 0.35,
          semimajor_axis: friendsArr[i].semimajor_axis/div
        });
      }
    }
  }

  var systems = d3.nest()
  .key(function(d) { return d.id; })
  .entries(friendsArr);

  systems.forEach(function(s) {
    s.values.forEach(function(p) { p.system = s; });
    s.radius = d3.max(s.values, function(p) { return x(p.semimajor_axis) + r(p.planet_radius); }) + padding;
  });

  systems.sort(function(a, b) {
    return a.radius - b.radius;
  });

  var system = d3.select("#d3custom").selectAll(".system")
  .data(systems)
  .enter().append("div")
  .attr("class", "system")
  .style("width", function(d) { return d.radius * 2 + "px"; })
  .style("height", function(d) { return d.radius * 2 + "px"; });

  system.append("svg")
  .attr("class", "orbit")
  .attr("width", function(d) { return d.radius * 2; })
  .attr("height", function(d) { return d.radius * 2; })
  .append("g")
  .attr("transform", function(d) { return "translate(" + d.radius + "," + d.radius + ")"; })
  .selectAll("circle")
  .data(function(d) { return d.values; })
  .enter().append("circle")
  .attr("r", function(d) { return x(d.semimajor_axis); });

  system.selectAll(".planet")
  .data(function(d) { return d.values; })
  .enter().append("svg")
  .attr("class", "planet")
  .attr("width", function(d) { return d.system.radius * 2; })
  .attr("height", function(d) { return d.system.radius * 2; })
  .style(prefix + "animation-duration", function(d) { return t(d.period) + "s"; })
  .style(prefix + "transform-origin", function(d) { return d.system.radius + "px " + d.system.radius + "px"; })
  .append("circle")
  .attr("transform", function(d) { return "translate(" + d.system.radius + "," + d.system.radius + ")"; })
  .attr("cx", function(d) { return x(d.semimajor_axis); })
  .attr("r", function(d) { return r(d.planet_radius); });

  $('.system').tipsy({ 
    fade: true,
    gravity: 'n', 
    html: true, 
    offset: -15,
    fallback: "If I die I'm a legend",
    title: function() {
      var d = this.__data__;
      return "<span>" + d.key + " " + d.values[0].followers + " followers</span>"; 
    }
  });

});

function ftype(d){
  var rings = 0;
  if(d.following > 5000){
    rings = 5;
  }else if(d.following > 2500){
    rings = 4;
  }else if(d.following > 1000){
    rings = 3;
  }else if(d.following > 700){
    rings = 2;
  }else if(d.following > 300){
    rings = 1;
  }

  var semimajor_axis = 0.02;
  if(d.followers > 8000000){
    semimajor_axis = 0.4;
  }else if(d.followers > 5000000){
    semimajor_axis = 0.35;
  }else if(d.followers > 2500000){
    semimajor_axis = 0.3;
  }else if(d.followers > 1000000){
    semimajor_axis = 0.25;
  }else if(d.followers > 500000){
    semimajor_axis = 0.15;
  }else if(d.followers > 250000){
    semimajor_axis = 0.10;
  }else if(d.followers > 100000){
    semimajor_axis = 0.08;
  }else if(d.followers > 50000){
    semimajor_axis = 0.07;
  }else if(d.followers > 2000){
    semimajor_axis = 0.06;
  }else if(d.followers > 1000){
    semimajor_axis = 0.05;
  }else if(d.followers > 500){
    semimajor_axis = 0.04;
  }else if(d.followers > 250){
    semimajor_axis = 0.03;
  }
  var planet_radius = Math.random()*7 + 0.35;
  if(semimajor_axis > 0.15){
    planet_radius = Math.random()*30 + 5;
  }
  d.id = d.name;
  d.period = Math.random()*3 + 1.3;
  d.planet_radius = planet_radius;
  d.semimajor_axis = semimajor_axis;
  d.rings = rings;
  return d;
}

function type(d) {
  d.period = +d.period;
  d.planet_radius = +d.planet_radius;
  d.semimajor_axis = +d.semimajor_axis;
  d.stellar_radius = +d.stellar_radius;
  console.log("d", d);
  return d;
}
