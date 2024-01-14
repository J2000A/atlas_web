/*************************************************
 * map.js                                        *
 * Script file setting up and displaying the map *
 * Author: Héctor Ochoa Ortiz                    *
 * Affil.: TUM SVP                               *
 * Last update: 2023-05-03                       *
 *************************************************/


// Create map
const map = L.map('map').setView([48.14, 11.57], 11);

// Add background layer
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);

// Add selector and button
const map_type = document.querySelector('#map_type');
const justice = document.querySelector('#justice');
const v1 = document.querySelector('#v1');
const amenity = document.querySelector('#amenity');
const mot = document.querySelector('#mot');

// Map layers
var polygonLayer;
var poiLayer;
var stopsCircleLayer;
var stopsAreaLayer;
var railLayer;
var feedbackLayer;
var areaLayer;
var layerControl;
var biv;

const download = document.querySelector('#download');
var legend;

// When selector value is clicked
function changeMap() {
    selected_values = {
        "map_type": getValue("map_type"),
        "justice": getValue("justice"),
        "v1": getValue("v1"),
        "amenity": getValue("amenity"),
        "mot": getValue("mot")

    }

    console.log(selected_values)

    info.update();

    // Remove layers if already displayed
    if (polygonLayer) {
        polygonLayer.remove();
        if (poiLayer) {
            poiLayer.remove();
        }
        if (areaLayer) {
            areaLayer.remove();
        }
        if (layerControl) {
            layerControl.remove();
        }
    }
    if (feedbackLayer) {
        feedbackLayer.remove();
    }
    if (stopsAreaLayer) {
        stopsAreaLayer.remove();
    }
    if (stopsCircleLayer) {
        stopsCircleLayer.remove();
    }
    if (railLayer) {
        railLayer.remove();
    }
    if (layerControl)
        layerControl.remove();

    generateLegend("", true);

    //Connect to Geoserver WFS
    if (selected_values["map_type"] == "diff_sg") {
        callGeoServer(
            0,
            "divergent",
            { "filter1": selected_values["v1"], "filter2": selected_values["mot"] },
            handleJsonDiv
        );
    } else if (selected_values["map_type"] == "summ") {
        callGeoServer(
            1,
            "all_normalized",
            {},
            handleJsonRadar
        );
    } else if (selected_values["map_type"] == "feedback") {
        callFeedback(
            handleFeedback
        );
    } else {
        switch (selected_values["justice"]) {
            case "acc":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        2,
                        "acc_all",
                        { "user": selected_values["v1"], "amenity": selected_values["amenity"], "mot": selected_values["mot"] },
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        3,
                        "acc_hilo",
                        { "user": selected_values["v1"], "amenity": selected_values["amenity"], "mot": selected_values["mot"] },
                        handleJsonBiv
                    );
                }

                callGeoServer(
                    4,
                    "pois",
                    { "amenity": selected_values["amenity"] },
                    handleJsonPOIs
                );

                callGeoServer(
                    5,
                    "service_areas",
                    { "amenity": selected_values["amenity"], "mot": selected_values["mot"] },
                    handleJsonAreas
                );

                break;

            case "exp":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        6,
                        "exposure",
                        { "type": selected_values["v1"] },
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        7,
                        "exposure_hilo",
                        { "user": selected_values["v1"], "type": selected_values["amenity"] },
                        handleJsonBiv
                    );
                }
                break;
            case "ava":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        8,
                        "availability",
                        { "type": selected_values["v1"] },
                        handleJsonSeq
                    );
                    if (selected_values["v1"] == "acc_pt") {
                        callLocalGeoRepo(
                            'geodata/filtered_stops.geojson',
                            handleStopPOIs
                        );
                        callLocalGeoRepo(
                            'geodata/filtered_rails.geojson',
                            handleRailsPOIs
                        );
                        handleRailStopsLegend();
                    }
                } else {
                    callGeoServer(
                        9,
                        "availability_hilo",
                        { "user": selected_values["v1"], "type": selected_values["amenity"] },
                        handleJsonBiv
                    );
                    if (selected_values["amenity"] == "acc_pt") {
                        callLocalGeoRepo(
                            'geodata/filtered_stops.geojson',
                            handleStopPOIs
                        );
                        callLocalGeoRepo(
                            'geodata/filtered_rails.geojson',
                            handleRailsPOIs
                        );
                    }
                }
                break;
            case "beh":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        10,
                        "behaviour",
                        { "type": selected_values["v1"] },
                        handleJsonSeq
                    );
                    if (selected_values["v1"] == "pt_usage") {
                        callLocalGeoRepo(
                            'geodata/filtered_stops.geojson',
                            handleStopPOIs
                        );
                        callLocalGeoRepo(
                            'geodata/filtered_rails.geojson',
                            handleRailsPOIs
                        );
                        handleRailStopsLegend();
                    }
                } else {
                    callGeoServer(
                        11,
                        "behaviour_hilo",
                        { "user": selected_values["v1"], "type": selected_values["amenity"] },
                        handleJsonBiv
                    );
                    if (selected_values["amenity"] == "pt_usage") {
                        callLocalGeoRepo(
                            'geodata/filtered_stops.geojson',
                            handleStopPOIs
                        );
                        callLocalGeoRepo(
                            'geodata/filtered_rails.geojson',
                            handleRailsPOIs
                        );
                    }
                }
                break;
            case "income":
                if (selected_values["map_type"] == "sg") {
                    // TODO change the order of the coloring for both income and total population, ideally population density
                    callGeoServer(
                        12,
                        "income",
                        {},
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        13,
                        "income_hilo",
                        {},
                        handleJsonBiv
                    );
                }
                break;
            //case "pop":
            case "tp":
            case "o65":
            case "u18":
            case "ng":
            case "un":
            case "sp":
                if (selected_values["map_type"] == "sg") {
                    callGeoServer(
                        14,
                        "population",
                        //{ "user": selected_values["v1"] },
                        { "user": selected_values["justice"] },
                        handleJsonSeq
                    );
                }
                break;
            default:
                break;
        }
    }
};

// Update map size after menu transition
document.getElementById('navbar-left').addEventListener('change', function() {
    for (let i=0; i<500; i+=50) // 500 ms = 0.5s = transition time; 50 ms = 0.005s = invalidate size frame
        setTimeout(function(){ map.invalidateSize()}, i);
});
