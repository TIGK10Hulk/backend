export interface IPosition {
    xCoord: string;
    yCoord: string;
    isCollision: boolean;
    stamp?: number;

    addDateToPosition(requestPosition: IPosition): Promise<IPosition>;
}