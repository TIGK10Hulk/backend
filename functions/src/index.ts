const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

import express = require('express');
import { IPosition } from './IPosition';
import { Position } from './Position';

const app = express()
app.use(bodyParser.json())
admin.initializeApp();

// GET all positions
app.get('/positions', async (req: any, res: any) => {

    if(req.method !== 'GET') {
        res.status(400).json({
            message: "Not allowed"
        })
        return 
    };

    var db = admin.database();
    var ref = db.ref("/positions");

    ref.on("value", function(snapshot: any) {
        res.status(200).json({
            positionsArray: snapshot.val()
        })
    }, function (errorObject: any) {
        res.status(500).json({
            message: "Error: " + errorObject.message()
        })
    });
});

app.post('/positions', async (req: express.Request, res: express.Response) => {

    if(req.method !== 'POST') {
        res.status(500).json({
            message: "Not allowed"
        })
        return 
    }
    
    const body = req.body
    const requestPosition: IPosition = body;
    
    //validate the sended position here then continue

    const positionObj : IPosition = new Position();

    positionObj.addDateToPosition(requestPosition)
    .then((position) => {
        admin.database().ref('/positions').push({position: position})
        
        res.status(200).json({
            message: "Position stored successfully in database"
        })
    })
    .catch((error) => {
        res.status(500).json({
            message: "Problem in class Position ${error}"
        })
    })
    
})

const api = functions.https.onRequest(app)
module.exports = {
    api
}
