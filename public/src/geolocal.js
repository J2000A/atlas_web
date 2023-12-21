
function loadLocalGeoJSONFile(filepath, callback) {
    return $.getJSON(filepath, callback);
}

function callLocalGeoRepo(jsonFile, callback) {
    var cleanCallback;
    switch (typeof(callback)) {
        case 'string':
            cleanCallback = callback;
            break;
        case 'function':
            cleanCallback = callback.name;
            break;
        default:
            throw new EvalError('Callback should be a string or a function');
    }

    // Replace GEOSERVER_URL with the path to your local GeoJSON file
    var localGeoJSONFilePath = jsonFile;

    // Use the loadLocalGeoJSONFile function to load the local GeoJSON file
    return loadLocalGeoJSONFile(localGeoJSONFilePath, function(data) {
        // Simulate the asynchronous behavior by using setTimeout
        setTimeout(function() {
            // Call the specified callback function with the data
            window[cleanCallback](data);
        }, 0);
    });
}
