function callFeedback(callback) {
    var data = [{
        "date": "07.01.2024",
        "category": "Road Conditions ► Potholes",
        "location": {
            "lat": 48.1633,
            "lon": 11.5708
        },
        "photos": ["pothole1.jpg", "pothole2.jpg"],
        "description": "There are potholes on the road!"
    }]
    // handleFeedback(data)
    callback(data)
}