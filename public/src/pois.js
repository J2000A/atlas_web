/******************************
 * pois.js                    *
 * Ajax callback for POI data *
 * Author: Héctor Ochoa Ortiz *
 * Affil.: TUM SVP            *
 ******************************/

var poiCircleStyle = {
    radius: 1.5,
    fillColor: "#5ab4ac",
    color: "#000000",
    weight: 0.25,
    opacity: 0.75,
    fillOpacity: 1
}

var poiFeedbackStyle = {
    radius: 5,
    fillColor: "#2a61d2",
    color: "#000000",
    weight: 0.25,
    opacity: 0.75,
    fillOpacity: 1
}

var busCircleStyle = {
    radius: 2.5,
    fillColor: "#5ab4ac",
    color: "#000000",
    weight: 0.25,
    opacity: 0.75,
    fillOpacity: 1
}

let busAreaStyle = {
    fillColor: '#000000',
    weight: 1,
    opacity: 1,
    color: '#483D8B',
    fillOpacity: 0.05,
    stroke: false
};

function getLegendIFromCircleStyle(style) {
    let size = (style.radius * 2.0) + (style.weight * 2.0);
    return '<i class="circle" style="background: ' + style.fillColor + percToHex(style.fillOpacity) + '; border: ' + style.weight + 'px solid ' + style.color + percToHex(style.opacity) + '; width:' + size + 'px; height:' + size + 'px;" ></i>';
}

function handleBusstopPOIs(data) {
    console.log("Handle Bus Stops")
    busCircleLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://geodaten.bayern.de/opengeodata/" style="color: #0078A8" i18n="opendata"></a>',
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, busCircleStyle);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>" + feature.properties.stop_name + "</b>")
        }
    }).addTo(map);

    busAreaLayer = L.geoJson(data, {
        style: busAreaStyle,
        pointToLayer: function (feature, latlng) {
            return L.circle(latlng, { radius: 300, interactive: false });
        }
    }).addTo(map);

    var legend_text = '<h4><span i18n="bus_stops"></span></h4><svg width="20" height="20">\n' +
        '        <circle cx="10" cy="10" r="7" fill="#5ab4ac" stroke="#000000" stroke-width="0.5" opacity="0.75" />\n' +
        '    </svg>';
    generateLegend(legend_text, false);

    // Add layer control to map
    var layerControlOptions = {};
    layerControlOptions["Bus Stops"] = busCircleLayer;
    layerControlOptions["Bus Stops Distance"] = busAreaLayer;
    layerControl = L.control.layers(null, layerControlOptions).addTo(map)

    translatePage();
}

function handleFeedback(data) {
    // Create an array to store features for GeoJSON
    var geojsonFeatures = [];

    // Process each feedback entry and create GeoJSON features
    data.forEach(feedback => {
        var poiFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [feedback.location.lon, feedback.location.lat]
            },
            "properties": {
                "date": feedback.date,
                "category": feedback.category,
                "description": feedback.description,
                "photos": feedback.photos
            }
        };
        geojsonFeatures.push(poiFeature); // Add the POI feature to the GeoJSON features array
    });

    // Create a GeoJSON object
    var poiGeoJSON = {
        "type": "FeatureCollection",
        "features": geojsonFeatures
    };

    // Use the generated GeoJSON object to create POI markers on the map
    feedbackLayer = L.geoJson(poiGeoJSON, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, poiFeedbackStyle);
        },
        onEachFeature: function (feature, layer) {
            // Create a popup with information from the properties
            var popupContent = "<strong>Date:</strong> " + feature.properties.date +
                "<br><strong>Category:</strong> " + feature.properties.category +
                "<br><strong>Description:</strong> " + feature.properties.description;

            // Add images to the popup if available
            if (feature.properties.photos && feature.properties.photos.length > 0) {
                popupContent += "<br><strong>Photos:</strong><br>";
                feature.properties.photos.forEach(photo => {
                    let path = "https://firebasestorage.googleapis.com/v0/b/justfairmobility.appspot.com/o/" + photo + "?alt=media"
                    popupContent += `<a href="${path}" target="_blank"><img src="${path}" width="100"></a><br>`;
                });
            }

            layer.bindPopup(popupContent);
        }
    }).addTo(map);

    var legend_text = '<h4><span i18n="feedback"></span></h4>';
    generateLegend(legend_text, false);

    translatePage();
}


function handleJsonPOIs(data) {
    console.log(data)
    poiLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, poiCircleStyle);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(String(feature.properties.name));
        }
    }).addTo(map);

    var legend_text = '<h4><span i18n="' + selected_values["amenity"] + '"></span> Points of Interest (POIs)</h4>';
    legend_text += getLegendIFromCircleStyle(poiCircleStyle);
    generateLegend(legend_text, false);

    translatePage();
}