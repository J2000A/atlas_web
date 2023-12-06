/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');

const app = express();

// Define a route to act as a proxy
app.get('/fetch-insecure-data', async (req, res) => {
    try {
        // Make a GET request to the insecure HTTP endpoint
        const response = await axios.get('http://91.200.101.244:3000/geoserver/wfs', {
            params: {
                format_options: 'callback:handleJsonSeq',
                service: 'WFS',
                version: '1.1.0',
                request: 'GetFeature',
                typename: 'MGeM:behaviour',
                srsname: 'EPSG:4326',
                outputFormat: 'text/javascript',
                viewparams: 'type:pt_usage',
                _: Date.now() // Add a timestamp to avoid caching
            }
        });

        // Send the fetched data as the response
        res.status(200).json(response.data);
    } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Define the HTTPS function
exports.proxyToInsecureEndpoint = functions.https.onRequest(app);