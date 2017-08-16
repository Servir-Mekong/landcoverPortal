var map;
var outlineKmlLayer;

var lc_mapType, elev_mapType;

var DEFAULT_CENTER = new google.maps.LatLng(18.5, 98);
var DEFAULT_ZOOM = 4
var MAX_ZOOM = 15

var infoWindow;

var iconFile = '/static/img/red_dot.png';

var CSS_COLOR_NAMES = ["Black","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

google.load("visualization", "1", {packages:["corechart"]});


// The Drawing Manager for the Google Map.
var drawingManager;

// The Google Map feature for the currently drawn polygon or rectangle, if any.
var currentShape;

var year = 2015;

var mapCounter = 0

// Initialize the Google Map and add our custom layer overlay.
var initialize = function (mapId, token) {
    // The Google Maps API calls getTileUrl() when it tries to display a map
    // tile.  This is a good place to swap in the MapID and token we got from
    // the Python script. The other values describe other properties of the
    // custom map type.

    var eeMapOptions = {
        getTileUrl: function (tile, zoom) {
            var baseUrl = 'https://earthengine.googleapis.com/map';
            var url = [baseUrl, mapId, zoom, tile.x, tile.y].join('/');
            url += '?token=' + token;
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
		name: 'Land cover',
		opacity: 1.0
  };


    // Create the map type.
    lc_mapType = new google.maps.ImageMapType(eeMapOptions);

	// do not show the download buttons
	hideButtons();

    //var myLatLng = new google.maps.LatLng(30, 86);
    var mapOptions = {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxZoom: MAX_ZOOM,
        streetViewControl: false,
        gestureHandling: 'greedy'
    };

    map = new google.maps.Map(
        document.getElementById('map'), mapOptions);

  //  map.overlayMapTypes.push(lc_mapType);

    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    map.data.setStyle({
        icon: iconFile
        // fillColor: 'green'
    });

	// Check all boxes
	$(".lcbox").prop("checked", true);
	$(".Myanmarbox").prop("checked", true);

	// update the legend
	//updateLegend();

	// add handlers to buttons
	$('.mybox').change(updatePrimitives);
	$('.lcbox').change(updateLegend);
	$('.Myanmarbox').change(updateMyanmar);

    //eventSliderPrimitives();
    eventSliderLuse();

	var yearSlider = document.getElementById('slider').addEventListener("change", eventSliderLuse);
	var yearSliderPrimitive = document.getElementById('primitiveslider').addEventListener("change", eventSliderPrimitives);
	var yearSliderMyanmar = document.getElementById('Myanmarslider').addEventListener("change", eventSliderMyanmar);
};


/**
* function to close info screen
* using the get started button
 */
var eventSliderLuse = function() {

    year = $("#slider").val();

    var sliderValue = document.getElementById("slidervalue");
    slidervalue.innerHTML = year;

    updateLegend();

}

/**
* function to close info screen
* using the get started button
 */
var eventSliderMyanmar = function() {

    year = $("#Myanmarslider").val();

    var Myanmarvalue = document.getElementById("Myanmarvalue");
    Myanmarvalue.innerHTML = year;

    updateMyanmar();

}


/**
* function to close info screen
* using the get started button
 */
var eventSliderPrimitives = function() {


    year = $("#primitiveslider").val();

    var primitiveValue = document.getElementById("primitivevalue");
    primitiveValue.innerHTML = year;

    updatePrimitives();

}




function ShowHideKmlLayer() {

    if (document.getElementById('outlineLayer').checked == true) {

        outlineKmlLayer.setMap(map);

    }
    else {

        outlineKmlLayer.setMap(null);
    }


}



// Clears the current polygon and cancels any outstanding analysis.
var clearPolygon = function () {
    if (currentShape) {
        currentShape.setMap(null);
        currentShape = undefined;
    }
};

// Sets the current polygon and kicks off an EE analysis.
var setRectanglePolygon = function (newShape) {
    clearPolygon();
    currentShape = newShape;


	showButtons()



};


var showButtons = function () {

	if (mapCounter == 1){
		var showlink = document.getElementById("DownloadLinkLuse1")
		showlink.style.display = 'block';
		var DownloadButton = document.getElementById('DownloadLinkLuse1').addEventListener("click", exportMapLuse);
	}

	if (mapCounter == 2){
		var showlink = document.getElementById("DownloadLinkPrimi1")
		showlink.style.display = 'block';
		var DownloadButton = document.getElementById('DownloadLinkPrimi1').addEventListener("click", exportMapPrimitives);
	}

}

var showDownloadButtons = function () {

	if (mapCounter == 1){
		var showlink = document.getElementById("DownloadLinkLuse1")
		showlink.style.display = 'block';
		var DownloadButton = document.getElementById('DownloadLinkLuse1').addEventListener("click", exportMap1);
	}

	if (mapCounter == 2){
		var showlink = document.getElementById("DownloadLinkPrimi1")
		showlink.style.display = 'block';
		var DownloadButton = document.getElementById('DownloadlinkPrimi1').addEventListener("click", exportMap2);
	}

}


var hideButtons = function (){
	var showlink1 = document.getElementById("DownloadLinkLuse1")
	showlink1.style.display = 'none';

    var showlink2 = document.getElementById("DownloadLinkPrimi1")
	showlink2.style.display = 'none';

	var showlink3 = document.getElementById("DownloadLinkLuse2")
	showlink3.style.display = 'none';

    var showlink4 = document.getElementById("DownloadLinkPrimi2")
	showlink4.style.display = 'none';

}

// Extract an array of coordinates for the given polygon.
var getCoordinates = function (shape) {
    //Check if drawn shape is rectangle or polygon
    if (shape.type == google.maps.drawing.OverlayType.RECTANGLE) {
        var bounds = shape.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var xmin = sw.lng();
        var ymin = sw.lat();
        var xmax = ne.lng();
        var ymax = ne.lat();


        return [[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax]];

    }
    else {
        var points = shape.getPath().getArray();
        return points.map(function (point) {
            return [point.lng(), point.lat()];
        });
    }
};


/** Updates the image based on the current control panel config. */
function refreshImage(eeMapid, eeToken) {

    hideButtons();
    clearPolygon();

	var eeMapOptions = {
        getTileUrl: function (tile, zoom) {
            var baseUrl = 'https://earthengine.googleapis.com/map';
            var url = [baseUrl, eeMapid, zoom, tile.x, tile.y].join('/');
            url += '?token=' + eeToken;
           return url;
        },
        tileSize: new google.maps.Size(256, 256),
		name: 'Land cover',
		opacity: 1.0
  };


    mapType = new google.maps.ImageMapType(eeMapOptions);
    map.overlayMapTypes.clear();
    map.overlayMapTypes.push(mapType);

};




var shapeToWKT = function (shape) {

    var coords = getCoordinates(shape);


    // Start the Polygon Well Known Text (WKT) expression
    var wkt = "POLYGON((";

    for (var i = 0; i < coords.length; i++) {
        wkt += coords[i][0].toString() + " " + coords[i][1].toString() + ",";
    }

    wkt += coords[0][0].toString() + " " + coords[0][1].toString();

    wkt = wkt + "))";

    return wkt;


}



function startupApp() {


    //Added for drawing
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker','polygon', 'rectangle']
        }
    });


    drawingManager.setMap(map);



    // Create the DIV to hold the control and call the CustomControl() constructor passing in this DIV.
    var customControlDiv = document.createElement('div');
    var customControl = new CustomControl(customControlDiv, map);

    customControlDiv.index = 1;
    customControlDiv.style['padding-top'] = '5px';
    customControlDiv.style['padding-right'] = '5px';

      // Add a listener for creating new shape event.
    google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {

        var newShape = event.overlay;
        newShape.type = event.type;

        var mode = drawingManager.getDrawingMode();

        if (mode == "marker"){

			if (mapCounter == 3){
				getPrimitives(newShape);
			}

			}

		else{

			setRectanglePolygon(newShape);
			if (drawingManager.getDrawingMode()) {
				drawingManager.setDrawingMode(null);
			}
		}

    });


    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(customControlDiv);

    //for browsing and reading the kml file
    document.getElementById('fileOpen').addEventListener('change', fileOpenDialog, false);

}


// To add control with save and load KML buttons to the google map

function CustomControl(controlDiv, map) {


    // Set CSS for the control border
    var saveKmlUI = document.createElement('div');
    saveKmlUI.id = 'saveKmlUI';
    saveKmlUI.title = 'Save polygon as KML';
    controlDiv.appendChild(saveKmlUI);

    // Set CSS for the control interior
    var saveKmlText = document.createElement('div');
    saveKmlText.id = 'saveKmlText';
    //saveKmlText.innerHTML = '  S  ';
    saveKmlText.innerHTML = '<span><img src="/static/img/save.png" width="24px" height="24px"></img></span>';
    saveKmlUI.appendChild(saveKmlText);

    // Set CSS for the setCenter control border
    var loadKmlUI = document.createElement('div');
    loadKmlUI.id = 'loadKmlUI';
    loadKmlUI.title = 'Load KML polygon';
    controlDiv.appendChild(loadKmlUI);

    // Set CSS for the control interior
    var loadKmlText = document.createElement('div');
    loadKmlText.id = 'loadKmlText';
    loadKmlText.innerHTML = '<span><img src="/static/img/load.png" width="24px" height="24px"></img></span>';
    loadKmlUI.appendChild(loadKmlText);


    // Setup the click event listeners
    google.maps.event.addDomListener(saveKmlUI, 'click', function () {
        //alert('Save control clicked');

        saveKMLFile();
    });

    google.maps.event.addDomListener(loadKmlUI, 'click', function () {
        //alert('Load control clicked');
        $('#fileOpen').click();
    });
}



var updateLegend = function() {

    mapCounter = 1;

	legend = []
	$('.lcbox').each(function(){
		if (this.checked){

			legend.push(parseInt($(this).val(),10));}
			})

	var mylegend = JSON.stringify(legend)

	$.get('/updateLandCover', {'lc': mylegend, "year":year}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {

      var eeMapid = data["eeMapId"];
      var eeToken = data["eeToken"];

      refreshImage(eeMapid, eeToken);
    }
		})
};

var getPrimitives = function(point) {
	var lat = point.getPosition().lat();
	var lon = point.getPosition().lng();

	console.log(lat,lon);

	$.get('/GetPrimitiveValues', {'lat':  JSON.stringify(lat), 'lon':  JSON.stringify(lon)}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {

      showChart(data);
    }
		})


}



var updatePrimitives = function() {

    mapCounter = 2;


	$('.mybox').each(function(){
		if (this.checked){
			legend = parseInt($(this).val(),10);}
			})


	if (legend.length == 0){
		legend = [1];

		}

	var mylegend = JSON.stringify(legend)

	$.get('/updatePrimitives', {'lc': mylegend, "year":year}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {

      var eeMapid = data["eeMapId"];
      var eeToken = data["eeToken"];

      refreshImage(eeMapid, eeToken);
    }
		})

};


var updateMyanmar = function() {

    mapCounter = 3;

	legend = [];
	$('.Myanmarbox').each(function(){
		if (this.checked){
			legend.push(parseInt($(this).val(),10));}
			})


	if (legend.length == 0){
		legend = [1];

		}



	var mylegend = JSON.stringify(legend)

	$.get('/updateMyanmar', {'lc': mylegend, "year":year}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {

      var eeMapid = data["eeMapId"];
      var eeToken = data["eeToken"];

      refreshImage(eeMapid, eeToken);
    }
		})

};



// ---------------------------------------------------------------------------------- //
// export function
// ---------------------------------------------------------------------------------- //

/**
* function to close info screen
* using the get started button
 */
var exportMapLuse = function() {

	var coords = getCoordinates(currentShape);

	$.get('/downloadMapLuse', {'coords' : JSON.stringify(coords), 'year' : year}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {

      hideButtons();

      var downloadLink = document.getElementById("DownloadLinkLuse2")
	  downloadLink.style.display = 'block';
	  downloadLink.setAttribute("href",data);

    }
		})

}

/**
* function to close info screen
* using the get started button
 */
var exportMapPrimitives = function() {

	var coords = getCoordinates(currentShape);


	$('.mybox').each(function(){
		if (this.checked){
			legend = parseInt($(this).val(),10);}
			})

	$.get('/downloadMapPrimitives', {'lc': legend, 'coords' : JSON.stringify(coords), 'year' : year}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {

      hideButtons();

      var downloadLink = document.getElementById("DownloadLinkPrimi2")
	  downloadLink.style.display = 'block';
	  downloadLink.setAttribute("href",data);

    }
		})

}

/**
 * Shows a chart with the given timeseries.
 * @param {Array<Array<number>>} timeseries The timeseries data
 *     to plot in the chart.
 */

var showChart = function(timeseries) {

   clearChart();

	datarr = [];

	var newSeries = timeseries[0].map(function(col, i) {
	  return timeseries.map(function(row) {
		return row[i]
	  })
	});

	newSeries.forEach(function(point) {
		point[0] = new Date(parseInt(point[0], 10));
		datarr.push(point);
		});


   var myName = ["Cropland","Otherwoodedland","Grassland","Settlement","Other","Closed_forest","Surface_Water","Open_forest","Wetlands","Mangrove","Snow_and_Ice"]

 // Create the data table.
   var data = new google.visualization.DataTable();

   data.addColumn('date')

    counter = 0;
    myName.forEach(function(item) {
		data.addColumn('number',item)
	});


  data.addRows(datarr);

  var wrapper = createWrapper(500,200,data);

  $('#chart').show();
  var chartEl = $('#chart').get(0);
  wrapper.setContainerId(chartEl);
  wrapper.draw();


};

/**
 * Create the wrapper for the chart
 */
var createWrapper = function(w,h,data){

  var wrapper = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    dataTable: data,
    options: {
	  width: w,
	  height: h,
      title: 'Primivitives',
      curveType: 'function',
      legend: {position: 'right'},
      titleTextStyle: {fontName: 'Roboto'},
      chartArea: {width: '40%'},
      colors: CSS_COLOR_NAMES,
      vAxis: { format:'0.00'},

	vAxis: {
       viewWindowMode:'explicit',
       viewWindow: {
           max:100,
           min:0
            }
        }
     }
  });

  return wrapper;
}

/**
* Clear polygons from the map when changing from country to province
**/
var clearChart = function(){

	// clear colored polygons
	map.data.revertStyle();

	$('#chart').empty();
	$('#chart').hide();

}
