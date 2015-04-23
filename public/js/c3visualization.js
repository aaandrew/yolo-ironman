(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      var yCounts = data.users.map(function(item){
        return item.counts.media;
      });
      
      yCounts.unshift('Media_Count');
      var chart = c3.generate({
        bindto: '#c3chart',
        data: {
          columns: [
            yCounts 
          ], types: {
            Media_Count: 'area-spline',
            data2: 'area-spline'
          },
          groups: [['Media_Count', 'data2']]
        }
      });
    });
})();
