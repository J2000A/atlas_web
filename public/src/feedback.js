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
            console.log(data)
            const transformedData = data.documents.map(doc => {
                const documentFields = doc.fields;
                return {
                    date: documentFields.date.stringValue,
                    category: documentFields.category.stringValue,
                    location: {
                        lat: documentFields.location.geoPointValue.latitude,
                        lon: documentFields.location.geoPointValue.longitude
                    },
                    photos: (documentFields.photos.arrayValue.values || []).map(photo => photo.stringValue),
                    description: (documentFields.description.stringValue || "-")
                };
            });

            // Invoke the callback function with the transformed data
            console.log(transformedData)
            callback(transformedData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}