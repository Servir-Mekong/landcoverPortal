(function() {

    'use strict';

    angular.module('landcoverportal')
    .service('CommonService', function (appSettings) {

        this.mapClass = 'col-md-9 col-lg-9';
        this.sideClass = 'col-md-3 col-lg-3';

        this.getAreaVariableOptions = function (option, myanmar) {
            if (typeof(myanmar) === 'undefined') myanmar = false;
            if (option === 'country') {
                if (myanmar) {
                    return ['Myanmar'];
                }
                return appSettings.countries;
            } else if (option === 'province') {
                if (myanmar) {
                    return appSettings.myanmarProvinces;
                }
                return appSettings.provinces;
            }
        };

        this.capitalizeString = function (string) {
            return string.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };

        this.AnalysisToolControl = function (controlDiv) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.setAttribute('class', 'tool-control text-center');
            controlUI.setAttribute('id', 'analysis-tool-control');
            controlUI.title = 'Toogle Tools Visibility';
            controlUI.innerHTML = "<span class='glyphicon glyphicon-eye-open large-icon' aria-hidden='true'></span>";
            controlDiv.appendChild(controlUI);
            return controlUI;
        };

        this.buildChart = function (data, div, title) {
            // build the chart
            Highcharts.chart(div, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: title
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [
                    {
                        name: 'Area',
                        coloyByPoint: true,
                        data: data
                    }
                ],
                credits: {
                    enabled: false
                },
                exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: [
                            "printChart",
                            "separator",
                            "downloadPNG",
                            "downloadJPEG",
                            "downloadPDF",
                            "downloadSVG",
                            "separator",
                            "downloadCSV",
                            "downloadXLS",
                            //"viewData",
                            //"openInCloud"
                        ]
                      }
                    }
                  }
            });
        };

    });

})();
