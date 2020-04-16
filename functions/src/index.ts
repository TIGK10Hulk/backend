const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const express = require('express');
const bodyParser = require('body-parser');
import express = require('express');
import { IPosition } from './IPosition';
import { Position } from './Position';

const app = express()
app.use(bodyParser.json())
admin.initializeApp();


app.post('/position', async (req: express.Request, res: express.Response) => {

    if(req.method != 'POST') {
        res.status(500).json({
            message: "Not allowed"
        })
        return 
    }
    
    const body = req.body
    const requestPosition: IPosition = body;
    
    //validate the sended position here then continue

    const positionObj : IPosition = new Position(
        requestPosition.xCoord, requestPosition.yCoord, requestPosition.isCollision
    );

    positionObj.addDateToPosition(requestPosition)
    .then((position) => {
        admin.database().ref('/positions').push({position: position})
    })
    .catch(() => {
        res.status(500).json({
            message: "Problem in class Position"
        })
    })
    
    //await admin.database().ref('/positions').push({position: positionObj})

    res.status(200).json({
        message: "Position stored successfully in database"
    })
})




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

const api = functions.https.onRequest(app)
module.exports = {
    api
}
