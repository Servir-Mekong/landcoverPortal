
var wclimTempList, wclimPPTList;
var chirpsDateList, chirpsValueList;
var lcClassList, lcAreaList;

var chart;


// Set chart export options 
var exportContextMenu = {
    buttons: {
        contextButton: {
            menuItems: [{
                textKey: 'downloadPNG',
                onclick: function () {
                    this.exportChart();
                }
            }, {
                textKey: 'downloadJPEG',
                onclick: function () {
                    this.exportChart({
                        type: 'image/jpeg'
                    });
                }
            }, {
                textKey: 'downloadPDF',
                onclick: function () {
                    this.exportChart({
                        type: 'image/pdf'
                    });
                }
            }, {
                textKey: 'downloadCSV',
                onclick: function () { this.downloadCSV(); }
            }]
        }
    }
}


function createChartChirps() {
    //chirpsDateList, chirpsValueList
    chart = Highcharts.chart('chartDiv', {
            chart: {
            type: 'column'
				},
            title: {
                text: 'CHIRPS Rainfall 2015',
                x: -20 //center
            },
            //subtitle: {
            //    text: 'Source: WorldClimate.com',
            //    x: -20
            //},
            xAxis: {
                categories: chirpsDateList
            },
            yAxis: {
                title: {
                    text: 'Rainfall (mm/pentad)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' mm/pentad'
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 50,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Rainfall',
                data: chirpsValueList
            }],

            exporting: exportContextMenu
        });

}



function createChartLandcover() {

    chart = Highcharts.chart('chartDiv', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Land Cover Distribution 2015'
        },
        //subtitle: {
        //    text: 'Source: WorldClimate.com'
        //},
        xAxis: {
            categories: lcClassList,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Area (ha)'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} ha</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Area',
            data: formatLCData(lcAreaList)

        }],
        
        exporting: exportContextMenu

    });

}



function formatLCData(lcAreaList) {
    var colorList = ['#6f6f6f','#aec3d4','#111149','#387242','#c3aa69','#cc0013','#8dc33b','#30eb5b','#152106','#ff4ef8'];
    var chartSeries = []
    for (i = 0; i < 10; i++) {
        chartSeries.push({ y: lcAreaList[i], color: colorList[i] });
    }
    return chartSeries;
}



//Chart type: line or column
function createChartWclim() {
    //wclimTemp, wclimPPT
    //wclimTemp = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
    //wclimPPT = [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];

    chart = Highcharts.chart('chartDiv', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Monthly Average Temperature and Rainfall'
        },
        //subtitle: {
        //    text: 'Source: WorldClimate.com'
        //},
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Rainfall',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 50,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Rainfall',
            type: 'column',
            yAxis: 1,
            data: wclimPPTList,
            tooltip: {
                valueSuffix: ' mm'
            }

        }, {
            name: 'Temperature',
            type: 'spline',
            data: wclimTempList,
            tooltip: {
                valueSuffix: ' °C'
            }
        }],

        exporting: exportContextMenu
    });


}



function createChart(param) {
    if (param == "chirps") {
        createChartChirps();
    }
    else if (param == 'wclim') {
        createChartWclim();
    }
    else if (param == 'lcover') {
        createChartLandcover();
    }
}







//categoryArray = ['Class_11', 'Class_14', 'Class_20', 'Class_30', 'Class_50', 'Class_70', 'Class_100', 'Class_130', 'Class_140', 'Class_200'];
//valArray = [17644.212, 188.7218, 2503.2548, 1748.013, 750.0826, 359.3564, 907.3591, 3108.5218, 50.8941, 220.577];

//var lcClasses =
//    {
//        "Class_11": "Post-flooding or irrigated croplands (or aquatic)",
//        "Class_14": "Rainfed croplands",
//        "Class_20": "Mosaic cropland (50-70%) / vegetation (grassland/shrubland/forest) (20-50%)",
//        "Class_30": "Mosaic vegetation (grassland/shrubland/forest) (50-70%) / cropland (20-50%)",
//        "Class_40": "Closed to open (>15%) broadleaved evergreen or semi-deciduous forest (>5m)",
//        "Class_50": "Closed (>40%) broadleaved deciduous forest (>5m)",
//        "Class_60": "Open (15-40%) broadleaved deciduous forest/woodland (>5m)",
//        "Class_70": "Closed (>40%) needleleaved evergreen forest (>5m)",
//        "Class_90": "Open (15-40%) needleleaved deciduous or evergreen forest (>5m)",
//        "Class_100": "Closed to open (>15%) mixed broadleaved and needleleaved forest (>5m)",
//        "Class_110": "Mosaic forest or shrubland (50-70%) / grassland (20-50%)",
//        "Class_120": "Mosaic grassland (50-70%) / forest or shrubland (20-50%)",
//        "Class_130": "Closed to open (>15%) (broadleaved or needleleaved, evergreen or deciduous) shrubland (<5m)",
//        "Class_140": "Closed to open (>15%) herbaceous vegetation (grassland, savannas or lichens/mosses)",
//        "Class_150": "Sparse (<15%) vegetation",
//        "Class_160": "Closed to open (>15%) broadleaved forest regularly flooded (semi-permanently or temporarily) - Fresh or brackish water",
//        "Class_170": "Closed (>40%) broadleaved forest or shrubland permanently flooded - Saline or brackish water",
//        "Class_180": "Closed to open (>15%) grassland or woody vegetation on regularly flooded or waterlogged soil - Fresh, brackish or saline water",
//        "Class_190": "Artificial surfaces and associated areas (Urban areas >50%)",
//        "Class_200": "Bare areas",
//        "Class_210": "Water bodies",
//        "Class_220": "Permanent snow and ice",
//        "Class_230": "No data (burnt areas, clouds,…)"
//    };




