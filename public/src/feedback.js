function callFeedback(callback) {
    // Fetch all documents from the "feedback" collection
    fetch(`https://firestore.googleapis.com/v1/projects/justfairmobility/databases/(default)/documents/feedback`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process retrieved documents
            console.log(data);
            
            if (data.documents && Array.isArray(data.documents)) {
                const transformedData = data.documents.map(doc => {
                    const documentFields = doc.fields;

                    // Ensure that 'documentFields.photos.arrayValue.values' exists and is an array
                    const photos = documentFields.photos &&
                        documentFields.photos.arrayValue &&
                        documentFields.photos.arrayValue.values &&
                        Array.isArray(documentFields.photos.arrayValue.values)
                        ? documentFields.photos.arrayValue.values.map(photo => photo.stringValue)
                        : [];

                    return {
                        date: documentFields.date.stringValue || '',
                        category: documentFields.category.stringValue || '',
                        location: {
                            lat: documentFields.location.geoPointValue.latitude || 0,
                            lon: documentFields.location.geoPointValue.longitude || 0
                        },
                        photos,
                        description: documentFields.description.stringValue || ''
                    };
                });

                // Invoke the callback function with the transformed data
                console.log(transformedData);
                callback(transformedData);
            } else {
                console.error('Invalid data structure received.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
