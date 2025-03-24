import { defineStore } from 'pinia';
import Config from '../models/Config';
import Position from '../models/Position';
import { RegisterHotkey } from '@bindings/services/hotkeyservice';

/**
 * Pinia store template.
 */
export const useConfigStore = defineStore('configStore', {
    state: () => {
        return {
            app: new Config(),
            saveCooldownTimer: null as NodeJS.Timeout | null,
            saveCooldown: 1000,
        };
    },
    actions: {

        /**
         * Save the config to local storage.
         */
        async save() {
            if (this.saveCooldownTimer) clearTimeout(this.saveCooldownTimer);
            this.saveCooldownTimer = setTimeout(() => {
                localStorage.setItem('config', JSON.stringify(this.app));
            }, this.saveCooldown);
        },

        /**
         * Load the config from local storage.
         */
        async load() {
            const config = localStorage.getItem('config');
            if (config) {
                try {
                    this.app = new Config(JSON.parse(config));
                }
                catch (e) {
                    console.error('Failed to load config from local storage.', e);
                    this.app = new Config();
                }
            }
        },

        /**
         * Reset the config to default values.
         */
        async reset() {
            this.app = new Config();
            this.save();
        },

        /**
         * Save the overlay widget position.
         * 
         * @param widgetId Widget ID.
         * @param position Widget position.
         * @param active Widget active state.
         */
        async saveOverlayWidget(name: string, position: Position, active: boolean, cfg: any) {
            const widget = this.app.overlay.widgets.default.find(w => w.name === name) || this.app.overlay.widgets.custom.find(w => w.name === name);
            if (!widget) {
                this.app.overlay.widgets.custom.push({
                    name: name,
                    position: position,
                    active: active,
                    cfg: cfg
                });
            } else {
                widget.position = position;
                widget.active = active;
            }

            this.save();
        },

        /**
         * Registers the hotkeys on the backend.
         */
        async registerHotkeys() {
            try {
                await RegisterHotkey('hotkey:chat', this.app.hotkeys['hotkey:chat'].modifiers, this.app.hotkeys['hotkey:chat'].key, 'hotkey:chat');
                await RegisterHotkey('hotkey:opacity:in', this.app.hotkeys['hotkey:opacity:in'].modifiers, this.app.hotkeys['hotkey:opacity:in'].key, 'hotkey:opacity:in');
                await RegisterHotkey('hotkey:opacity:out', this.app.hotkeys['hotkey:opacity:out'].modifiers, this.app.hotkeys['hotkey:opacity:out'].key, 'hotkey:opacity:out');
                await RegisterHotkey('hotkey:zoom:out', this.app.hotkeys['hotkey:zoom:out'].modifiers, this.app.hotkeys['hotkey:zoom:out'].key, 'hotkey:zoom:out');
                await RegisterHotkey('hotkey:zoom:in', this.app.hotkeys['hotkey:zoom:in'].modifiers, this.app.hotkeys['hotkey:zoom:in'].key, 'hotkey:zoom:in');
                await RegisterHotkey('hotkey:menu', this.app.hotkeys['hotkey:menu'].modifiers, this.app.hotkeys['hotkey:menu'].key, 'hotkey:menu');
                await RegisterHotkey('hotkey:move', this.app.hotkeys['hotkey:move'].modifiers, this.app.hotkeys['hotkey:move'].key, 'hotkey:move');
            } catch (e) {
                window.$app.helpers.log('Hotkeys already registered.');
            }
        },

        setTheme() {
            const style = document.getElementById('custom-css');
            if (!style) {
                return;
            }

            if (this.app.overlay.theme !== 'default') {
                style.innerHTML = window.$app.stores.overlay.styles[parseInt(this.app.overlay.theme)].CSS;
            } else {
                style.innerHTML = '';
            }
        }

    },
});