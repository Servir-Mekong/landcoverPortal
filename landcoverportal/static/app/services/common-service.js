(function() {

    'use strict';

    angular.module('landcoverportal')
    .service('CommonService', function (appSettings) {

        var service = this;

        service.mapClass = 'col-md-9 col-lg-9';
        service.sideClass = 'col-md-3 col-lg-3';

        service.getAreaVariableOptions = function (option, myanmar) {
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

        service.capitalizeString = function (string) {
            return string.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };

        service.AnalysisToolControl = function (controlDiv) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.setAttribute('class', 'tool-control text-center');
            controlUI.setAttribute('id', 'analysis-tool-control');
            controlUI.title = 'Toogle Tools Visibility';
            controlUI.innerHTML = "<i class='fas fa-times'></i>";
            controlDiv.appendChild(controlUI);
            return controlUI;
        };

        service.range = function (start, end) {
            var foo = [];
            for (var i = start; i <= end; i++) {
                foo.push(i);
            }
            return foo;
        };

        service.getPercent = function (part, sum) {
            return (part / sum * 100).toFixed(2);
        };

        service.pad2 = function (n) {
            return n < 10 ? '0' + n : n;
        };

        service.timeFormat = function (date) {
            return date.getFullYear().toString() + service.pad2(date.getMonth() + 1) + service.pad2(date.getDate()) + service.pad2(date.getHours()) + service.pad2(date.getMinutes()) + service.pad2(date.getSeconds());
        };

        service.isEmptyObject = function (obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        };

        service.objectHasKey = function (obj, key) {
            return obj.hasOwnProperty(key);
        };

        service.flattenArrays = function (arrays) {
            return [].concat.apply([], arrays);
        };

        service.buildChart = function (data, div, title) {
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

        service.buildPieChart = function (options) {

            var data = options.data;
            var div = options.div;
            var title = options.title;
            var showDataLabels = options.showDataLabels;
            var exportButtonPosition = options.exportButtonPosition || 'right';
            var pointFormat = options.pointFormat;
            var seriesName = options.seriesName;
            var dataLabelFormat = options.dataLabelFormat;

            var pieChartOptions = {
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
                    pointFormat: pointFormat
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        /*dataLabels: {
                            enabled: false
                        },*/
                        dataLabels: {},
                        showInLegend: true
                    }
                },
                series: [
                    {
                        name: seriesName,
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
                        ],
                        align: exportButtonPosition,
                        symbol: 'menuball'
                      }
                    }
                }
            };

            if (showDataLabels) {
                pieChartOptions.plotOptions.pie.dataLabels.enabled = true;
                pieChartOptions.plotOptions.pie.dataLabels.format = dataLabelFormat;
                pieChartOptions.plotOptions.pie.dataLabels.style = {};
                pieChartOptions.plotOptions.pie.dataLabels.style.color = (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black';
            } else {
                pieChartOptions.plotOptions.pie.dataLabels.enabled = false;
            }

            // build the chart
            Highcharts.chart(div, pieChartOptions);
        };

        service.buildColumnChart = function (options) {

            var categories = options.categories;
            var title = options.title;
            var subtitle = options.subtitle;
            var yAxisTitle = options.yAxisTitle;
            var data = options.data;
            var container = options.container;
            var toolTipUnit = options.toolTipUnit;
            var exportButtonPosition = options.exportButtonPosition || 'right';
            var dataLabels = options.dataLabels || false;

            var chartOptions = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                subtitle: {
                    text: subtitle
                },
                xAxis: {
                    categories: categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: yAxisTitle
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                 '<td style="padding:0"><b>{point.y:.2f} ' + toolTipUnit + '</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: dataLabels
                        }
                    }
                },
                series: data,
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
                        ],
                        align: exportButtonPosition,
                        symbol: 'menuball'
                      }
                    }
                }
            };

            Highcharts.chart(container, chartOptions);
        };

        service.createLayerContainer = function (overlayName, overlayType, overlayTypeLayer, map, show) {
            if (typeof(show) === 'undefined') show = true;
            var toggleLayerSlider = function () {
                if($('#layer-tab i#toggle-layer-' + overlayType).hasClass('fa-eye')) {
                    if ($(this).hasClass('closed')) {
                        $(this).removeClass('closed');
                        $('#layer-opacity-slider-' + overlayType).removeClass('display-none-imp');
                    } else {
                        $(this).addClass('closed');
                        $('#layer-opacity-slider-' + overlayType).addClass('display-none-imp');
                    }
                }
            };

            var toggleLayerOpacity = function () {
                if ($(this).hasClass('fa-eye')) {
                    $(this).removeClass('fa-eye').addClass('fa-eye-slash');
                    $('#layer-opacity-slider-' + overlayType).addClass('display-none-imp');
                    if (['polygon', 'preload'].indexOf(overlayType) > -1) {
                        if (overlayType === 'preload') {
                            map.data.forEach(function (feature) {
                                map.data.setStyle({
                                    visible: false
                                });
                            });
                        } else {
                            overlayTypeLayer.setVisible(false);
                        }
                    } else {
                        overlayTypeLayer.setOpacity(0);
                    }
                } else {
                    $(this).removeClass('fa-eye-slash').addClass('fa-eye');
                    $('#layer-opacity-slider-' + overlayType).removeClass('display-none-imp');
                    if (['polygon', 'preload'].indexOf(overlayType) > -1) {
                        if (overlayType === 'preload') {
                            map.data.forEach(function (feature) {
                                map.data.setStyle({
                                    visible: true,
                                    fillOpacity: 0,
                                    //strokeColor: 'yellow'
                                });
                            });
                        } else {
                            overlayTypeLayer.setVisible(true);
                        }
                    } else {
                        overlayTypeLayer.setOpacity(1);
                    }
                }
            };

            var _container = document.createElement('div');
            _container.setAttribute('class', 'leaflet-bar leaflet-html-legend');
            _container.setAttribute('id', 'layer-control-' + overlayType);

            var legendBlock = document.createElement('div');
            legendBlock.setAttribute('class', 'legend-block layer-control');

            var layerHeading = document.createElement('h4');
            layerHeading.setAttribute('class', 'inline-block-display');
            var legendCaret = document.createElement('div');
            legendCaret.setAttribute('class', 'legend-caret');
            var spanInHeading = document.createElement('span');
            spanInHeading.appendChild(document.createTextNode(overlayName[overlayType]));
            layerHeading.appendChild(legendCaret);
            layerHeading.appendChild(spanInHeading);

            var toggleLayer = document.createElement('i');
            toggleLayer.setAttribute('id', 'toggle-layer-' + overlayType);
            if (show) {
                toggleLayer.setAttribute('class', 'far fa-eye float-right');
            } else {
                toggleLayer.setAttribute('class', 'far fa-eye-slash float-right');
            }
            toggleLayer.style.cursor = 'pointer';
            toggleLayer.addEventListener('click', toggleLayerOpacity);

            var opacitySliderContainer = document.createElement('span');
            opacitySliderContainer.setAttribute('class', 'opacity-slider');
            opacitySliderContainer.setAttribute('id', 'layer-opacity-slider-' + overlayType);
            var sliderLabel = document.createElement('span');
            sliderLabel.setAttribute('class', 'slider-label inline-block-display');
            sliderLabel.appendChild(document.createTextNode('Transparency:'));
            var opacitySlider = document.createElement('input');
            opacitySlider.setAttribute('id', 'layer-opacity-slider');
            opacitySlider.setAttribute('class', 'layer-opacity-slider-' + overlayType);
            opacitySlider.setAttribute('data-slider-id', 'layer-opacity-slider');
            opacitySlider.setAttribute('type', 'text');
            opacitySlider.setAttribute('data-slider-min', '0');
            opacitySlider.setAttribute('data-slider-max', '1');
            opacitySlider.setAttribute('data-slider-step', '0.1');
            opacitySliderContainer.appendChild(sliderLabel);
            opacitySliderContainer.appendChild(opacitySlider);
            if (!show) {
                opacitySliderContainer.setAttribute('class', 'display-none-imp');
            }

            layerHeading.addEventListener('click', toggleLayerSlider);

            legendBlock.appendChild(layerHeading);
            legendBlock.appendChild(toggleLayer);
            legendBlock.appendChild(opacitySliderContainer);

            if (['polygon', 'preload'].indexOf(overlayType) > -1) {
                legendBlock.removeChild(opacitySliderContainer);
                layerHeading.removeChild(legendCaret);
            }

            var div1 = document.createElement('div');
            div1.appendChild(layerHeading);
            div1.appendChild(toggleLayer);

            var div2 = document.createElement('div');
            if (['polygon', 'preload'].indexOf(overlayType) === -1) {
                div2.appendChild(opacitySliderContainer);
            }

            legendBlock.appendChild(div1);
            legendBlock.appendChild(div2);
            _container.appendChild(legendBlock);

            return _container;
        };

    });

})();
