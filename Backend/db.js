const firebase = require('firebase-admin');

let serviceAccount = require('./doit-ce487-firebase-adminsdk-tl79q-a299237460.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://doit-ce487.firebaseio.com",
});
const db = firebase.firestore();    //
module.exports = db;
