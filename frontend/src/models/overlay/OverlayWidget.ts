import Position from "../Position";

/**
 * The overlay is made up of widgets. Each widget is a separate component 
 * that can be moved around and resized. Custom widgets can be added by
 * adding for showing a custom iframe.
 */
export default class OverlayWidget {

    /**
     * The name of the widget.
     */
    name: string = '';

    /**
     * Whether the widget is active or not. If the widget is not active, it
     * will not be displayed in the overlay.
     */
    active: boolean = false;

    /**
     * The position of the widget. This includes the x and y position of the
     * widget, the width and height of the widget, and whether the widget is
     * fixed or not.
     */
    position: Position = new Position();

    /**
     * If the widget has any customizations, they can be stored here.
     */
    cfg: any = {};

    path: string = '';

    CSS: string = '';
    JS: string = '';
    HTML: string = '';
    JSON: any = {};

    evaluated: boolean = false;

    /**
     * The constructor of the widget.
     * 
     * @param id The id of the widget.
     * @param name The name of the widget.
     * @param position The position of the widget.
     * @param cfg The configuration of the widget.
     */
    constructor(
    name: string, 
    position?: {fixed?: string|null, x?: number, y?: number, w?: number, h?: number}, 
    cfg: any = {}, active?: boolean) {
        this.active = active || false;
        this.name = name;
        this.position = Object.assign(this.position, position);
        this.cfg = cfg;
    }

    /**
     * Get the position of the widget.
     * 
     * @returns The position of the widget.
     */
    getPosition() {
        return this.position;
    }

    /**
     * Set the position of the widget.
     * 
     * @param position The new position of the widget.
     */
    setPosition(x: number, y: number, w: number, h: number) {
        this.position = {
            fixed: null,
            x: x,
            y: y,
            w: w,
            h: h
        };
    }

    /**
     * Set the fixed position of the widget.
     * 
     * @param fixed The new fixed position of the widget.
     */
    setFixedPosition(fixed: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | null) {
        this.position.fixed = fixed;
    }

    clone() {
        const widget = new OverlayWidget(this.name, this.position, this.cfg, this.active);
        widget.path = this.path;
        widget.CSS = this.CSS;
        widget.JS = this.JS;
        widget.HTML = this.HTML;

        return widget;
    }
};