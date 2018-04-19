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