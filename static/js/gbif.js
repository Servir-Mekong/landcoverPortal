
var geojsonPoints;



function removeGeojsonFeatures() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
}

function ShowHideGbifLayer() {

    if (document.getElementById('gbifLayer').checked == true) {
        map.data.addGeoJson(geojsonPoints);

    
    }
    else {

        
        removeGeojsonFeatures();
       
    }

}

function GetOccurrenceFeatures(wktPolygon) {

    $('#gbif').hide();
    document.getElementById('gbifLayer').checked = false;


    removeGeojsonFeatures();

    //Remove all the features

    $.get("http://api.gbif.org/v1/occurrence/search", { "geometry": wktPolygon, "limit": 300 }).done(function (data) {
       

        console.log(data.count);

        if (data.results) {
            geojsonPoints = {};

            geojsonPoints.type = "FeatureCollection";
            geojsonPoints.features = [];

            for (var i in data.results) {
                var feature = {};
                feature.type = "Feature";
                feature.geometry = {};
                feature.geometry.type = "Point";
                feature.geometry.coordinates = [data.results[i].decimalLongitude, data.results[i].decimalLatitude];

                feature.properties = {};

                // Content for the popup
                feature.properties.name = data.results[i].key;

                feature.properties.popupContent = '';
                if (data.results[i].scientificName) {
                    feature.properties.popupContent = '<b>Species: </b>' + data.results[i].scientificName + '<br />';
                }
                //if (data.results[i].institutionCode) {
                //    feature.properties.popupContent += data.results[i].institutionCode + ' ';
                //}
                //if (data.results[i].catalogNumber) {
                //    feature.properties.popupContent += data.results[i].catalogNumber;
                //}
                //feature.properties.popupContent += '<br />';

                if (data.results[i].locality) {
                    feature.properties.popupContent += '<b>Locality: </b>' + data.results[i].locality;
                }
                feature.properties.popupContent += '<br />';

                //feature.properties.popupContent += '<a href="http://www.gbif.org/occurrence/' + data.results[i].key + '" target="_new">' + data.results[i].key + '</a>' + '<br />';
                feature.properties.popupContent += '<a href="http://www.gbif.org/occurrence/' + data.results[i].key + '" target="_new">' + 'More Info.' + '</a>' + '<br />';
                

                geojsonPoints.features.push(feature);
            }
            
            //console.log(geojsonPoints);

            var str = JSON.stringify(geojsonPoints, null, 2); // spacing level = 2

            console.log(str);

           // map.data.addGeoJson(geojsonPoints);

            //map.data.setStyle(function (feature) {
            //    return { icon: iconFile };
            //});


            $('#gbif').show();
        }

    });



}



geojsonPoints = {
    "type": "FeatureCollection",
    "features": [
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575206732,
              "popupContent": "<b>Species: </b>Koenigia nummularifolia (Meisn.) Mescek & Sojak<br /><b>Locality: </b>S slope of Goecha La.<br /><a href=\"http://www.gbif.org/occurrence/575206732\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18758,
                27.55972
              ]
          },
          "properties": {
              "name": 959409445,
              "popupContent": "<b>Species: </b>Grandala coelicolor Hodgson, 1843<br /><b>Locality: </b>Samiti Lake<br /><a href=\"http://www.gbif.org/occurrence/959409445\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 883502768,
              "popupContent": "<b>Species: </b>Alcis atrostipata Walker, 1862<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/883502768\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887434723,
              "popupContent": "<b>Species: </b>Sysstema aulotis Prout, 1927<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887434723\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 883508146,
              "popupContent": "<b>Species: </b>Apophyga sericea Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/883508146\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885081335,
              "popupContent": "<b>Species: </b>Electrophaes Prout, 1923<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885081335\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887362919,
              "popupContent": "<b>Species: </b>Pareustroma fissisignis Butler, 1880<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887362919\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887372670,
              "popupContent": "<b>Species: </b>Photoscotosia multilinea Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887372670\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887372498,
              "popupContent": "<b>Species: </b>Photoscotosia tonchignearia Oberthür, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887372498\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 886523289,
              "popupContent": "<b>Species: </b>Monocerotesa connexa Warren, 1901<br /><b>Locality: </b>- Kanchenjunga region<br /><a href=\"http://www.gbif.org/occurrence/886523289\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887368142,
              "popupContent": "<b>Species: </b>Perizoma variabilis Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887368142\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887403427,
              "popupContent": "<b>Species: </b>Rheumaptera Hübner, 1822<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887403427\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887372926,
              "popupContent": "<b>Species: </b>Photoscotosia dejuta Prout, 1937<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887372926\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415543877,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415543877\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887372519,
              "popupContent": "<b>Species: </b>Photoscotosia metachryseis Hampson, 1896<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887372519\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415505815,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415505815\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885366102,
              "popupContent": "<b>Species: </b>Eustroma inextricata Walker, 1866<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885366102\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.185,
                27.5225
              ]
          },
          "properties": {
              "name": 887357139,
              "popupContent": "<b>Species: </b>Opisthograptis tridentifera Moore, 1888<br /><b>Locality: </b>- Kanchenjunga region<br /><a href=\"http://www.gbif.org/occurrence/887357139\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 884402608,
              "popupContent": "<b>Species: </b>Deinotrichia Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/884402608\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885366074,
              "popupContent": "<b>Species: </b>Eustroma venipicta Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885366074\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 883520068,
              "popupContent": "<b>Species: </b>Chlororithra fea Butler, 1889<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/883520068\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 883524090,
              "popupContent": "<b>Species: </b>Comostolopsis Warren, 1902<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/883524090\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885081353,
              "popupContent": "<b>Species: </b>Electrophaes niveonotata Warren, 1901<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885081353\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887372994,
              "popupContent": "<b>Species: </b>Photoscotosia albapex Hampson, 1895<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887372994\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887368285,
              "popupContent": "<b>Species: </b>Perizoma lacteiguttata Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887368285\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.6
              ]
          },
          "properties": {
              "name": 887403449,
              "popupContent": "<b>Species: </b>Rheumaptera Hübner, 1822<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887403449\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885076495,
              "popupContent": "<b>Species: </b>Ecliptopera substituta Walker, 1866<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885076495\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885081214,
              "popupContent": "<b>Species: </b>Electrophaes aliena Butler, 1880<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885081214\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 886510507,
              "popupContent": "<b>Species: </b>Maxates Moore, 1887<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/886510507\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887372750,
              "popupContent": "<b>Species: </b>Photoscotosia indecora Prout, 1940<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887372750\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415543922,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415543922\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 883524077,
              "popupContent": "<b>Species: </b>Comibaena Hübner, 1823<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/883524077\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.185,
                27.5225
              ]
          },
          "properties": {
              "name": 887357161,
              "popupContent": "<b>Species: </b>Opisthograptis sulphurea Butler, 1880<br /><b>Locality: </b>- Kanchenjunga region<br /><a href=\"http://www.gbif.org/occurrence/887357161\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.6
              ]
          },
          "properties": {
              "name": 884845087,
              "popupContent": "<b>Species: </b>Docirava affinis Warren, 1894<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/884845087\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887358813,
              "popupContent": "<b>Species: </b>Osteosema pastor Butler, 1880<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887358813\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 885366086,
              "popupContent": "<b>Species: </b>Eustroma hampsoni Prout, 1958<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/885366086\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 886527129,
              "popupContent": "<b>Species: </b>Myrioblephara Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/886527129\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 887363086,
              "popupContent": "<b>Species: </b>Pachyodes Guenée, 1857<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887363086\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 883520163,
              "popupContent": "<b>Species: </b>Chrysocraspeda sanguinea Warren, 1896<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/883520163\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.6
              ]
          },
          "properties": {
              "name": 887375209,
              "popupContent": "<b>Species: </b>Piercia imbrata Guenée, 1858<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/887375209\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415505894,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415505894\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 886527423,
              "popupContent": "<b>Species: </b>Myrioblephara Warren, 1893<br /><b>Locality: </b>- Kanchenjunga<br /><a href=\"http://www.gbif.org/occurrence/886527423\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 1257639500,
              "popupContent": "<b>Species: </b>Pegaeophyton watsonii Al-Shehbaz<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/1257639500\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.03267,
                27.54467
              ]
          },
          "properties": {
              "name": 1140739332,
              "popupContent": "<b>Species: </b>Rhododendron lanatum Hook. fil.<br /><b>Locality: </b>E Nepal: Mechi Zone, Panchitar Distr, Thulo Bhanjyang - Khola Tar - Pademeu Kharka - Phedung Danda (Budipani Kharka).<br /><a href=\"http://www.gbif.org/occurrence/1140739332\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 574646328,
              "popupContent": "<b>Species: </b>Cratoneuron filicinum Spruce, 1867<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/574646328\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 574819043,
              "popupContent": "<b>Species: </b>Apomarsupella revoluta (Nees) R.M.Schust.<br /><b>Locality: </b>Foot of E Rathong Glacier above Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/574819043\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 912730321,
              "popupContent": "<b>Species: </b>Koenigia islandica L.<br /><b>Locality: </b>Prek Chhu valley above Lambi.<br /><a href=\"http://www.gbif.org/occurrence/912730321\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13333,
                27.53333
              ]
          },
          "properties": {
              "name": 1138306212,
              "popupContent": "<b>Species: </b>Didymodon leskeoides K. Saito, 1975<br /><b>Locality: </b>Near bridge below Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/1138306212\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.1875,
                27.5555
              ]
          },
          "properties": {
              "name": 1139747394,
              "popupContent": "<b>Species: </b>Barbula amplexifolia Jaeger, 1873<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/1139747394\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.55
              ]
          },
          "properties": {
              "name": 574971300,
              "popupContent": "<b>Species: </b>Pedicularis roylei subsp. roylei<br /><b>Locality: </b>Above Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/574971300\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.58333
              ]
          },
          "properties": {
              "name": 574979271,
              "popupContent": "<b>Species: </b>Marsupella alpina (Mass. & Carest.) H. Bern.<br /><b>Locality: </b>Between Chemathang and Gocha La<br /><a href=\"http://www.gbif.org/occurrence/574979271\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13333,
                27.53333
              ]
          },
          "properties": {
              "name": 1137746126,
              "popupContent": "<b>Species: </b>Anoectangium stracheyanum Mitten, 1859<br /><b>Locality: </b>Near bridge below Chaunrikhiang.<br /><a href=\"http://www.gbif.org/occurrence/1137746126\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.1875,
                27.5555
              ]
          },
          "properties": {
              "name": 1137859022,
              "popupContent": "<b>Species: </b>Bellibarbula recurva Zander, 1993<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/1137859022\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13333,
                27.53333
              ]
          },
          "properties": {
              "name": 1138394904,
              "popupContent": "<b>Species: </b>Didymodon anserinocapitatus Zander, 1993<br /><b>Locality: </b>Near bridge below Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/1138394904\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 574647799,
              "popupContent": "<b>Species: </b>Marsupella commutata (Limpr.) Bernet<br /><b>Locality: </b>Foot of E Rathong Glacier above Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/574647799\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 1228023862,
              "popupContent": "<b>Species: </b>Delongia Young, 1952<br /><b>Locality: </b>Between Chemathang and Gocha La<br /><a href=\"http://www.gbif.org/occurrence/1228023862\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 574656990,
              "popupContent": "<b>Species: </b>Juncus allioides Franch.<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glaciers.<br /><a href=\"http://www.gbif.org/occurrence/574656990\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575044811,
              "popupContent": "<b>Species: </b>Meconopsis horridula Hook. f. & Thomson<br /><b>Locality: </b>Samiti Lake (Bungmoteng chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575044811\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575074130,
              "popupContent": "<b>Species: </b>Entodontaceae<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575074130\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.55
              ]
          },
          "properties": {
              "name": 575345737,
              "popupContent": "<b>Species: </b>Cortiella cortioides (C. Norman) M.F. Watson<br /><b>Locality: </b>Above Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/575345737\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19,
                27.56
              ]
          },
          "properties": {
              "name": 1086043818,
              "popupContent": "<b>Species: </b>Elymus nutans Griseb.<br /><br /><a href=\"http://www.gbif.org/occurrence/1086043818\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.22,
                27.55
              ]
          },
          "properties": {
              "name": 1086044010,
              "popupContent": "<b>Species: </b>Isachne albens Trin.<br /><br /><a href=\"http://www.gbif.org/occurrence/1086044010\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 574822786,
              "popupContent": "<b>Species: </b>Ditrichum gracile Kuntze, 1891<br /><b>Locality: </b>Samoto Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/574822786\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575001261,
              "popupContent": "<b>Species: </b>Primula muscoides Hook. fil. ex Watt<br /><b>Locality: </b>S slope of Goecha La.<br /><a href=\"http://www.gbif.org/occurrence/575001261\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 1137889818,
              "popupContent": "<b>Species: </b>Molendoa warburgii Zander, 1993<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang<br /><a href=\"http://www.gbif.org/occurrence/1137889818\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.1875,
                27.5555
              ]
          },
          "properties": {
              "name": 1139340895,
              "popupContent": "<b>Species: </b>Didymodon nigrescens K. Saito, 1975<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/1139340895\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 574905062,
              "popupContent": "<b>Species: </b>Meconopsis sinuata Prain<br /><b>Locality: </b>Prek Chhu valley between Samiti and Thangshing.<br /><a href=\"http://www.gbif.org/occurrence/574905062\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 574927271,
              "popupContent": "<b>Species: </b>Hymenostylium recurvirostrum (Hedw.) Dix.<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang<br /><a href=\"http://www.gbif.org/occurrence/574927271\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 574928961,
              "popupContent": "<b>Species: </b>Apomarsupella revoluta (Nees) R.M.Schust.<br /><b>Locality: </b>Between Chemathang and Gocha La<br /><a href=\"http://www.gbif.org/occurrence/574928961\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.56667
              ]
          },
          "properties": {
              "name": 575028197,
              "popupContent": "<b>Species: </b>Plagiochila (Dumort.) Dumort.<br /><b>Locality: </b>Ridge on E side of Lower Onglakthang Glacier, N of Samiti Lake<br /><a href=\"http://www.gbif.org/occurrence/575028197\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 575068616,
              "popupContent": "<b>Species: </b>Molendoa warburgii Zander, 1993<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang<br /><a href=\"http://www.gbif.org/occurrence/575068616\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575158918,
              "popupContent": "<b>Species: </b>Barbula amplexifolia Jaeger, 1873<br /><b>Locality: </b>Samti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575158918\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 890158943,
              "popupContent": "<b>Species: </b>Haplomitrium hookeri (Lyell ex Sm.) Nees<br /><b>Locality: </b>Foot of E Rathong Glacier above Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/890158943\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575208170,
              "popupContent": "<b>Species: </b>Didymodon nigrescens K. Saito, 1975<br /><b>Locality: </b>Samiti lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575208170\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 575028088,
              "popupContent": "<b>Species: </b>Didymodon asperifolius H. Crum, Steere & L. E. Anderson, 1964<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang<br /><a href=\"http://www.gbif.org/occurrence/575028088\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575106709,
              "popupContent": "<b>Species: </b>Primula tenuiloba (Watt) Pax<br /><b>Locality: </b>Goecha La, summit.<br /><a href=\"http://www.gbif.org/occurrence/575106709\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575204326,
              "popupContent": "<b>Species: </b>Didymodon ferrugineus M. O. Hill, 1981<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575204326\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 575220674,
              "popupContent": "<b>Species: </b>Meconopsis discigera Prain<br /><b>Locality: </b>East Side of East Rathong Glacier, N of Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/575220674\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.58333
              ]
          },
          "properties": {
              "name": 575276555,
              "popupContent": "<b>Species: </b>Meconopsis grandis Prain<br /><b>Locality: </b>Between Chamathang and Goecha La<br /><a href=\"http://www.gbif.org/occurrence/575276555\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 912730229,
              "popupContent": "<b>Species: </b>Koenigia nepalensis D. Don<br /><b>Locality: </b>Prek Chhu valley above Lambi.<br /><a href=\"http://www.gbif.org/occurrence/912730229\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575153965,
              "popupContent": "<b>Species: </b>Aneura crateriformis Furuki & D.G.Long<br /><b>Locality: </b>West District: Samiti lake (Bungmoteng Chho), foor of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575153965\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 575271419,
              "popupContent": "<b>Species: </b>Lasiocaryum munroi (C.B. Clarke) I.M. Johnst.<br /><b>Locality: </b>East side of East Rathong Glacier N of Chaunrikhiang.<br /><a href=\"http://www.gbif.org/occurrence/575271419\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 890168049,
              "popupContent": "<b>Species: </b>Lophozia decolorans (Limpr.) Steph.<br /><b>Locality: </b>Foot of E Rathong Glacier above Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/890168049\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19,
                27.56
              ]
          },
          "properties": {
              "name": 912677520,
              "popupContent": "<b>Species: </b>Juncus glaucoturgidus Noltie<br /><b>Locality: </b>Sikkim West District: Samiti Lake (Bungmoteng Chho)<br /><a href=\"http://www.gbif.org/occurrence/912677520\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13333,
                27.53333
              ]
          },
          "properties": {
              "name": 575066421,
              "popupContent": "<b>Species: </b>Didymodon leskeoides K. Saito, 1975<br /><b>Locality: </b>Near bridge below Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/575066421\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 1140000421,
              "popupContent": "<b>Species: </b>Didymodon asperifolius H. Crum, Steere & L. E. Anderson, 1964<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang.<br /><a href=\"http://www.gbif.org/occurrence/1140000421\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575001289,
              "popupContent": "<b>Species: </b>Prasanthus suecicus (Gottsche) Lindb.<br /><b>Locality: </b>Between Chemathang and Gocha La<br /><a href=\"http://www.gbif.org/occurrence/575001289\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 723620684,
              "popupContent": "<b>Species: </b>Racomitrium Brid.<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/723620684\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575104967,
              "popupContent": "<b>Species: </b>Juncus glaucoturgidus Noltie<br /><b>Locality: </b>West District: Samiti Lake (Bungmoteng Chho)<br /><a href=\"http://www.gbif.org/occurrence/575104967\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 575268209,
              "popupContent": "<b>Species: </b>Herbertus delavayi Stephani<br /><b>Locality: </b>Foot of E Rathong Glacier above Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/575268209\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.1875,
                27.5555
              ]
          },
          "properties": {
              "name": 1138467683,
              "popupContent": "<b>Species: </b>Didymodon ferrugineus M. O. Hill, 1981<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/1138467683\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 723603424,
              "popupContent": "<b>Species: </b>Racomitrium Brid.<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/723603424\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575220042,
              "popupContent": "<b>Species: </b>Pegaeophyton nepalense Al-Shehbaz, Arai & H. Ohba<br /><b>Locality: </b>Near Goecha La.<br /><a href=\"http://www.gbif.org/occurrence/575220042\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 1138377943,
              "popupContent": "<b>Species: </b>Hymenostylium recurvirostrum (Hedw.) Dix.<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang<br /><a href=\"http://www.gbif.org/occurrence/1138377943\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13333,
                27.53333
              ]
          },
          "properties": {
              "name": 575342287,
              "popupContent": "<b>Species: </b>Didymodon anserinocapitatus Zander, 1993<br /><b>Locality: </b>Near bridge below Charunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/575342287\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.53333
              ]
          },
          "properties": {
              "name": 575197933,
              "popupContent": "<b>Species: </b>Flowersia sinensis Griffin & W. R. Buck, 1989<br /><b>Locality: </b>Prek Chhu valley between Thangshing and Onglakthang<br /><a href=\"http://www.gbif.org/occurrence/575197933\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13333,
                27.53333
              ]
          },
          "properties": {
              "name": 890170430,
              "popupContent": "<b>Species: </b>Asterella leptophylla (Mont.) Grolle<br /><b>Locality: </b>Near bridge below Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/890170430\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 1138764350,
              "popupContent": "<b>Species: </b>Tortella fragilis Limpricht, 1888<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/1138764350\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 724014133,
              "popupContent": "<b>Species: </b>Racomitrium Brid.<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/724014133\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 543292260,
              "popupContent": "<b>Species: </b>Juncus glaucoturgidus Noltie<br /><b>Locality: </b>Sikkim. West District: Samiti Lake (Bungmoteng Chho)<br /><a href=\"http://www.gbif.org/occurrence/543292260\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 575001212,
              "popupContent": "<b>Species: </b>Entodontaceae<br /><b>Locality: </b>Samithi Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575001212\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.55
              ]
          },
          "properties": {
              "name": 575057213,
              "popupContent": "<b>Species: </b>Juniperus indica Bertol.<br /><b>Locality: </b>West District, above Samiti Lake (Bungmoteng Chho) foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/575057213\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.56667
              ]
          },
          "properties": {
              "name": 890157706,
              "popupContent": "<b>Species: </b>Aneura crateriformis Furuki & D.G.Long<br /><b>Locality: </b>Moraine ridge S of Chemathang, E side of Onglakthang Glacier,<br /><a href=\"http://www.gbif.org/occurrence/890157706\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.1875,
                27.5555
              ]
          },
          "properties": {
              "name": 1137792085,
              "popupContent": "<b>Species: </b>Didymodon nigrescens K. Saito, 1975<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier.<br /><a href=\"http://www.gbif.org/occurrence/1137792085\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.19028,
                27.55917
              ]
          },
          "properties": {
              "name": 574872242,
              "popupContent": "<b>Species: </b>Pegaeophyton watsonii Al-Shehbaz<br /><b>Locality: </b>Samiti Lake (Bungmoteng Chho), foot of Onglakthang Glacier<br /><a href=\"http://www.gbif.org/occurrence/574872242\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 575012822,
              "popupContent": "<b>Species: </b>Lloydia delicatula Noltie<br /><b>Locality: </b>Chaunrikhiang, below East Rathong Glacier.<br /><a href=\"http://www.gbif.org/occurrence/575012822\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.11667,
                27.55
              ]
          },
          "properties": {
              "name": 575058180,
              "popupContent": "<b>Species: </b>Ditrichum brevidens Noguchi, 1944<br /><b>Locality: </b>Foot of E Rathong Glacier above Chaunrikhiang<br /><a href=\"http://www.gbif.org/occurrence/575058180\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88,
                27.58333
              ]
          },
          "properties": {
              "name": 574696339,
              "popupContent": "<b>Species: </b>Voitia nivalis Hornschuch, 1818<br /><br /><a href=\"http://www.gbif.org/occurrence/574696339\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88,
                27.58333
              ]
          },
          "properties": {
              "name": 575059335,
              "popupContent": "<b>Species: </b>Ditrichum gracile Kuntze, 1891<br /><b>Locality: </b>Yalung valley between Lapsang and Ramze<br /><a href=\"http://www.gbif.org/occurrence/575059335\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88,
                27.58333
              ]
          },
          "properties": {
              "name": 574936565,
              "popupContent": "<b>Species: </b>Bryum argenteum Hedwig, 1801<br /><b>Locality: </b>Yalung valley between Lapsang and Ramze<br /><a href=\"http://www.gbif.org/occurrence/574936565\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575014719,
              "popupContent": "<b>Species: </b>Meconopsis discigera Prain<br /><b>Locality: </b>Guicha La [Goecha La 27°36'N 88°11'E]<br /><a href=\"http://www.gbif.org/occurrence/575014719\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575291078,
              "popupContent": "<b>Species: </b>Meconopsis discigera Prain<br /><b>Locality: </b>Under Guicha La [Goecha La 27°36'N 88°11'E]<br /><a href=\"http://www.gbif.org/occurrence/575291078\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615276338,
              "popupContent": "<b>Species: </b>Aster L.<br /><b>Locality: </b>Chateng; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615276338\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.6
              ]
          },
          "properties": {
              "name": 615387296,
              "popupContent": "<b>Species: </b>Rhodiola cretinii (Raym.-Hamet) H. Ohba<br /><b>Locality: </b>Guche P.; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615387296\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575056573,
              "popupContent": "<b>Species: </b>Meconopsis discigera Prain<br /><b>Locality: </b>Guicha La [Goecha La 27°36'N 88°11'E]<br /><a href=\"http://www.gbif.org/occurrence/575056573\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.55
              ]
          },
          "properties": {
              "name": 615276381,
              "popupContent": "<b>Species: </b>Aster stracheyi Hook.f.<br /><b>Locality: </b>Alookthang; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615276381\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18333,
                27.6
              ]
          },
          "properties": {
              "name": 575120282,
              "popupContent": "<b>Species: </b>Meconopsis discigera Prain<br /><b>Locality: </b>Guicha La [Goecha La]<br /><a href=\"http://www.gbif.org/occurrence/575120282\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13662,
                27.55617
              ]
          },
          "properties": {
              "name": 1400222250,
              "popupContent": "<b>Species: </b>Prunella strophiata (Blyth, 1843)<br /><b>Locality: </b>Dzongri camp<br /><a href=\"http://www.gbif.org/occurrence/1400222250\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13662,
                27.55617
              ]
          },
          "properties": {
              "name": 1400222243,
              "popupContent": "<b>Species: </b>Turdus albocinctus Royle, 1840<br /><b>Locality: </b>Dzongri camp<br /><a href=\"http://www.gbif.org/occurrence/1400222243\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13662,
                27.55617
              ]
          },
          "properties": {
              "name": 1400222253,
              "popupContent": "<b>Species: </b>Milvus migrans (Boddaert, 1783)<br /><b>Locality: </b>Dzongri camp<br /><a href=\"http://www.gbif.org/occurrence/1400222253\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.13662,
                27.55617
              ]
          },
          "properties": {
              "name": 1400222203,
              "popupContent": "<b>Species: </b>Columba leuconota Vigors, 1831<br /><b>Locality: </b>Dzongri camp<br /><a href=\"http://www.gbif.org/occurrence/1400222203\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615397010,
              "popupContent": "<b>Species: </b>Saussurea tridactyla Sch.Bip. ex Hook.f.<br /><b>Locality: </b>Chemathang; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615397010\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539447,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539447\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615352951,
              "popupContent": "<b>Species: </b>Lonicera cyanocarpa Franch.<br /><b>Locality: </b>Chemathang - Thangshing; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615352951\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539442,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539442\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.6
              ]
          },
          "properties": {
              "name": 615268982,
              "popupContent": "<b>Species: </b>Arenaria polytrichoides Edgew. ex Edgew. & Hook. fil.<br /><b>Locality: </b>Guiche La; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615268982\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539438,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539438\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415529831,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415529831\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538126,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538126\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538510,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538510\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539427,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539427\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615347211,
              "popupContent": "<b>Species: </b>Leontopodium jacotianum Beauverd<br /><b>Locality: </b>Chemathang ; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615347211\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538046,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538046\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.6
              ]
          },
          "properties": {
              "name": 615387292,
              "popupContent": "<b>Species: </b>Rhodiola cretinii (Raym.-Hamet) H. Ohba<br /><b>Locality: </b>Guiche P.; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615387292\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.55
              ]
          },
          "properties": {
              "name": 615397003,
              "popupContent": "<b>Species: </b>Saussurea tridactyla Sch.Bip. ex Hook.f.<br /><b>Locality: </b>Alookthang; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615397003\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539466,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539466\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538116,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538116\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415531061,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415531061\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538125,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538125\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539432,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539432\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.6
              ]
          },
          "properties": {
              "name": 615396902,
              "popupContent": "<b>Species: </b>Saussurea tridactyla Sch.Bip. ex Hook.f.<br /><b>Locality: </b>Guiche La; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615396902\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.6
              ]
          },
          "properties": {
              "name": 615397005,
              "popupContent": "<b>Species: </b>Saussurea tridactyla Sch.Bip. ex Hook.f.<br /><b>Locality: </b>Guicha P.; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615397005\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.6
              ]
          },
          "properties": {
              "name": 1415539574,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539574\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615347193,
              "popupContent": "<b>Species: </b>Leontopodium himalayanum DC.<br /><b>Locality: </b>Chemathang , Onglakthang Gl. E; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615347193\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538209,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538209\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615268336,
              "popupContent": "<b>Species: </b>Arenaria ciliolata Edgew. & Hook. fil.<br /><b>Locality: </b>Chemathang; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615268336\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.55
              ]
          },
          "properties": {
              "name": 615276036,
              "popupContent": "<b>Species: </b>Aster heliopsis Grierson<br /><b>Locality: </b>Alukthang; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615276036\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615347194,
              "popupContent": "<b>Species: </b>Leontopodium himalayanum DC.<br /><b>Locality: </b>Chemathang - Gocha La; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615347194\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415530539,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415530539\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.6
              ]
          },
          "properties": {
              "name": 1415539618,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539618\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.12,
                27.55
              ]
          },
          "properties": {
              "name": 615397013,
              "popupContent": "<b>Species: </b>Saussurea tridactyla Sch.Bip. ex Hook.f.<br /><b>Locality: </b>East Rathong Gl.; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615397013\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538114,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538114\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615354077,
              "popupContent": "<b>Species: </b>Lonicera syringantha Maxim.<br /><b>Locality: </b>Chemathang - Thangshing; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615354077\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539448,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539448\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.58
              ]
          },
          "properties": {
              "name": 615354096,
              "popupContent": "<b>Species: </b>Lonicera spinosa (Jacquem. ex Decne.) Walp.<br /><b>Locality: </b>Chamathang - Thangshing; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615354096\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.10348,
                27.60113
              ]
          },
          "properties": {
              "name": 865709723,
              "popupContent": "<b>Species: </b>Ailurus fulgens F. G. Cuvier, 1825<br /><b>Locality: </b>Frontière du Sikkim (Est)<br /><a href=\"http://www.gbif.org/occurrence/865709723\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.55
              ]
          },
          "properties": {
              "name": 615397012,
              "popupContent": "<b>Species: </b>Saussurea tridactyla Sch.Bip. ex Hook.f.<br /><b>Locality: </b>Samiti Lake; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615397012\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415538056,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415538056\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539460,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539460\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539405,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539405\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539415,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539415\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539435,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539435\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415530486,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415530486\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.18,
                27.6
              ]
          },
          "properties": {
              "name": 615347147,
              "popupContent": "<b>Species: </b>Leontopodium himalayanum DC.<br /><b>Locality: </b>Gocha La ; Sikkim<br /><a href=\"http://www.gbif.org/occurrence/615347147\" target=\"_new\">More Info.</a><br />"
          }
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                88.2,
                27.65
              ]
          },
          "properties": {
              "name": 1415539456,
              "popupContent": "<b>Species: </b>Lepidoptera<br /><br /><a href=\"http://www.gbif.org/occurrence/1415539456\" target=\"_new\">More Info.</a><br />"
          }
      }
    ]
};

