export default class Position {
    fixed: string|null = null;
    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;

    /**
     * The constructor of the position.
     */
    constructor(position?: Partial<Position>) {
        Object.assign(this, position);
    }
}