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

var busAreaStyle = {
    fillColor: '#ffffff',
    fillOpacity: 0.1,
    stroke: false
};

function getLegendIFromCircleStyle(style) {
    let size = (style.radius * 2.0) + (style.weight * 2.0);
    return '<i class="circle" style="background: ' + style.fillColor + percToHex(style.fillOpacity) + '; border: ' + style.weight + 'px solid ' + style.color + percToHex(style.opacity) + '; width:' + size + 'px; height:' + size + 'px;" ></i>';
}

function formatBusstopPopup(name, id) {
    return "<b>" + name + "</b><br>ID: " + id; 
}


function handleJsonPOIs(data) {
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


function handleBusstopPOIs(data) {
    poiLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, poiCircleStyle);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(formatBusstopPopup(feature.properties.stop_name, feature.properties.stop_id));
        }
    }).addTo(map);

    let style = {
        fillColor: '#000000',
        weight: 1,
        opacity: 1,
        color: '#483D8B',
        fillOpacity: 0.2,
        stroke: false
    };

    areaLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        pointToLayer: function (feature, latlng) {
            return L.circle(latlng, { radius: 300, interactive: false });
        }
    }).addTo(map);
    /* 
    console.log(data.features)
    var data_features = data.features;
    var buffers = data_features.map(function(point) {
        return turf.buffer(point, 500, {units: 'meters'});
    });
    console.log(buffers)
    var unionBuffer = turf.union(...buffers);

    areaLayer = L.geoJson(unionBuffer, {
        style: style,
    }).addTo(map); */

    var legend_text = '<h4><span i18n="' + selected_values["amenity"] + '"></span> Points of Interest (POIs)</h4>';
    legend_text += getLegendIFromCircleStyle(poiCircleStyle);
    generateLegend(legend_text, false);

    // Add layer control to map
    var layerControlOptions = {};
    if (tiles) { layerControlOptions["Background"] = tiles; }
    if (polygonLayer) { layerControlOptions["Indicator"] = polygonLayer; }
    if (selected_values["justice"] == "acc") {
        if (poiLayer) { layerControlOptions["POIs"] = poiLayer; }
        if (areaLayer) { layerControlOptions["Service Areas"] = areaLayer; }
    } else if (selected_values["justice"] == "beh") { // TODO that these elements also show up in the layerControl
        if (poiLayer) { layerControlOptions["POIs"] = poiLayer; }
        if (areaLayer) { layerControlOptions["Service Areas"] = areaLayer; }
    }
    layerControl = L.control.layers(null, layerControlOptions).addTo(map);

    // Reorder layers
    if (areaLayer) {
        areaLayer.bringToFront();
        if (poiLayer) {
            poiLayer.bringToFront();
        }
    }

    translatePage();
}