import { IPosition } from './IPosition';
import { IDateHandler } from './IDateHandler';
import { DateHandler } from './DateHandler';


export class Position implements IPosition {
    xCoord?: string;
    yCoord?: string;
    isCollision?: boolean;
    stamp?: number;

    constructor(
        xCoord?: string, 
        yCoord?: string, 
        isCollision?: boolean, 
        stamp? : number,
    ) 
    {
        this.xCoord = xCoord 
        this.yCoord = yCoord 
        this.isCollision = isCollision 
        this.stamp = stamp;
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