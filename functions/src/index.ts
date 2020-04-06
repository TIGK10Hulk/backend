const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')

const app = express()
admin.initializeApp();


//0.5 sec mellanrum?
//vi får x,y,collBool
//{x: x, y: y, collBool: true}
//

app.get('/test', (req: any, res: any) => {
    res.send("Hello from express!")
})

const api = functions.https.onRequest(app)

module.exports = {
    api
}

export const helloWorld = functions.https.onRequest((request: any, response: any) => {
    console.log("Hello everybody!")
    response.send("Hello from Fredric Lundberg! hihi");
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req: any, res: any) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //res.redirect(303, snapshot.ref.toString());
    res.send("Added textinput to database!");
});


export const storeCoordinates = functions.https.onRequest(async (req: any, res: any) => {
    //desirilize json object to a custom-made Object POGO
    //const jsonObj = req.body
    //validate
    //place POGO objects coordinates into db
    //resolve
})
