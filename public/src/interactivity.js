/*********************
 * MAP INTERACTIVITY *
 *********************/

// Add hovering functionality
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
    });

    layer.bringToFront();
    if (areaLayer) { areaLayer.bringToFront(); }
    if (poiLayer) { poiLayer.bringToFront(); }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    polygonLayer.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //click: zoomToFeature
    });
}


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    //this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

    if (selected_values["map_type"] == "summ") {
        this._div.innerHTML = '<h4><span i18n="click"></span></h4>';
    } else if (selected_values["map_type"] == "feedback") {
        this._div.innerHTML = '<h4><span i18n="feedback_click"></span></h4>';
    } else {
        this._div.innerHTML = '<h4><span i18n="hover"></span></h4>';
    }

    if (biv) {
        var X = selected_values["justice"];
        if (X == "income") X = "inc";

        this._div.innerHTML += (props
            ? '<b>' + props.name + '</b><br /><span i18n="' + selected_values["amenity"] + '"></span> ' + props['value_' + X].toFixed(2) + '&nbsp;<span i18n="' + props['value_desc_' + X] + '"></span> (<span i18n="' + props['hilo_' + X] + '"></span>)<br /><span i18n="' + selected_values["v1"] + '"></span> ' + props.value_pop.toFixed(2) + '&nbsp;<span i18n="' + props['value_desc_pop'] + '"></span> (<span i18n="' + props.hilo_pop + '"></span>)'
            : '');
    } else {
        this._div.innerHTML += (props
            ? '<b>' + props.name + '</b><br />' + props.value.toFixed(2) + '&nbsp;<span i18n="' + props.value_desc + '"></span>'
            : '');
    }


    translatePage();
};

info.addTo(map);

// Add scale
var scale = L.control.scale({ metric: true, imperial: false }).addTo(map);

/*************************
 * END MAP INTERACTIVITY *
 *************************/