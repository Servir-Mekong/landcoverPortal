(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('DashboardController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, ForestMonitorService) {
      $scope.landCoverClasses = [];
      $scope.LCForestColor = '';
      $scope.LCForest = '';
      $scope.LCUrbanColor = '';
      $scope.LCUrban = '';
      $scope.LCCroplandColor = '';
      $scope.LCCropland = '';
      $scope.LCWaterColor = '';
      $scope.LCWater = '';
      $scope.LCData = [];
      $scope.landCoverClasses = appSettings.landCoverClassesV4;
      $scope.landCoverClassesColor = {};
      for (var i = 0; i < $scope.landCoverClasses.length; i++) {
          $scope.landCoverClassesColor[$scope.landCoverClasses[i].name] = $scope.landCoverClasses[i].color;
      }

      $scope.selectorOptions = CommonService.getAreaVariableOptions('country');
      $scope.yearRange = CommonService.range(1987, 2018);

      // init the default year
      $scope.tableYear = $scope.yearRange[$scope.yearRange.length - 1];
      ForestMonitorService.getEndYear().then(function (data) {
          $scope.yearForestRange = CommonService.range(2000, parseInt(data.available_year));
          $scope.tableForestYear = $scope.yearForestRange[$scope.yearForestRange.length - 1];
          $scope.tableCanopyYear = $scope.yearForestRange[$scope.yearForestRange.length - 1];
          $scope.tableForestEndYear = $scope.yearForestRange[$scope.yearForestRange.length - 1];
          $scope.tableForestStartYear = $scope.yearForestRange[$scope.yearForestRange.length - 10];
          $scope.tableForestLossEndYear = $scope.yearForestRange[$scope.yearForestRange.length - 1];
          $scope.tableForestLossStartYear = $scope.yearForestRange[$scope.yearForestRange.length - 10];
          $scope.init();
      }, function (error) {
          showErrorAlert(error.error);
      });

      var classes_name = [];
      var lc_color = [];
      var chart = null;
      var chartLC2 = null;
      var forestChart= null;
      var landcoverPiechart= null;
      var canopyChart= null;
      $scope.areaName = null;
      $scope.forestGainRes = [];
      $scope.forestLossRes = [];

      //on change the area selector
      $scope.loadSelectors = function (name) {
          $scope.areaName = name;
          $scope.getStats();
      };


      // CSV exporting function
      $scope.exportCsv = function(type){
        if(type === 'landcover'){
          chart.downloadCSV();
        }else if (type === 'forest') {
          forestChart.downloadCSV();
        }else if (type === 'canopy'){
          canopyChart.downloadCSV();
        }
      };
      // PNG exporting fucnction
      $scope.exportPng = function(type){
        //checking condition
        if(type === 'landcover'){
          chart.exportChart();
        }else if (type === 'forest') {
          forestChart.exportChart();
        }else if (type === 'canopy'){
          canopyChart.exportChart();
        }
      };

      //High chart full screen
      $scope.fullscreen = function(type){
        Highcharts.FullScreen = function(container) {
          this.init(container.parentNode); // main div of the chart
        };

        Highcharts.FullScreen.prototype = {
          init: function(container) {
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
              container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
              container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
              container.msRequestFullscreen();
            }
          }
        };
        if(type === 'landcover'){
          chart.fullscreen = new Highcharts.FullScreen(chart.container);
        }else if (type === 'forest') {
          forestChart.fullscreen = new Highcharts.FullScreen(forestChart.container);
        }else if (type === 'canopy'){
          canopyChart.fullscreen = new Highcharts.FullScreen(canopyChart.container);
        }
      };
      $scope.init = function () {
        //init calling to get land cover stats
              $scope.getStats();
        // init calling the fuction to get forest stats
              $scope.getForestStats();
        // init getting tree canopy stats
              $scope.getCanopyStats();
        // init calling the fuction to get forest stats
              $scope.getForestGainStats();
        // init calling the fuction to get forest stats
              $scope.getForestLossStats();
      }
      // Get stats for the Land Cover graph
      $scope.getStats = function (version) {
        $scope.selectedYear= $("#year-variable-filter option:selected" ).text();
          $('#landcover-bar-chart').html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
          $('#landcover2-bar-chart').html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
          $('#landcover-pie-chart').html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
          var parameters = {
              classes:"0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
              year: $scope.tableYear,
              shape: $scope.shape,
              areaSelectFrom: 'country',
              areaName: $scope.areaName,
              version: version
          };
          LandCoverService.getStats(parameters)
          .then(function (data) {
            var graphData = [];
            var graphData2 = [];
            var graphData3 = [];
            var graphLCData3 = [];
            var graphLCData = [];
            var classes_name3 = [];
            var totalArea = 0;

            var chartTitle = '';
            if($scope.areaName === null){
              chartTitle = "The below column chart is showing the total area each of the land cover classes in lower Mekong countries in "+ $scope.tableYear;
              //$("#landcover-chart-desc").text("The below column chart is showing total area each of the land cover classes in lower Mekong countries in "+ $scope.tableYear);
            }else{
              chartTitle = "The below column chart is showing the total area each of the land cover classes in "+ $scope.areaName+ "in "+ $scope.tableYear;
              //$("#landcover-chart-desc").text("The below column chart is showing total area each of the land cover classes in "+ $scope.areaName+ "in "+ $scope.tableYear);
            }

              for (var key in data) {
                  totalArea += data[key];
                  graphData.push(data[key]);
                  lc_color.push($scope.landCoverClassesColor[key]);
                  graphData2.push({ name: key, y: data[key], color: $scope.landCoverClassesColor[key] });
                  if(data[key] <= 10000000){
                    graphData3.push({ name: key, y: data[key], color: $scope.landCoverClassesColor[key] });
                  }
              }

              for(var i=0; i<graphData2.length; i++){
                if(graphData2[i].name === "Surface Water") {
                  $scope.LCWater = (graphData2[i].y * 100 / totalArea).toFixed(2);
                  $scope.LCWaterColor = $scope.landCoverClassesColor[graphData2[i].name]
                }else if (graphData2[i].name === "Urban and Built Up") {
                  $scope.LCUrban = (graphData2[i].y * 100 / totalArea).toFixed(2);
                  $scope.LCUrbanColor = $scope.landCoverClassesColor[graphData2[i].name]
                }else if (graphData2[i].name === "Forest") {
                  $scope.LCForest = (graphData2[i].y * 100 / totalArea).toFixed(2);
                  $scope.LCForestColor = $scope.landCoverClassesColor[graphData2[i].name]
                }else if (graphData2[i].name === "Cropland") {
                  $scope.LCCropland = (graphData2[i].y * 100 / totalArea).toFixed(2);
                  $scope.LCCroplandColor = $scope.landCoverClassesColor[graphData2[i].name]
                }
              }

              graphData2.sort(function(a, b) {
                var keyA = a.y,
                  keyB = b.y;
                  // Compare the 2 dates
                  if (keyA < keyB) return -1;
                  if (keyA > keyB) return 1;
                  return 0;
              });
              for(var i=0; i<graphData2.length; i++){
                classes_name.push(graphData2[i].name);
                graphLCData.push({ name: graphData2[i].name, y: graphData2[i].y, color: graphData2[i].color });
              }

              graphData3.sort(function(a, b) {
                var keyA = a.y,
                  keyB = b.y;
                  // Compare the 2 dates
                  if (keyA < keyB) return -1;
                  if (keyA > keyB) return 1;
                  return 0;
              });
              for(var i=0; i<11; i++){
                classes_name3.push(graphData3[i].name);
                graphLCData3.push({ name: graphData3[i].name, y: graphData3[i].y, color: graphData3[i].color });
              }

              //Display the Land cover column chart
              chart = Highcharts.chart('landcover-bar-chart', {
                chart: {
                  type: 'column',
                  width: 900,
                  height: 600,
                  style: {
                      fontFamily: "sans-serif"
                  }
                },
                credits: {
                  enabled: false
                },
                title: {
                    enabled: true,
                    text: chartTitle,
                    align: 'left',
                    style: {
                    color: '#444',
                    fontSize: '12px',
                    fontWeight: 'normal',
                    textTransform: 'none'
                  }
                },
                subtitle: false,
                xAxis: {
                  categories: classes_name,
                  crosshair: true
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: 'Area (Hectare)'
                  },
                  style: {
                      fontFamily: 'sans-serif'
                  }
                },
                exporting: {
                         enabled: false
                },
                tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} Hectare</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
                },
                plotOptions: {
                  column: {
                    pointPadding: 0.0,
                    borderWidth: 0
                  }
                },
                series: [{
                  name: 'Area',
                  data: graphLCData,
                  showInLegend: false,

                }]
              });

              //Showing the land cover chart with 10 classes
              chartLC2 = Highcharts.chart('landcover2-bar-chart', {
                chart: {
                  type: 'column',
                  width: 400,
                  height: 400,
                  style: {
                      fontFamily: "sans-serif"
                  }
                },

                credits: {
                  enabled: false
                },
                title: false,
                subtitle: false,
                xAxis: {
                  categories: classes_name3,
                  crosshair: true
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: 'Area (Hectare)'
                  },
                  style: {
                      fontFamily: 'sans-serif'
                  }
                },
                exporting: {
                      enabled: false
                },
                tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} Hectare</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
                },
                plotOptions: {
                  column: {
                    pointPadding: 0.0,
                    borderWidth: 0
                  }
                },
                series: [{
                  name: 'Area',
                  data: graphLCData3,
                  showInLegend: false,

                }]
              });

              //Showing the pie chart
              landcoverPiechart = Highcharts.chart('landcover-pie-chart', {
                chart: {
                  type: 'pie',
                  // Explicitly tell the width and height of a chart
                  width: 500,
                  height: 400,
                  style: {
                      fontFamily: "sans-serif"
                  }
                },

                credits: {
                  enabled: false
                },
                title: false,
                subtitle: false,
                plotOptions: {
                    pie: {
                        allowPointSelect: false,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: { fontFamily: 'sans-serif'}
                        },
                        showInLegend: true,

                    }

                },
                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle',
                  itemMarginTop: 3,
                  itemMarginBottom: 3,
                  itemStyle: {
                      color: '#666666',
                      fontWeight: 'normal',
                      fontSize: '10px'
                  },
                  labelFormatter: function() {
                    return this.name + " (" + (this.y/totalArea*100).toFixed(2) + "%)";
                 }
               },

                exporting: {
                         enabled: false
                },
                series: [{
                  name: 'Area',
                  data: graphData2,
                  showInLegend: true,

                }]
              });


          }, function (error) {
              console.log(error);
          });
      };
      


      // Here is a function getting primary forest stats
      $scope.getForestStats = function () {
        var graphForestData = [];
        var classes_name = [];
        $('#forest-bar-chart').html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
          var parameters = {
              areaName: '',
              areaSelectFrom: "country",
              treeCanopyDefinition: 10,
              treeHeightDefinition: 5,
              year: $scope.tableForestYear,
              type: 'primaryForest'
          };

          ForestMonitorService.getStatsDashboard(parameters)
          .then(function (data) {
            var chartTitle = "The bar chart is showing the total primary forest area in "+ $scope.tableForestYear + " which the tree canopy greater than 10% and the tree height greater than 5 m.";
              // $("#forest-bar-desc").text(chartTitle);
              data = data.features.features;
              for(var i=0; i<data.length; i++){
                var keyName = data[i].properties.NAME_0;
                // in hectare (* 0.0001)
                var area_hectare = data[i].properties.sum * 0.0001;
                classes_name.push(keyName);
                graphForestData.push({ name: keyName, y: area_hectare });
              }

              forestChart = Highcharts.chart('forest-bar-chart', {
                chart: {
                  type: 'bar',
                  width: 400,
                  height: 300,
                  style: {
                      fontFamily: "sans-serif"
                  }
                },

                credits: {
                  enabled: false
                },
                title: {
                    enabled: true,
                    text: chartTitle,
                    align: 'left',
                    style: {
                    color: '#444',
                    fontSize: '12px',
                    fontWeight: 'normal',
                    textTransform: 'none'
                  }
                },
                subtitle: false,
                xAxis: {
                  categories: classes_name,
                  crosshair: true
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: 'Area (Hectare)'
                  },
                  style: {
                      fontFamily: 'serif'
                  }
                },
                exporting: {
                         enabled: false
                },
                tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} Hectare</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
                },
                plotOptions: {
                    series: {
                     borderWidth: 0,
                     color: {
                       linearGradient: [0, 0, 200, 0],
                       stops: [
                         [0, '#00587a'],
                         [1, '#008891']
                       ]
                     }
                   }
                },
                series: [{
                  name: 'Area',
                  data: graphForestData,
                  showInLegend: false,

                }]
              });

          }, function (error) {
              console.log(error);
          });
      };
      


      // Here is a function getting tree canopy stats
      $scope.getCanopyStats = function () {
        var graphCanopyData = [];
        var classes_name = [];
        $('#canopy-bar-chart').html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
          var parameters = {
              areaName: '',
              areaSelectFrom: "country",
              treeCanopyDefinition: 10,
              treeHeightDefinition: 5,
              year: $scope.tableCanopyYear,
              type: 'treeCanopy'
          };

          ForestMonitorService.getStatsDashboard(parameters)
          .then(function (data) {
            var chartTitle = "The bar chart is showing the tree canopy cover area in "+ $scope.tableCanopyYear+ " which the tree canopy greater than 10% and the tree height greater than 5 m."
            // $("#canopy-bar-desc").text(chartTitle);
              data = data.features.features;
              for(var i=0; i<data.length; i++){
                var keyName = data[i].properties.NAME_0;
                // in hectare (* 0.0001)
                var area_hectare = data[i].properties.sum * 0.0001;
                classes_name.push(keyName);
                graphCanopyData.push({ name: keyName, y: area_hectare });
              }

              canopyChart = Highcharts.chart('canopy-bar-chart', {
                chart: {
                  type: 'bar',
                  width: 400,
                  height: 300,
                  style: {
                      fontFamily: "sans-serif"
                  }
                },

                credits: {
                  enabled: false
                },
                title: {
                    enabled: true,
                    text: chartTitle,
                    align: 'left',
                    style: {
                    color: '#444',
                    fontSize: '12px',
                    fontWeight: 'normal',
                    textTransform: 'none'
                  }
                },
                subtitle: false,
                xAxis: {
                  categories: classes_name,
                  crosshair: true
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: 'Area (Hectare)'
                  },
                  style: {
                      fontFamily: 'serif'
                  }
                },
                exporting: {
                         enabled: false
                },
                tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} Hectare</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
                },
                plotOptions: {
                  series: {
                   borderWidth: 0,
                   color: {
                     linearGradient: [0, 0, 200, 0],
                     stops: [
                       [0, '#bfdcae'],
                       [1, '#81b214']
                     ]
                   }
                 }
                },
                series: [{
                  name: 'Area',
                  data: graphCanopyData,
                  showInLegend: false,

                }]
              });

          }, function (error) {
              console.log(error);
          });
      };
      




      // Here is a function getting primary forest stats
      $scope.getForestGainStats = function () {
        var res = [];
        var classes_name = [];
        $scope.forestGainRes = [];
        $('#forest-gain-list').html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
          var parameters = {
              areaName: '',
              areaSelectFrom: "country",
              treeCanopyDefinition: 10,
              treeHeightDefinition: 5,
              startYear: $scope.tableForestStartYear,
              endYear: $scope.tableForestEndYear,
              type: 'forestGain'
          };

          ForestMonitorService.getStatsDashboard(parameters)
          .then(function (data) {
            $('#forest-gain-list').html('');
              //$("#forest-gain-desc").text(chartDesc);
              data = data.features.features;
              for(var i=0; i<data.length; i++){
                var keyName = data[i].properties.NAME_0;
                // in million hectare (* 0.0001 / 1000000)
                var area_hectare = (data[i].properties.sum * 0.0001 / 1000000).toFixed(2);
                res.push({ name: keyName, area: area_hectare});
              }

              res.sort(function(a, b) {
                var keyA = a.area,
                  keyB = b.area;
                  // Compare the 2 dates
                  if (keyA > keyB) return -1;
                  if (keyA < keyB) return 1;
                  return 0;
              });
              for(var i=0; i<res.length; i++){
                $scope.forestGainRes.push({ name: res[i].name, area: res[i].area, order: i+1 });
              }


          }, function (error) {
              console.log(error);
          });
      };
      

      // Here is a function getting primary forest stats
      $scope.getForestLossStats = function () {
        var res = [];
        var classes_name = [];
        $("#forest-loss-list").html('<p style="color:#f89f1d; font-size:12px;">Please wait while We are generating chart for you...</p>');
        $scope.forestLossRes = [];
          var parameters = {
              areaName: '',
              areaSelectFrom: "country",
              treeCanopyDefinition: 10,
              treeHeightDefinition: 5,
              startYear: $scope.tableForestLossStartYear,
              endYear: $scope.tableForestLossEndYear,
              type: 'forestLoss'
          };

          ForestMonitorService.getStatsDashboard(parameters)
          .then(function (data) {
              $("#forest-loss-list").html('');
              //$("#forest-gain-desc").text(chartDesc);
              data = data.features.features;
              for(var i=0; i<data.length; i++){
                var keyName = data[i].properties.NAME_0;
                // in million hectare (* 0.0001 / 1000000)
                var area_hectare = (data[i].properties.sum * 0.0001 / 1000000).toFixed(2);
                res.push({ name: keyName, area: area_hectare});
              }

              res.sort(function(a, b) {
                var keyA = a.area,
                  keyB = b.area;
                  // Compare the 2 dates
                  if (keyA > keyB) return -1;
                  if (keyA < keyB) return 1;
                  return 0;
              });
              for(var i=0; i<res.length; i++){
                $scope.forestLossRes.push({ name: res[i].name, area: res[i].area, order: i+1 });
              }


          }, function (error) {
              console.log(error);
          });
      };
      


    });

})();
