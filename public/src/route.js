/******************************
 * pois.js                    *
 * Ajax callback for route data *
 * Author: Jasper Wiltfang    *
 * Affil.: TUM SVP            *
 ******************************/

var routeLineStyle = {
    color: "#ff7800",
    weight: 5,
    opacity: 0.75
};

function getLegendIFromLineStyle(style) {
    return '<i class="line" style="background: linear-gradient(to right, ' + style.color + ', ' + style.color + ' ' + style.weight + 'px, transparent ' + style.weight + 'px);"></i>';
}

function handleJsonRoutes(data) {
    routeLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: routeLineStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(String(feature.properties.name));
        }
    }).addTo(map);

    var legend_text = '<h4><span i18n="' + selected_values["route"] + '"></span> Routes</h4>';
    legend_text += getLegendIFromLineStyle(routeLineStyle);
    generateLegend(legend_text, false);

    translatePage();
}