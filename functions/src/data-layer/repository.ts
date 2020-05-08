import * as firebase from 'firebase';
import { IPosition } from '../models/position/IPosition'
import { Position } from '../models/position/Position'

//const admin = require('firebase-admin')

const config = {
    apiKey: "AIzaSyC0kt5tCZ2iaEHD_9MmG-95v8XkbSx6idQ",
    authDomain: "hulkdoris-4c6eb.firebaseapp.com",
    databaseURL: "https://hulkdoris-4c6eb.firebaseio.com/",
    storageBucket: "hulkdoris-4c6eb.appspot.com"
};

firebase.initializeApp(config);

export class FirebaseDatabase {

    db: firebase.database.Database;
    ref: firebase.database.Reference;

    constructor() {
        this.db = firebase.database();
        this.ref = this.db.ref("positions");
    }

    async getAllPositions(positionsArray: any) : Promise<any> {
        await this.ref.once("value", function(snapshot: any) {
            snapshot.forEach(function(childSnapshot: any) {
                positionsArray.push(childSnapshot.val());
            });
        });
    }

    async getPositionsFromSession(positionsArray: any, sessionId: any) : Promise<any> {
        let tempArr: any;
        await this.ref.once("value", function(snapshot: any) {
            if(snapshot.hasChild(sessionId.toString())) {
                tempArr = snapshot.child(sessionId);
                tempArr.forEach(function(childSnapshot: any) {
                    positionsArray.push(childSnapshot);
                })
            }
        });
    }

    async getLatestPositionLogged(positionsArray: any) : Promise<any> {
        let outerSnapshot: any;
        let innerSnapshot: any;

        await this.ref.orderByKey().limitToLast(1).once("value", function(snapshot: any) {

            snapshot.forEach(function(childSnapshot: any) {
                outerSnapshot = snapshot;
            })
    
            outerSnapshot.forEach(function(childSnapshot: any) {
                innerSnapshot = childSnapshot.val()
            })

            const position: IPosition = new Position(
                innerSnapshot.xCoord,
                innerSnapshot.yCoord,
                innerSnapshot.isCollision,
                innerSnapshot.stamp,
                innerSnapshot.session
            );

            positionsArray.push(position)
        });
    }

    async postPosition(body: any) : Promise<any> {
        const requestPosition: IPosition = body;    
        let positionObj : IPosition = new Position();
        const sessionId = requestPosition.session;

        await positionObj.addDateToPosition(requestPosition)
        .then((position) => {
            this.db.ref('positions'+'/'+sessionId).push(position)
        }).catch((error) => {
            return false
        })
    }
}