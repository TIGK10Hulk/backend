import express = require('express');
import { IPosition } from './IPosition';
import { Position } from './Position';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
admin.initializeApp();

const db = admin.database();
const ref = db.ref("positions");

// GET all positions
app.get('/positions', async (req: express.Request, res: express.Response) => {

    if(req.method !== 'GET') {
        res.status(400).json({
            message: "Not allowed"
        })
        return 
    };

    let positionsArray: any[] = [];

    ref.once("value", function(snapshot: any) {

        snapshot.forEach(function(childSnapshot: any) {
            positionsArray.push(childSnapshot.val());
        });
        res.status(200).json(positionsArray)

    }, function (errorObject: any) {
        res.status(500).json({
            message: "Error: " + errorObject.message()
        })
    });
});

// GET latest position
app.get('/positions/latest', async (req: express.Request, res: express.Response) => {

    if(req.method !== 'GET') {
        res.status(400).json({
            message: "Not allowed"
        })
        return 
    };

    var outerSnapshot: any;
    var innerSnapshot: any;
    
    ref.orderByKey().limitToLast(1).once("value", function(snapshot: any) {

        snapshot.forEach(function(childSnapshot: any) {
            outerSnapshot = childSnapshot;
        })

        outerSnapshot.forEach(function(childSnapshot: any) {
            innerSnapshot = childSnapshot.val()
        })

        res.status(200).json({"position": innerSnapshot});
        
    }, function (errorObject: any) {
        res.status(500).json({
            message: "Error: " + errorObject.message()
        })
    });
});

// GET session with id param:{ID}
app.get('/positions/:sessionId', async (req: express.Request, res: express.Response) => {

    if(req.method !== 'GET') {
        res.status(400).json({
            message: "Not allowed"
        })
        return 
    };

    const sessionId = req.params.sessionId;
    let positions: any;

    ref.once("value", function(snapshot: any) {

        if(snapshot.hasChild(sessionId.toString())) {
            positions = snapshot.child(sessionId).val();
        } else {
            res.status(400).json({
                message: "Error: No such ID exist for any session"
            })
        }

        res.status(200).json({sessionId, positions});
        
    }, function (errorObject: any) {
        res.status(500).json({
            message: "Error: " + errorObject.message()
        })
    });
});

// POST new position
app.post('/positions', async (req: express.Request, res: express.Response) => {

    if(req.method !== 'POST') {
        res.status(400).json({
            message: "Not allowed"
        })
        return 
    }
    
    const body = req.body
    const requestPosition: IPosition = body;
    const positionObj : IPosition = new Position();

    positionObj.addDateToPosition(requestPosition)
    .then((position) => {
        admin.database().ref('/positions').child(body.session).push(position)
        
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