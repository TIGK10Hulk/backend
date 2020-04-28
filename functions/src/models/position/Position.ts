import { IPosition } from './IPosition';
import { DateHandler } from '../date/DateHandler';
import { IDateHandler } from '../date/IDateHandler';

export class Position implements IPosition {
    xCoord?: string;
    yCoord?: string;
    isCollision?: boolean;
    stamp?: number;
    session?: string;

    constructor(
        xCoord?: string, 
        yCoord?: string, 
        isCollision?: boolean, 
        stamp? : number,
        session? : string
    ) 
    {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.isCollision = isCollision;
        this.stamp = stamp;
        this.session = session;
    }

    async addDateToPosition(requestPosition: IPosition) : Promise<IPosition> {
        
        try {
            const dateobject: IDateHandler = new DateHandler();
            const milliseconds = dateobject.getTime();

            requestPosition.stamp = milliseconds;
        } catch (error) {
            throw new Error("Error, Thrown from Position")
        }
        return requestPosition;  
    }
}