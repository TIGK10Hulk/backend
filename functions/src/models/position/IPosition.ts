export interface IPosition {
    xCoord?: string;
    yCoord?: string;
    isCollision?: boolean;
    stamp?: number;
    session?: string;

    addDateToPosition(requestPosition: IPosition): Promise<IPosition>;
}