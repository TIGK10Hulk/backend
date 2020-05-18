import express = require('express');
import { FirebaseDatabase } from './data-layer/repository';

const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const app = express();
const db: FirebaseDatabase = new FirebaseDatabase();

app.use(bodyParser.json());

// GET all positions
app.get('/positions', async (req: express.Request, res: express.Response) => {
    db.getAllPositions()
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then((arrayWithPositions) => res.status(200).json(arrayWithPositions))
    .catch()
});

// GET positions from specific id
app.get('/positions/sessions/:id', async (req: express.Request, res: express.Response) => {
    const sessionId = req.params.id;
    db.getPositionsFromSession(sessionId)
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then((positionsFromSession) => res.status(200).json(positionsFromSession))
    .catch()
});

// GET latest position logged
app.get('/positions/latest', async (req: express.Request, res: express.Response) => {
    db.getLatestPositionLogged()
    .catch(error => res.status(500).json({message: "Error: " + error.message()}))
    .then((position) => res.status(200).json(position))
    .catch()
});

// POST position in json object format
app.post('/positions', async (req: express.Request, res: express.Response) => {
    db.postPosition(req.body)
    .catch(error => res.status(500).json({message: "Error: " + error.message}))
    .then(() => res.status(200).json("Successfully posted position to session ID: "+req.body.session))
    .catch()
});

// POST postions from a array in jsonstring format
app.post('/positions/array', async (req: express.Request, res: express.Response) => {
    const jsonarray = req.body
    console.log("Jsonarray pos0: "+ jsonarray[0])

    jsonarray.forEach(async (element: any) => {
        await delay(400)

        db.postPosition(JSON.parse(element))
        .catch(error => res.status(500).json({message: "Error: " + error.message}))
        .then(() => res.status(200).json("Successfully posted positions: "))
        .catch()
    });
})

// SUPPORT FUNCTION for adding a slight delay 
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

// Declaring the api object for export
const api = functions.https.onRequest(app)

// Exporting the api object, ready for receiving calls
module.exports = {
    api
};