import Position from "./Position";

export default class Config {
    // Group of overlay configurations
    overlay = {
        theme: 'default',
        opacity: 0.9,
        display: 0,
        widgets: {
            default: [
                {name: 'chat', position: new Position({fixed: 'top-left', w:400, h:200}), active: true},
                {name: 'guests', position: new Position({fixed: 'top-right', w: 250, h: 0}), active: true},
                {name: 'pads', position: new Position({fixed: 'bottom-center'}), active: true},
            ] as {name:string, position:Position, active:boolean, cfg: any}[],
            custom: [] as {name:string, position:Position, active:boolean, cfg: any}[],
        }
    };

    hotkeys = {
        'hotkey:chat': { modifiers: [2, 4], key: 67, event: 'hotkey:chat' },
        'hotkey:opacity:in': { modifiers: [2, 4], key: 38, event: 'hotkey:opacity:in' },
        'hotkey:opacity:out': { modifiers: [2, 4], key: 40, event: 'hotkey:opacity:out' },
        'hotkey:zoom:out': { modifiers: [2, 4], key: 37, event: 'hotkey:zoom:out' },
        'hotkey:zoom:in': { modifiers: [2, 4], key: 39, event: 'hotkey:zoom:in' },
        'hotkey:menu': { modifiers: [2, 4], key: 112, event: 'hotkey:menu' },
        'hotkey:move': { modifiers: [2, 4], key: 77, event: 'hotkey:move' },
    };

    constructor(data?: Partial<Config>) {
        if (data) {
            Object.assign(this, data);

            // Ensure display is a number
            if (typeof this.overlay.display === 'string') {
                this.overlay.display = parseInt(this.overlay.display);
            }
        }
    }

    clone() {
        return new Config(JSON.parse(JSON.stringify(this)));
    }
}