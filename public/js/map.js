var EventMap = function(){
		this.events = [];
		this.map = new Datamap({
			scope: 'world',
			element: document.getElementById('container'),
			projection: 'mercator',
			geographyConfig: {
				highlightOnHover: false,
				popupOnHover: false
			},
			fills: {
				defaultFill: '#00FF00',
				lt50: 'white',
				gt50: 'white'
			},

			data: {
			}
		});
	};

	EventMap.prototype.update = function() {
		var evtmap = this;
		evtmap.map.bubbles(evtmap.events);
	};

//keep reference to event and then filter the array
EventMap.prototype.add = function(lati, longi) {
	var evtmap = this;
	var coords = {
		latitude: lati,
		longitude: longi,
		radius: 4,
		fillKey: 'gt50',
		popupOnHover: false,
		borderColor: 'rgba(255, 255, 255, 0.2)',
		highlightOnHover: false,
		highlightFillColor: '#FC8D59'
	};

	evtmap.events.push(coords);
	evtmap.update();

  //fade event from map after a certain time
  setTimeout(function(){
  	evtmap.events = evtmap.events.filter(function (e) {
  		return e.latitude !== coords.latitude && e.longitude !== coords.longitude;
  	});

    //bubbles, custom popup on hover template
  }, 2000);
};



	$(document).ready(function() {
		var map = new EventMap();

		socket.on('topic', function(data){
			console.log('topic');
			$('#topic').text(data);
		});

		socket.on('tweet', function(coords){
			map.add(coords.latitude, coords.longitude);
		});

	});
