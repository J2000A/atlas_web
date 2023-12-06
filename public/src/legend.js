/**
 * Adds info to the map legend
 *
 * @param {String} info The info to add
 * @param {boolean} replace True: replace the current legend, False: append to the current legend
 */
function generateLegend(info, replace) {
    if (replace) {
        // Remove the current legend
        if (legend) { legend.remove(); }

        // Add the new legend
        legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = '<input type="checkbox">'
            + '<div class="legend-title-text" i18n="legend"></div>' 
            + '<div class="arrow"></div>'
            + '<div class="legend-content"></div>';

            div.querySelector('input').checked = false; // Not minimized
            div.querySelector('.legend-content').innerHTML = info; // Add the info
            return div;
        };

        legend.addTo(map);
    } else {
        if (legend._container.querySelector('.legend-content').innerHTML != '') {
            legend._container.querySelector('.legend-content').innerHTML += '<br>';
        }
        legend._container.querySelector('.legend-content').innerHTML += info;
    }

    translatePage();
}