(function() {
  'use strict';

  angular.module('vgsp')
    .controller( 'vgsp.vis.controller', [
      '$rootScope',
      '$http',
      'vgsp.data.graph',
      'vgsp.data.graphFunction',
      visController])
  ;

  angular.module('vgsp')
    .controller( 'vgsp.menu.controller', [
      '$rootScope',
      '$http',
      menuController])
  ;

  function menuController($rootScope,
                          $http) {
    var self = this;

    // distributed smoothing
    self.smooth_t = 1.0;
    self.changeSmoothFunction = updateSmoothFunction;
    updateSmoothFunction(true);
    // distributed filtering

    self.filter_t = 1.0;
    self.changeFilterFunction = updateFilterFunction;

    self.changeToEnhancement = updateEnhancementFunction;
    self.changeToMedian = updateMedianFunction;
    self.changeToMean = updateMeanFunction;


    function updateSmoothFunction(valid) {
      if (valid && self.smooth_t>0) {
        var value = self.smooth_t.toFixed(4);
        $http.get('/smooth/' + value).then(function (response) {
          self.xvalues = response.data.xvalues;
          self.yvalues = response.data.yvalues;
          $rootScope.functionChanged = 'smooth_' + value;
        });
      }
    }

    function updateFilterFunction(valid) {
      if (valid && self.filter_t>0) {
        var value = self.filter_t.toFixed(4);
        $http.get('/filter/' + value).then(function (response) {
          self.xvalues = response.data.xvalues;
          self.yvalues = response.data.yvalues;
          $rootScope.functionChanged = 'filter' + value;
        });
      }
    }


    function updateEnhancementFunction() {
      $http.get('/enhancement').then(function (response) {
        self.xvalues = response.data.xvalues;
        self.yvalues = response.data.yvalues;
        $rootScope.functionChanged =  'enhancement';
      });
    }

    function updateMeanFunction() {
      $http.get('/mean').then(function (response) {
        $rootScope.functionChanged =  'mean';
      });
    }

    function updateMedianFunction() {
      $http.get('/median').then(function (response) {
        $rootScope.functionChanged =  'median';
      });
    }

  }

  function visController($rootScope,
                         $http,
                         dataService_graph,
                         dataService_graphFunction){
    var self = this;

    self.dataDir = "data/";
    self.graphFile = "graph/DS";
    self.graphFunctionFile = "testFunction";
    self.graphHasLoaded = false;
    self.signalHasLoaded = false;
    self.signalColorScale = ["#FFF9DF", "#fee101", "#D04F00"];

    self.coordinated = { selected: 1, tr : [0, 0], sc: 1, selectedTime: 1};

    loadData(self);
    $rootScope.$watch('functionChanged', reloadSignalProcessed);

    function loadData(ctr) {
      dataService_graph(ctr.dataDir + ctr.graphFile ).then(function (graph) {
        ctr.graph = graph;
        ctr.graphHasLoaded = true;
      });
      dataService_graphFunction(ctr.dataDir + ctr.graphFunctionFile).then(function (signal) {
        ctr.signalDomain = [signal.extent[0], (signal.extent[0] + signal.extent[1]) / 2, signal.extent[1]];
        ctr.signal = signal.data;
        ctr.signalProcessed = signal.data.slice(0); // Originalmente es la misma
        ctr.signalHasLoaded = true;
      });
    }

    function reloadSignalProcessed(value){
      if (value) {
        self.loading = true;
        $http.get('/getResult').then(function (response) {
          console.log("fue");
          self.signalProcessed = response.data.data;
        }).finally(function() {
          // called no matter success or failure
          self.loading = false;
        });
      }
    }


    //self.mainElem = d3.select(".main");
    //self.width = self.mainElem.style("width").replace("px", "")
    //  - self.mainElem.style("padding-left").replace("px", "")
    //  - self.mainElem.style("padding-right").replace("px", "");
    //self.height = 600;
    //
    //self.mainElem.append("svg").attr("width", self.width).attr("height", 600);
  }


}());