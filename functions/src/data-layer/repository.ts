import * as firebase from 'firebase';
import { IPosition } from '../models/position/IPosition'
import { Position } from '../models/position/Position'

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

    async getAllPositions() : Promise<any> {
        const tempArr: any[] = [];
        await this.ref.once("value", function(snapshot: any) {
            snapshot.forEach(function(childSnapshot: any) {
                tempArr.push(childSnapshot.val());
            });
        });
        return tempArr;
    }

    async getPositionsFromSession(sessionId: any) : Promise<any> {
        let tempArr: any;
        const positionsArr: any[] = [];

        await this.ref.once("value", function(snapshot: any) {
            if(snapshot.hasChild(sessionId.toString())) {
                tempArr = snapshot.child(sessionId);
                tempArr.forEach(function(childSnapshot: any) {
                    positionsArr.push(childSnapshot);
                })
            }
        });
        return positionsArr;
    }

    async getLatestPositionLogged() : Promise<any> {
        let outerSnapshot: any;
        let innerSnapshot: any;
        let latestPosition: any;

        await this.ref.orderByKey().limitToLast(1).once("value", function(snapshot: any) {

            snapshot.forEach(function(childSnapshot: any) {
                outerSnapshot = childSnapshot;
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

            latestPosition = position;
        });
        return latestPosition;
    }

    async postPosition(body: any) : Promise<any> {
        const requestPosition: IPosition = body;    
        const positionObj : IPosition = new Position();
        const sessionId = requestPosition.session;

        positionObj.addDateToPosition(requestPosition)
        .then((position) => {
            this.db.ref('positions'+'/'+sessionId).push(position)
        }).catch((error) => {
            return false
        })
    }
}