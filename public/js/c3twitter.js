(function() {
  $.getJSON( '/twitterMediaCounts')
    .done(function(data) {
      var cols = data.trends.map(function(item){
        for(i in item){
          return [i, item[i]];
        }
      });
      
      var chart = c3.generate({
        bindto: '#c3twitterchart',
        data: {
          columns: cols,
          type: 'pie'
        },
        tooltip: {
          format: {
            value: function (value, ratio, id) {
              var format = d3.format(',');
              return format(value) + ' retweets';
            }
          }
        }
      });
    });
})();