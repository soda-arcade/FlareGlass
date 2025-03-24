import mitt from 'mitt';
import { MoveMainWindowToMonitor } from '@bindings/services/windowservice';
import * as axios from "@/utils/axios";
import * as environment from "@/utils/environment";
import * as helpers from "@/utils/helpers";
import * as dialog from "@/utils/dialog";

import { useConfigStore } from '@/stores/configStore';
import { useOverlayStore } from '@/stores/overlayStore';

/**
 * Initializes the FlareGlass global object.
 * 
 * @returns
 */
export async function initOverlay() {

    // Create the global app object
    const app = {
        env: environment,
        eventBus: mitt(),
        helpers: helpers,
        stores: {
            config: useConfigStore(),
            overlay: useOverlayStore(),
        },
        http: axios,
        dialog: dialog,
    };
    window.$app = app;

    // Load configuration
    await app.stores.config.load();

    // Move main window to correct monitor
    MoveMainWindowToMonitor(app.stores.config.app.overlay.display);

    // Register hotkeys
    await app.stores.config.registerHotkeys();

    // Load custom styles and plugins
    await app.stores.overlay.initDefaultWidgets();
    await app.stores.overlay.loadStyles();
    await app.stores.overlay.loadPlugins();

    // Set theme
    app.stores.config.setTheme();
}

interface OverlayApp {
    /**
     * Environment-related utilities
     */
    env: typeof environment;
    /**
     * Mitt event bus
     */
    eventBus: {
        /**
         * Listen for an event.
         * @param event Event name.
         * @param callback Callback function.
         */
        on: (event: string, callback: (data: any) => void) => void;

        /**
         * Stop listening for an event.
         * @param event Event name.
         * @param callback Callback function.
         */
        off: (event: string, callback: (data: any) => void) => void;

        /**
         * Emit an event.
         * @param event Event name.
         * @param data Data to emit.
         */
        emit: (event: string, data?: any) => void;
    };
    /**
     * Utility functions
     */
    helpers: typeof helpers;
    /**
     * Axios HTTP client
     */
    http: typeof axios;
    dialog: typeof dialog;
    /**
     * Pinia stores
     */
    stores: {
        config: ReturnType<typeof useConfigStore>;
        overlay: ReturnType<typeof useOverlayStore>;
    };
}

declare global {
    interface Window {
        $app: OverlayApp;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $app: OverlayApp;
    }
}