/**
 * Created by pao on 12/22/15.
 */
(function(){

  'use strict';

  angular.module('vgsp')
    .directive('functionChart', [functionChart]);

  function functionChart() {
    return {
      restrict: 'E',
      replace: false,
      link: link,
      scope: {
        yvalues:'=',
        xvalues:'=',
      }
    };

    function link (scope, element, attrs) {
        //var d3ColorScale = d3.scale.linear().range(scope.colorScale).domain(scope.domain);
        var width, height, margin, scaleFactor, translateVec, nodeSize;

        margin = { top: 25, right: 10, bottom: 15, left: 30 };
        width = 300 - margin.left - margin.right;
        height = 200 - margin.top - margin.bottom;

        var svg = d3.select(element[0])
          .append("svg")
          .attr("class","chart")
          .attr("width", width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          ;

        var rect = svg.append("rect")
          .attr("width", width+ margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr("class","graph");

        var g = svg.append('g')
          .attr("transform","translate(" + margin.left + "," + margin.right + ")");

        var lineChart = g.selectAll(".line");

        var x = d3.scale.linear()
          .range([0, width]);
        var y = d3.scale.linear()
          .range([height, 0]);

        var line = d3.svg.line().interpolate("monotone")
          .x(function(d) { return x(d.xv); })
          .y(function(d) { return y(d.yv); });

        //var xAxis = d3.svg.axis()
        //.scale(x)
        //.orient("bottom");
        //.ticks(g.tick);

        scope.$watch('yvalues', render, true);

        function render (yvalues){
          if(!yvalues){ return; }

          console.log("hereagain");


          var data = [];
          data[0] = [];
          //yvalues.forEach(function(d,i){data.push({'xv': xvalues[i],'yv': d})} );
          yvalues.forEach(function(d,i){data[0].push({'xv': scope.xvalues[i],'yv': d})} );

          x.domain(d3.extent(data[0], function(d){return d.xv}));
          y.domain(d3.extent(data[0], function(d){return d.yv}));

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(g.tick);

          // if no axis exists, create one, otherwise update it
          if (g.selectAll(".x.axis")[0].length < 1 ){
            g.append("g")
              .attr("class","x axis")
              .attr("transform", "translate(0," + (height) + ")")
              .call(xAxis);
          } else {
            g.selectAll(".x.axis").transition().duration(1500).call(xAxis);
          }

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            //.innerTickSize(-width)
            //.outerTickSize(0)
            //.tickPadding(10)
            .ticks(g.tick);

          // if no axis exists, create one, otherwise update it
          if (g.selectAll(".y.axis")[0].length < 1 ){
            g.append("g")
              .attr("class","y axis")
              .call(yAxis);
          } else {
            g.selectAll(".y.axis").transition().duration(1500).call(yAxis);
          }

          //g.selectAll(".line").remove();
          lineChart = g.selectAll(".line")
            .data(data)
            .attr("class", "line");

          lineChart.transition().duration(1500)
            .attr("d",line);

          lineChart.enter().append("path")
            //.datum(data)
            .attr("class", "line")
            .attr("d", line);
          lineChart.exit().remove();
          
        }
    }
  }
})();
