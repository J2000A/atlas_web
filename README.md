# JustFairMobility Web App

## The TUM (In)justice Atlas Website
This project was forked from [this repository](https://github.com/Robot8A/atlas_web) created by the TUM Chair of Urban Structure and Transport Planning.

The documentation for the original atlas can be found in the [wiki](https://github.com/Robot8A/atlas_web/wiki).

## Running the Web App locally
Please run the following command once after you cloned the repository:
```
npm install
```

Then you can start the server on http://localhost:3000/ with the following command:
```
npm start
```

## Project Structure
There are three main pages:

- [Landing Page](landingpage.html) (for the Tech-Challenge)
- [Home Page](index.html) (entry point for the web app)
- [Atlas](atlas.html) (the atlas itself)

The translations of the different strings can be found in the [i18n](i18n) directory.

The [src](src) directory contains all the javascript files used to run web application.

## Further References
The backend is implemented using the [Firebase](https://firebase.google.com/) products *Firestore Database* and *Firebase Storage*.

The mobile application for creating the problem reports can be found in [this repository](https://github.com/J2000A/JustFairMobilityApp).

## Deploying the Web App
For deploying the app copy all the files in the repository to your web server. For example with SFTP.