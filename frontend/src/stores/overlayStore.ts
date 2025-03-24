import { defineStore } from 'pinia';
import DOMPurify from 'dompurify';
import { Application } from '@wailsio/runtime';
import { Focus, Blur } from '@bindings/services/windowservice';
import { 
    GetWindowNames, 
    StartWatchingFocus, 
    StopWatchingFocus 
} from '@bindings/services/hookservice';
import { GetProp } from "@bindings/services/configservice";

import { GetOverlayStyles } from '@bindings/services/styleservice';
import { LoadPlugins } from '@bindings/services/pluginservice';

import User from '@/models/User';
import Pad from '@/models/Pad';
import Position from '@/models/Position';
import OverlayWidget from '@/models/overlay/OverlayWidget';
import OverlayStyle from '@/models/overlay/OverlayStyle';
import OverlayPlugin from '@/models/overlay/OverlayPlugin';

/**
 * This store is used to manage the overlay state
 */
export const useOverlayStore = defineStore('overlayStore', {
    state: () => {
        return {
            pads: [] as Pad[],
            plugins: [] as OverlayPlugin[],
            styles: [] as OverlayStyle[],
            users: [] as User[],
            widgets: {
                default: [
                    new OverlayWidget('chat', new Position({ fixed: 'top-left', w: 300, h: 200}), {
                        showHistory: true,
                        plainText: false,
                    }),
                    new OverlayWidget('guests', new Position({ fixed: 'top-right'}), {
                        showLatency: true,
                        showAvatars: true,
                    }),
                    new OverlayWidget('pads', new Position({ fixed: 'bottom-center'}), {
                        showHotseatTime: true,
                    }),
                ] as OverlayWidget[],
                custom: [] as OverlayWidget[],
            },
            isConnected: false,
            isBusy: false,
            isMoving: false,
            isFocused: false,
            isChatting: false,
            focusedWindow: '',
            websocket: null as WebSocket|null,
        };
    },
    actions: {

        /**-------------------------------
         * WEBSOCKET
         * ------------------------------*/

        /**
         * Connects to the websocket server.
         */
        async connectWebsocket() {

            let port = 9002;
            const prop = await GetProp('Socket', 'port');
            if (prop[0]) {
                port = parseInt(prop[0]);
            }

            this.websocket = new WebSocket(`ws://localhost:${port}`);
            this.websocket.onopen = () => {
                console.log('Websocket connected');
                this.isConnected = true;
            };
            this.websocket.onclose = () => {
                if (this.isConnected) {
                    console.log('Websocket disconnected');
                    this.isConnected = false;
                    Application.Quit();
                }
            }
            // On failure
            this.websocket.onerror = () => {
                console.error('Websocket error');
            };
            // On message
            this.websocket.onmessage = (event) => {
                console.log('Websocket message', event.data);
            };
        },

        /**-------------------------------
         * WIDGETS
         * ------------------------------*/

        /**
         * Initializes the default widgets.
         */
        initDefaultWidgets() {
            this.users.push(new User());

            // Default widgets
            window.$app.stores.config.app.overlay.widgets.default.forEach(widget => {
                const w = this.findWidget(widget.name);
                if (w) {
                    w.position = widget.position;
                    w.active = widget.active;
                    w.cfg = Object.assign(w.cfg, widget.cfg);
                }
            });
            console.log('Default widgets initialized', this.widgets.default);

        },

        /**
         * Creates a new widget and adds it to the overlay.
         * 
         * @param id The ID of the widget.
         * @param name The name of the widget.
         * @param position The position of the widget.
         */
        newWidget(name: string, position?: Position) {
            const widget = new OverlayWidget(name, position);
            this.addWidget(widget);
            return widget;
        },

        /**
         * Adds a widget to the overlay.
         * 
         * @param widget The widget to add.
         */
        addWidget(widget: OverlayWidget) {
            this.widgets.custom.push(widget);
        },

        /**
         * Removes a widget from the overlay.
         * 
         * @param widget The widget to remove.
         */
        removeWidget(widget: OverlayWidget) {
            const index = this.widgets.custom.indexOf(widget);
            if (index !== -1) {
                this.widgets.custom.splice(index, 1);
            }
        },

        /**
         * Finds a widget by ID.
         * 
         * @param id The ID of the widget.
         */
        findWidget(name: string): OverlayWidget|undefined {
            const widget = this.widgets.default.find(w => w.name === name || w.name === name);
            if (widget) return widget;
            return this.widgets.custom.find(w => w.name === name || w.name === name);
        },

        /**-------------------------------
         * WINDOW FOCUS
         * ------------------------------*/

        /**
         * Enable click-through for the overlay.
         */
        async blur() {
            this.isFocused = false;
            return Blur();
        },

        /**
         * Disable click-through for the overlay.
         */
        async focus() {
            this.isFocused = true;
            return Focus();
        },

        /**
         * Toggles the focus state.
         */
        async toggleFocus() {
            if (this.isFocused) {
                return this.blur();
            } else {
                return this.focus();
            }
        },

        /**-------------------------------
         * FAKEFOCUS HOOK
         * ------------------------------*/
        
        /**
         * Get all the available window names.
         */
        async getWindowNames() {
            return GetWindowNames();
        },

        /**
         * Start watching for focus changes.
         * 
         * @param name The name of the window to watch.
         */
        async startWatchingFocus(name: string) {
            this.focusedWindow = name;
            return StartWatchingFocus(name);
        },

        /**
         * Stop watching for focus changes.
         */
        async stopWatchingFocus() {
            this.focusedWindow = '';
            return StopWatchingFocus();
        },

        /**-------------------------------
         * STYLES / PLUGINS
         * ------------------------------*/

        /**
         * Loads the overlay styles from the
         * themes directory.
         */
        async loadStyles() {
            const styles = await GetOverlayStyles();
            this.styles = styles.map(style => ({
                Name: style.Name,
                Path: style.Path,
                CSS: DOMPurify.sanitize(style.CSS),
            }));
        },

        /**
         * Loads the overlay plugins from the
         * plugins directory.
         */
        async loadPlugins() {

            // Load all plugins
            const plugins = await LoadPlugins();

            // For each plugin
            plugins.forEach(plugin => {

                // Add the plugin to the collection
                const p = new OverlayPlugin({
                    Name: plugin.Name,
                    Path: plugin.Path,
                    CSS: DOMPurify.sanitize(plugin.CSS),
                    JS: DOMPurify.sanitize(plugin.JS),
                    HTML: DOMPurify.sanitize(plugin.HTML),
                });

                this.plugins.push(plugin);

                // Create new widget
                const widget = this.newWidget(plugin.Name);
                widget.path = p.Path;
                widget.HTML = p.HTML;
                widget.CSS = p.CSS;
                widget.JS = p.JS;

            });
            
        },

        /**
         * Evaluates the custom widgets JS code.
         * This is used to run custom code for the
         * widgets.
         */
        async evalCustomWidgets() {
            this.widgets.custom.forEach((widget: OverlayWidget) => {
                if (widget.active && widget.JS && !widget.evaluated) {
                    try {
                        eval(widget.JS);
                        widget.evaluated = true;
                        console.log(`JS evaluated for widget ${widget.name}`);
                    } catch (e) {
                        console.error(`Error evaluating JS for widget ${widget.name}`, e);
                    }
                }
            });
        },

    },
});