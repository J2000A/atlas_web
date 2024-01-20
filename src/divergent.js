/************************************
 * divergent.js                     *
 * Ajax callback for divergent data *
 * Author: Héctor Ochoa Ortiz       *
 * Affil.: TUM SVP                  *
 ************************************/

function handleJsonDiv(data) {
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
    var quantsPos = getQuants(filterData(data, "value", (x) => x > 0), "value");
    var quantsNeg = getQuants(filterData(data, "value", (x) => x < 0), "value");

    // Generate style from quantiles
    function getColor(d) {
        return d > quantsPos["Q2"] ? '#a6611a' :
            d > 0 ? '#dfc27d' :
                d == 0 ? '#f5f5f5' :
                    d >= quantsNeg["Q2"] ? '#80cdc1' :
                        '#018571';
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

    // LEGEND
    var legend_text;

    // Generate the legend title based on the divergent filter
    switch (selected_values["v1"]) {
        case "gender":
            legend_text = '<h4>% <span i18n="men"></span> - % <span i18n="women"></span></h4>';
            break;
        case "education":
            legend_text = '<h4>% <span i18="high_education"></span> - % <span i18="low_education"></span></h4>';
            break;
        case "income":
            legend_text = '<h4>% <span i18="high_income"></span> - % <span i18="low_income"></span></h4>';
            break;
        case "age_young":
            legend_text = '<h4>% <span i18="adults"></span> - %<span i18="age_young"></span></h4>';
            break;
        case "age_old":
            legend_text = '<h4>% <span i18="adults"></span> - %<span i18="age_old"></span></h4>';
    }

    // Generate the legend content with the colors, based on quantile (positive and negative) values
    if (quantsPos["Q0"] != undefined) {
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsPos["Q4"] + quantsPos["Q2"]) / 2.0) + '" ></i> ' +
            (quantsPos["Q4"].toFixed(2)) + ' &ndash; ' + (quantsPos["Q2"].toFixed(2));
        legend_text += '<br>';
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsPos["Q2"] + quantsPos["Q0"]) / 2.0) + '" ></i> ' +
            (quantsPos["Q2"].toFixed(2)) + ' &ndash; ' + (quantsPos["Q0"].toFixed(2));
        legend_text += '<br>';
    }
    legend_text +=
    '<i class="square" style="background:' + getColor(0.0) + '" ></i> No data';
    if (quantsNeg["Q0"] != undefined) {
        legend_text += '<br>';
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsNeg["Q4"] + quantsNeg["Q2"]) / 2.0) + '" ></i> ' +
            (quantsNeg["Q4"].toFixed(2)) + ' &ndash; ' + (quantsNeg["Q2"].toFixed(2));
        legend_text += '<br>';
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsNeg["Q2"] + quantsNeg["Q0"]) / 2.0) + '" ></i> ' +
            (quantsNeg["Q2"].toFixed(2)) + ' &ndash; ' + (quantsNeg["Q0"].toFixed(2));
    }

    // Add the explanation text at the bottom of the legend
    legend_text += '<div i18n="divergent_explanation" style="font-size:smaller;font-style:italic"></div>';

    // Add the legend to map
    generateLegend(legend_text, false);

    // Add layer to map
    polygonLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(polygonLayer.getBounds());

    // Add layer control to map
    layerControl = L.control.layers(null, {
        "Background": tiles,
        "Indicator": polygonLayer
    }).addTo(map)

    translatePage();
}