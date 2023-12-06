/*************************************
 * sequential.js                     *
 * Ajax callback for sequential data *
 * Author: Héctor Ochoa Ortiz        *
 * Affil.: TUM SVP                   *
 *************************************/

function handleJsonSeq(data) {
    biv = false;

    // Add data to download button
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    download.setAttribute("href", dataStr);
    download.setAttribute("download", "data.geojson");

    // If layer is empty, show error message and return
    if (data.features.length == 0) {
        alert('Error while querying, no features found.');
        return;
    }

    // Generate quantiles
    var quants = getQuants(data, "value");
    
    // Generate style from quantiles
    function getColor(d) {
        return  d > quants["Q3"] ? '#d7301f' :
                d > quants["Q2"] ? '#fc8d59' :
                d > quants["Q1"] ? '#fdcc8a' :
                '#fef0d9';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 0.5,
            opacity: 1,
            color: '#1a1a1a',
            fillOpacity: 0.7
        };
    }

    // legend
    let grades = [quants["Q0"], quants["Q1"], quants["Q2"], quants["Q3"], quants["Q4"]];
    var legend_text = '<h4><span i18n="' + (selected_values["map_type"] == "sg" ? selected_values["justice"] : selected_values["v1"]) + '"></span> [<span i18n="' + data.features[0].properties.value_desc + '"></span>]'+ (selected_values["justice"] == "acc" ? ', <span i18n="' + selected_values["amenity"] + '"></span>, <span i18n="' + selected_values["mot"] + '"></span>' : '') + '</h4>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length - 1; i++) {
        legend_text +=
            '<i class="square" style="background:' + getColor((grades[i] + grades[i + 1]) / 2.0) + '" ></i> ' +
            (grades[i].toFixed(2)) + '&ndash;' + (grades[i + 1].toFixed(2));
        if (i < grades.length - 2) { legend_text += '<br>'; }
    }

    // add legend to map
    generateLegend(legend_text, false);

    // Add layer to map
    polygonLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(polygonLayer.getBounds());

    // Add layer control to map
    var layerControlOptions = {};
    if (tiles) { layerControlOptions["Background"] = tiles; }
    if (polygonLayer) { layerControlOptions["Indicator"] = polygonLayer; }
    if (selected_values["justice"] == "acc") {
        if (poiLayer) { layerControlOptions["POIs"] = poiLayer; }
        if (areaLayer) { layerControlOptions["Service Areas"] = areaLayer; }
    }
    layerControl = L.control.layers(null, layerControlOptions).addTo(map)

    if (areaLayer) {
        areaLayer.bringToFront();
        if (poiLayer) {
            poiLayer.bringToFront();
        }
    }

    translatePage();
}