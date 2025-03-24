// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import {Create as $Create} from "@wailsio/runtime";

export class Monitor {
    "Name": string;
    "Width": number;
    "Height": number;

    /** Creates a new Monitor instance. */
    constructor($$source: Partial<Monitor> = {}) {
        if (!("Name" in $$source)) {
            this["Name"] = "";
        }
        if (!("Width" in $$source)) {
            this["Width"] = 0;
        }
        if (!("Height" in $$source)) {
            this["Height"] = 0;
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new Monitor instance from a string or object.
     */
    static createFrom($$source: any = {}): Monitor {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new Monitor($$parsedSource as Partial<Monitor>);
    }
}

export class Plugin {
    /**
     * Name of the plugin
     */
    "Name": string;

    /**
     * Path to the plugin
     */
    "Path": string;

    /**
     * HTML content of the plugin
     */
    "HTML": string;

    /**
     * JS content of the plugin
     */
    "JS": string;

    /**
     * CSS content of the plugin
     */
    "CSS": string;

    /** Creates a new Plugin instance. */
    constructor($$source: Partial<Plugin> = {}) {
        if (!("Name" in $$source)) {
            this["Name"] = "";
        }
        if (!("Path" in $$source)) {
            this["Path"] = "";
        }
        if (!("HTML" in $$source)) {
            this["HTML"] = "";
        }
        if (!("JS" in $$source)) {
            this["JS"] = "";
        }
        if (!("CSS" in $$source)) {
            this["CSS"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new Plugin instance from a string or object.
     */
    static createFrom($$source: any = {}): Plugin {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new Plugin($$parsedSource as Partial<Plugin>);
    }
}

export class Style {
    /**
     * Name of the stylesheet
     */
    "Name": string;

    /**
     * Path to the stylesheet
     */
    "Path": string;

    /**
     * CSS content of the stylesheet
     */
    "CSS": string;

    /** Creates a new Style instance. */
    constructor($$source: Partial<Style> = {}) {
        if (!("Name" in $$source)) {
            this["Name"] = "";
        }
        if (!("Path" in $$source)) {
            this["Path"] = "";
        }
        if (!("CSS" in $$source)) {
            this["CSS"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new Style instance from a string or object.
     */
    static createFrom($$source: any = {}): Style {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new Style($$parsedSource as Partial<Style>);
    }
}
