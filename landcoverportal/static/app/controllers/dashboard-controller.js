(function () {

    'use strict';
    angular.module('landcoverportal')
    .controller('DashboardController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, CommonService, MapService, LandCoverService, blogService, eventsService) {
      $scope.landCoverClasses = [];
      $scope.landCoverClasses = appSettings.landCoverClassesV4;
      $scope.landCoverClassesColor = {};
      for (var i = 0; i < $scope.landCoverClasses.length; i++) {
          $scope.landCoverClassesColor[$scope.landCoverClasses[i].name] = $scope.landCoverClasses[i].color;
      }

      $scope.selectorOptions = CommonService.getAreaVariableOptions('country');
      $scope.yearRange = CommonService.range(1987, 2018);

      var classes_name = [];
      var lc_color = [];
      var chart = null;



      $scope.loadSelectors = function (name) {
          $scope.areaName = name;
          $scope.getStats();
      };


      $scope.tableYear = $scope.yearRange[$scope.yearRange.length - 1];

      $scope.exportCsv = function(){
        chart.downloadCSV()
      }
      $scope.exportPng = function(){
        chart.exportChart()
      }
      $scope.fullscreen = function(){
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
        chart.fullscreen = new Highcharts.FullScreen(chart.container);
      }


      // Get stats for the graph
      $scope.getStats = function (version) {
        $scope.selectedYear= $("#year-variable-filter option:selected" ).text();
          $('#landcover-bar-chart').html('<p style="color:#f89f1d; font-size:12px;">Please wait while I generate chart for you...</p>');
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
              for (var key in data) {
                  graphData.push(data[key]);
                  classes_name.push(key);
                  lc_color.push($scope.landCoverClassesColor[key]);
                  graphData2.push({ name: key, y: data[key], color: $scope.landCoverClassesColor[key] });
              }

              // var densityData = {
              //   label: 'Land Cover Classes',
              //   data: graphData,
              //   backgroundColor: lc_color,
              //   borderColor: 'rgba(0, 99, 132, 1)'
              // };
              //
              // var planetData = {
              //   labels: classes_name,
              //   datasets: [densityData]
              // };
              //
              // var chartOptions = {
              //   scales: {
              //     yAxes: [{
              //       scaleLabel: {
              //         display: true,
              //         labelString: 'Area (Hectare)'
              //       },
              //       ticks: {
              //         // Include a dollar sign in the ticks
              //         callback: function(value, index, values) {
              //             return (value /1000000) + "M";
              //         }
              //       }
              //     }]
              //   },
              //   legend: {
              //       display: false,
              //       labels: {
              //           fontColor: 'rgb(255, 99, 132)'
              //       }
              //   }
              //
              // };
              //
              // // get bar chart canvas
              // var income = document.getElementById("income").getContext("2d");
              // // draw bar chart
              // new Chart(income, {
              //   type: 'bar',
              //   data: planetData,
              //   options: chartOptions
              // });


              chart = Highcharts.chart('landcover-bar-chart', {
                chart: {
                  type: 'column',
                  // Explicitly tell the width and height of a chart
                  width: 1000,
                  height: 600,
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
                  column: {
                    pointPadding: 0.0,
                    borderWidth: 0
                  }
                },
                series: [{
                  name: 'Area',
                  data: graphData2,
                  showInLegend: false,

                }]
              });


          }, function (error) {
              console.log(error);
          });
      };

      $scope.getStats();






    });

})();
