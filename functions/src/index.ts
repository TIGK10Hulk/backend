import express = require('express');
import { FirebaseDatabase } from './data-layer/repository';

const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const app = express();
const db: FirebaseDatabase = new FirebaseDatabase();
let positionsArray: any[] = [];

app.use(bodyParser.json());

// GET all positions
app.get('/positions', async (req: express.Request, res: express.Response) => {
    resetArray(positionsArray);
    db.getAllPositions(positionsArray)
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then(() => res.status(200).json(positionsArray))
    .catch()
});

// GET positions from specific id
app.get('/positions/sessions/:id', async (req: express.Request, res: express.Response) => {
    const sessionId = req.params.id;
    resetArray(positionsArray);
    db.getPositionsFromSession(positionsArray, sessionId)
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then(() => res.status(200).json({
        "Id": sessionId,
        "positions": positionsArray,
    }))
    .catch()
});

// GET latest position logged
app.get('/positions/latest', async (req: express.Request, res: express.Response) => {
    resetArray(positionsArray);
    db.getLatestPositionLogged(positionsArray)
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then(() => res.status(200).json(positionsArray[0]))
    .catch()
});

// POST position in json object format
app.post('/positions', async (req: express.Request, res: express.Response) => {
    console.log("Request body here: " + req.body)
    db.postPosition(req.body)
    .catch(error => res.status(500).json({message: "Error: " + error.message}))
    .then(() => res.status(200).json("Successfully posted position to session ID: "+req.body.session))
    .catch()
});

// POST postions from a array in jsonstring format
app.post('/positions/array', async (req: express.Request, res: express.Response) => {
    const jsonarray = req.body
    console.log("Jsonarray pos0: "+ jsonarray[0])

    jsonarray.forEach((element: any) => {
        db.postPosition(JSON.parse(element))
        .catch(error => res.status(500).json({message: "Error: " + error.message}))
        .then(() => res.status(200).json("Successfully posted positions: "))
        .catch()
    });
})


function resetArray(array: any) {
    array = []
}

const api = functions.https.onRequest(app)

module.exports = {
    api
};