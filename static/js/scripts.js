var map;
var outlineKmlLayer;

var lc_mapType, elev_mapType;

var DEFAULT_CENTER = new google.maps.LatLng(18.5, 98);
var DEFAULT_ZOOM = 4
var MAX_ZOOM = 15

var infoWindow;

var iconFile = '/static/img/red_dot.png';


// The Drawing Manager for the Google Map.
var drawingManager;

// The Google Map feature for the currently drawn polygon or rectangle, if any.
var currentShape;

var year = 2015;


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

    //var myLatLng = new google.maps.LatLng(30, 86);
    
    var mapOptions = {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxZoom: MAX_ZOOM,
        streetViewControl: false
    };

    map = new google.maps.Map(
        document.getElementById('map'), mapOptions);
	
  map.overlayMapTypes.push(lc_mapType);
 
    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    map.data.setStyle({
        icon: iconFile
        // fillColor: 'green'
    });

    eventSlider();
	var yearSlider = document.getElementById('slider').addEventListener("change", eventSlider);

	$('.lcbox').change(getLegend);

    //listen for click events
    map.data.addListener('click', function (event) {
        //show an infowindow on click   
        infoWindow.setContent(event.feature.getProperty("popupContent"));

        infoWindow.setPosition(event.feature.getGeometry().get());
        //var anchor = new google.maps.MVCObject();
        //anchor.set("position", event.latLng);
        infoWindow.open(map);
    });
   

};


/**
* function to close info screen
* using the get started button
 */
var eventSlider = function() {

    year = $("#slider").val();
    
    var sliderValue = document.getElementById("slidervalue");
    slidervalue.innerHTML = year;
		
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

};

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

var getShapeArea = function (shape) {
    //Check if drawn shape is rectangle or polygon
    if (shape.type == google.maps.drawing.OverlayType.RECTANGLE) {
        var bounds = shape.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
        var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
        var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
        var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
        return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast]);

    }
    else {
        return google.maps.geometry.spherical.computeArea(shape.getPath().getArray());
    }

}

var getLegend = function() {

	legend = []
	$('.lcbox').each(function(){
		if (this.checked){
			//alert($(this).val());}
			legend.push(parseInt($(this).val(),10));}
			})
	
	var mylegend = JSON.stringify(legend)
	
	$.get('/updateLandCover', {'lc': mylegend}).done(function (data) {
		 if (data['error']) {
		alert("Oops, an error! Please refresh the page!")
    } else {
	
      var eeMapid = data["eeMapId"];
      var eeToken = data["eeToken"];

      refreshImage(eeMapid, eeToken);
    }
		})
};


/** Updates the image based on the current control panel config. */
function refreshImage(eeMapid, eeToken) {

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


function calculateSummary() {

    if (currentShape){

        var coords = getCoordinates(currentShape);

        console.log(coords);

        var polyCoords = '' + JSON.stringify(coords); //'' needed to force values to be treated as string
       
       
        var area = getShapeArea(currentShape);
        area_ha = Math.round(area / 10000);

        document.getElementById('btnWclim').disabled = true;
        document.getElementById('btnChirps').disabled = true;
        document.getElementById('btnLandcover').disabled = true;

        
        ComputeSummary(polyCoords);

        //Remove the current chart
        if (chart){
          chart.destroy();
        }

        ComputeWclim(polyCoords);
        ComputeChirps(polyCoords);                
        ComputeLandcover(polyCoords);
    }
    

}



function ComputeSummary(polyCoords) {

    
    $('#totalPop').hide();
    $('#totalArea').hide();
    $('#elevationRange').hide();

    $('#loading-indicator-1').show();
    $('#loading-indicator-2').show();
    $('#loading-indicator-3').show();
    


    $.get('/getstats', { 'param': polyCoords }).done(function (data) {

   
        minElev = data['minElev'];
        maxElev = data['maxElev'];
        pop = data['pop'];



        //console.log(minElev + ' - ' + maxElev);
        //console.log('population: ' + pop);

       
        $('#totalPop').show();
        $('#totalArea').show();
        $('#elevationRange').show();

        $('#loading-indicator-1').hide();
        $('#loading-indicator-2').hide();
        $('#loading-indicator-3').hide();

        document.getElementById('totalPop').innerHTML = numberWithCommas(pop);
        document.getElementById('totalArea').innerHTML = numberWithCommas(area_ha) + " ha";
        document.getElementById('elevationRange').innerHTML = numberWithCommas(minElev) + " - " + numberWithCommas(maxElev) + " m";
 

    });


}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function ComputeLandcover(polyCoords) {
    
    $.get('/getlandcover', { 'param': polyCoords }).done(function (data) {

        lcStats = data['lcStats'];

        lcClassList = lcStats[0];
        lcAreaList = lcStats[1];

        
        //createChartLandcover(lcClassList, lcAreaList);
        createChartLandcover();

        //console.log(lcClassList.join(", "));
        //console.log(lcAreaList.join(", "));

        document.getElementById('btnLandcover').disabled = false;

    });


}


function ComputeWclim(polyCoords) {

    $.get('/getwclim', { 'param': polyCoords }).done(function (data) {


        wclimTempList = data['tmpList'];
        wclimPPTList = data['pptList'];


        //createChartWclim(wclimTempList, wclimPPTList);
        createChartWclim();

        //console.log(wclimTempList.join(", "));
        //console.log(wclimPPTList.join(", "));

        document.getElementById('btnWclim').disabled = false;


    });

}


function ComputeChirps(polyCoords) {
    $.get('/getchirps', { 'param': polyCoords }).done(function (data) {

        chirpsDataList = data['chirpsDataList'];
        chirpsDateList = chirpsDataList[0];
        chirpsValueList = chirpsDataList[1];

        createChartChirps(chirpsDateList, chirpsValueList);
        
        document.getElementById('btnChirps').disabled = false;
        

    });

}


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




function loadInitialData () {

    var population= 14969;
    var minElev = 3962;
    var maxElev = 7343;
    var area = 38505;

    var animalOccurrence = 73;
    var plantOccurrence = 92;


    // Define the LatLng coordinates for the polygon.
    var initialPolyCoords = [
        { lat: 20.522886832325796, lng: 104.98529624938965 },
        { lat: 20.522886832325796, lng: 105.23798179626465 },
        { lat: 20.661636331915222, lng: 105.23798179626465 },
        { lat: 20.661636331915222, lng: 104.98529624938965 }
    ];

    currentShape = new google.maps.Polygon({ paths: initialPolyCoords});
    currentShape.setMap(map);


    chirpsDateList = [20150101, 20150106, 20150111, 20150116, 20150121, 20150126, 20150201, 20150206, 20150211, 20150216, 20150221, 20150226, 20150301, 20150306, 20150311, 20150316, 20150321, 20150326, 20150401, 20150406, 20150411, 20150416, 20150421, 20150426, 20150501, 20150506, 20150511, 20150516, 20150521, 20150526, 20150601, 20150606, 20150611, 20150616, 20150621, 20150626, 20150701, 20150706, 20150711, 20150716, 20150721, 20150726, 20150801, 20150806, 20150811, 20150816, 20150821, 20150826, 20150901, 20150906, 20150911, 20150916, 20150921, 20150926, 20151001, 20151006, 20151011, 20151016, 20151021, 20151026, 20151101, 20151106, 20151111, 20151116, 20151121, 20151126, 20151201, 20151206, 20151211, 20151216, 20151221, 20151226];
    chirpsValueList = [0]*72;

    wclimTempList = [0]*12;
    wclimPPTList = [0]*12;

    lcClassList = ["unknown","water","mangrove","tree (mixed evergreen/deciduous)","shrub","impervious surface","crop","tree (deciduous)","tree (evergreen: mixed broadleaf/needleleaf)","tree (evergreen: needleleaf)"];
    lcAreaList = [0,0,0,0,0,0,0,0,0,0]

    document.getElementById('totalPop').innerHTML = numberWithCommas(population);
    document.getElementById('totalArea').innerHTML = numberWithCommas(area) + " ha";
    document.getElementById('elevationRange').innerHTML = numberWithCommas(minElev) + " - " + numberWithCommas(maxElev) + " m";
  
    createChartWclim();


}


function startupApp() {

  
    //Added for drawing
    drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon', 'rectangle']
        }
    });


    drawingManager.setMap(map);

    // Add a listener for creating new shape event.
    google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {

        var newShape = event.overlay;
        newShape.type = event.type;

        setRectanglePolygon(newShape);
        if (drawingManager.getDrawingMode()) {
            drawingManager.setDrawingMode(null);
        }

    });

   
    // Create the DIV to hold the control and call the CustomControl() constructor passing in this DIV.
    var customControlDiv = document.createElement('div');
    var customControl = new CustomControl(customControlDiv, map);

    customControlDiv.index = 1;
    customControlDiv.style['padding-top'] = '5px';
    customControlDiv.style['padding-right'] = '5px';
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(customControlDiv);
    


    //for browsing and reading the kml file
    document.getElementById('fileOpen').addEventListener('change', fileOpenDialog, false);


    loadInitialData();
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
    saveKmlText.innerHTML = '<span><img src="./static/img/save.png" width="24px" height="24px"></img></span>';
    saveKmlUI.appendChild(saveKmlText);

    // Set CSS for the setCenter control border
    var loadKmlUI = document.createElement('div');
    loadKmlUI.id = 'loadKmlUI';
    loadKmlUI.title = 'Load KML polygon';
    controlDiv.appendChild(loadKmlUI);

    // Set CSS for the control interior
    var loadKmlText = document.createElement('div');
    loadKmlText.id = 'loadKmlText';
    loadKmlText.innerHTML = '<span><img src="./static/img/load.png" width="24px" height="24px"></img></span>';
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





