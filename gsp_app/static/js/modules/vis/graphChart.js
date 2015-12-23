/**
 * Created by pao on 12/8/15.
 */
(function(){

  'use strict';

  angular.module('vgsp')
    .directive('graphChart', [graphChart]);

  function graphChart() {
    return {
      restrict: 'E',
      replace: false,
      link: link,
      scope: {
        graph:'=',
        coordinated:'=',
        gfun:'=',
        colorScale:'=',
        domain:'=',
      }
    };

    function link (scope, element, attrs) {

      var width, height, margin, scaleFactor, translateVec, nodeSize, colorScale;

      margin = { top: 10, right: 15, bottom: 20, left: 10 };
      width = d3.select(element[0])[0][0].offsetWidth - margin.left - margin.right;
      height = 500 - margin.top - margin.bottom;

      colorScale = d3.scale.linear()
        .range(scope.colorScale)
        .domain(scope.domain);

      var svg = d3.select(element[0])
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        ;

      var rect = svg.append("rect")
        .attr("width", width+ margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("class","graph");

      var pg = svg.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .append("g")
      var g = pg.append('g');

      var links = g.selectAll("line");
      var nodes = g.selectAll("circle");


      scope.$watch('graph', render);
      scope.$watch('coordinated.tr[0]*coordinated.tr[1]*coordinated.sc', transformView);
      scope.$watch('coordinated.selected', changeSelected);
      scope.$watch('coordinated.selectedTime', colorNodes);
      scope.$watch('gfun', colorNodes, true);

      function render (graph){
        if(!graph){ return; }
        scaleFactor = 1.0/Math.max(graph.dx / width, graph.dy / height);
        translateVec= [width/2- scaleFactor*graph.cx,
          height/2-scaleFactor*graph.cy];
        var zoom = d3.behavior.zoom()
          .on("zoom", zoomed);
        svg.call(zoom);
        pg.attr('transform', 'translate(' + translateVec+ ')scale(' + scaleFactor + ')');

        nodeSize = 3.2/scaleFactor;

        links = links.data(graph.links);
        links.exit().remove();
        links.enter()
          .append("line")
          .attr("class","vis-link")
          .attr("x1", function(d) {
            return d.source.x;
          }) // half of the 20 side margin specified above
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        nodes = nodes.data(graph.nodes);
        nodes.exit().remove();
        nodes.enter()
          .append("circle")
          .attr("class","vis-node")
          .attr("r", nodeSize)
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          })
          .on("click", function(d, i){
            scope.$apply(function(){
              scope.coordinated.selected= i;
            });
          });


        function zoomed() {
          scope.$apply(function(){
            scope.coordinated.tr= d3.event.translate;
            scope.coordinated.sc=  d3.event.scale;
            scope.coordinated.tr[0] /= scaleFactor;
            scope.coordinated.tr[1] /= scaleFactor;
          });
        }
      };

      function colorNodes(){
        if(!scope.gfun){ return; }
        nodes.attr("fill", function(d, i) {
          d.value = scope.gfun[i];
          //if (Math.abs(d.value) > 0.1)
          return colorScale(d.value);
          return "none";
        });
      }

      function transformView(){
        g.attr("transform", "translate(" + scope.coordinated.tr+ ")scale(" + scope.coordinated.sc+ ")");
      };

      function changeSelected(selected){
        if(!selected){ return; }
        selected = parseInt(selected,10);
        nodes.attr("r", function(d,i){
            return (i===selected? 2.5*nodeSize:nodeSize);
          })
          .attr("class", function(d,i){
            return (i===selected? 'vis-node selected':'vis-node');
          });
      };

    }
  };

})();
