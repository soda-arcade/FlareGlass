/**
 * Custom CSS for the overlay.
 */
export default class OverlayStyle {
    Name: string;
    Path: string;
    CSS: string;

    constructor(data: Partial<OverlayStyle>) {
        Object.assign(this, data);
    }
}