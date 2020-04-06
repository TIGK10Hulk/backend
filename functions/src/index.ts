const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request: any, response: any) => {
    console.log("Hello everybody!")
    response.send("Hello from Fredric Lundberg! hihi");
});


