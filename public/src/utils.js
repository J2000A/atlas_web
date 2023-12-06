/*********
 * UTILS *
 *********/

function disableTransitions() {
    // Select all elements that have a CSS transition rule
    var elementsWithTransition = $('*').filter(function() {
        var transition = $(this).css('transition');
        return transition !== undefined && transition !== 'none';
    });
    
    elementsWithTransition.addClass('notransition');
}

function enableTransitions() {
    // Select all elements that have a CSS transition rule
    var elementsWithTransition = $('*').filter(function() {
        var transition = $(this).css('transition');
        return transition !== undefined && transition !== 'none';
    });
    
    elementsWithTransition.removeClass('notransition');
}

function filterData(data, column, filter) {
    dataCopy = JSON.parse(JSON.stringify(data));
    dataCopy.features = dataCopy.features.filter((d) => filter(d.properties[column]));
    return dataCopy;
}

// Auxiliary function
function sortedQuants(sortedArray, q) {
    var pos = ((sortedArray.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if ((sortedArray[base + 1] !== undefined)) {
        return sortedArray[base] + rest * (sortedArray[base + 1] - sortedArray[base]);
    } else {
        return sortedArray[base];
    }
}

/**
 * Returns the quantiles of data, value must be stored in properties.value for each feature of data.
 *
 * @param {object} data The data in a dictionary format, fetched from a geoJSON.
 * @param {string} column The geoJSON attribute with the data value.
 * @return {object} The quantiles in a dictionary, with keys "Q0" to "Q4"
 */
function getQuants(data, column) {
    var dataArray = [];
    for (let f in data.features) {
        dataArray.push(data.features[f].properties[column]);
    }

    var sortedArray = dataArray.sort(function (a, b) {
        return a - b;
    });

    return {
        "Q0": sortedArray[0],
        "Q1": sortedQuants(sortedArray, 0.25),
        "Q2": sortedQuants(sortedArray, 0.5),
        "Q3": sortedQuants(sortedArray, 0.75),
        "Q4": sortedArray[sortedArray.length - 1],
    }
}

function percToHex(perc) {
    return (Math.round(255 * perc)).toString(16);
}

/*************
 * END UTILS *
 *************/