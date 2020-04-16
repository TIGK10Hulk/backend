import { IDateHandler } from "./IDateHandler";

export class DateHandler implements IDateHandler {

    date : Date;

    constructor() {
        this.date = new Date();
    }
    
    getMilliSeconds() : number {
        const milliSeconds = this.date.getMilliseconds();       
        return milliSeconds;
        
    }

    getTime() : number {
        const time = this.date.getTime();
        return time;
    }

    
}