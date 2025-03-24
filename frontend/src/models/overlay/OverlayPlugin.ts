/**
 * Custom plugin for the overlay.
 */
export default class OverlayPlugin {
    Name: string;
    Path: string;
    CSS: string;
    JS: string;
    HTML: string;

    constructor(data: Partial<OverlayPlugin>) {
        Object.assign(this, data);
    }
}