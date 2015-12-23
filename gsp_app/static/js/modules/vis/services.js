(function() {
  'use strict';

  angular.module('vgsp')
    .factory('vgsp.data.plain', ['$http', plainDataService])
    .factory('vgsp.data.graph', ['$http', graphDataService])
    .factory('vgsp.data.graphFunction', ['$http', graphFunctionDataService]);

  function plainDataService($http){
    return getData;

    function getData(file){
      return $http.get(file).then(function(response){
        var data = response.data;
        return data;
      }, function(err){
        throw err;
      });
    }
  }

  function graphDataService($http){
    return getData;

    function getData(file){
      return $http.get(file).then(function(response){
        var graph = response.data;
        if(!graph) return;
        var bounds = [
          [graph.nodes[0].x, graph.nodes[0].y],
          [graph.nodes[0].x, graph.nodes[0].y]
        ];
        graph.nodes.forEach(function(d) {
          bounds[0][0] = Math.min(bounds[0][0], d.x);
          bounds[0][1] = Math.min(bounds[0][1], d.y);
          bounds[1][0] = Math.max(bounds[1][0], d.x);
          bounds[1][1] = Math.max(bounds[1][1], d.y);
        });

        graph.links.forEach(function(d) {
          d.source = graph.nodes[d.source];
          d.target = graph.nodes[d.target];
        });

        graph.dx =  bounds[1][0] - bounds[0][0];
        graph.dy =  bounds[1][1] - bounds[0][1];
        graph.cx = (bounds[0][0] + bounds[1][0]) / 2.0;
        graph.cy = (bounds[0][1] + bounds[1][1]) / 2.0;

        return graph;
      }, function(err){
        throw err;
      });
    }
  }

  function graphFunctionDataService($http){
    return getData;

    function getData(file){
      return $http.get(file).then(function(response){
        var fun_graph= response.data;
        if(!fun_graph) return;
        fun_graph.extent = d3.extent(fun_graph.data);
        return fun_graph;
      }, function(err){
        throw err;
      });
    }
  }
})();
