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
    positionsArray = [];
    if(req.method !== 'GET') {
        res.status(400).json({
            message: "Not allowed"
        })
        return 
    };

    db.getAllPositions(positionsArray)
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then(() => res.status(200).json(positionsArray))
    .catch()
});

// GET all positions
app.get('/positions/sessions/:id', async (req: express.Request, res: express.Response) => {
    const sessionId = req.params.id;
    positionsArray = [];

    db.getPositionsFromSession(positionsArray, sessionId)
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then(() => res.status(200).json({
        "Id": sessionId,
        "positions": positionsArray,
    }))
    .catch()
});

const api = functions.https.onRequest(app)
module.exports = {
    api
}