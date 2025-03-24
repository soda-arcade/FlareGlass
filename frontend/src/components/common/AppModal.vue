<template>
    <div v-if="active" class="modal-overlay" :style="{ opacity: $app.stores.config.app.overlay.opacity}">
        <div class="modal-container">
            <div class="modal window raised has-sidebar">
                <div class="window-sidebar">
                    <div class="window-sidebar-item" @click="setGroup('general')" :class="{ active: group === 'general' }">
                        <i class="fas fa-cog"></i>
                        <span>General</span>
                    </div>
                    <div class="window-sidebar-item" @click="setGroup('widgets')" :class="{ active: group === 'widgets' }">
                        <i class="fas fa-plug"></i>
                        <span>Widgets</span>
                    </div>
                    <div class="window-sidebar-item" @click="setGroup('hotkeys')" :class="{ active: group === 'hotkeys' }">
                        <i class="fas fa-keyboard"></i>
                        <span>Hotkeys</span>
                    </div>
                </div>
                <div class="window-content">
                    <div class="window-header font-primary">
                        Settings
                    </div>
                    <div class="window-body font-primary">
                        <div v-if="group === 'general'">
                            <form class="form">
                                <FormSelect
                                label="Theme"
                                name="theme"
                                :value="config.overlay.theme"
                                :options="themes"
                                @oninput="setTheme($event)"
                                >
                                    Select the custom theme for the overlay.
                                </FormSelect>

                                <div class="form-group">
                                    <label for="username">Opacity</label>
                                    <div class="form-range">
                                        <input 
                                        type="range" 
                                        id="username" 
                                        name="username" 
                                        min="0" 
                                        max="100"
                                        :value="config.overlay.opacity * 100"
                                        @input="config.overlay.opacity = ($event.target as any).value / 100"
                                        >
                                    </div>
                                    <div class="form-help">
                                        Adjust the transparency of the overlay.
                                    </div>
                                </div>

                                <FormSelect
                                label="Display"
                                name="theme"
                                :value="config.overlay.display"
                                :options="displays"
                                @oninput="setDisplay($event)"
                                >
                                    Select the display to show the overlay on.
                                </FormSelect>
                            </form>
                        </div>
                        <div v-else-if="group === 'widgets'">
                            Here you can customize all the various overlay widgets.
                            <div class="widgets">
                                <AppDrawer title="Chat" startOpen>
                                    <FormSelect
                                    label="Position"
                                    name="chatPosition"
                                    :value="defaultWidgets[0].position.fixed ? defaultWidgets[0].position.fixed : 'custom'"
                                    :options="positions"
                                    @oninput="setWidgetPosition(defaultWidgets[0], $event)"
                                    />
                                    <FormToggle 
                                    label="Enabled"
                                    :value="defaultWidgets[0].active"
                                    @oninput="defaultWidgets[0].active = $event"
                                    name="chatEnabled"
                                    />
                                    <FormToggle 
                                    label="Show Message History"
                                    :value="defaultWidgets[0].cfg.showHistory"
                                    @oninput="defaultWidgets[0].cfg.showHistory = $event"
                                    name="chatShowHistory"
                                    />
                                </AppDrawer>
                                <AppDrawer title="Guests" startOpen>
                                    <FormSelect
                                    label="Position"
                                    name="guestsPosition"
                                    :value="defaultWidgets[1].position.fixed ? defaultWidgets[1].position.fixed : 'custom'"
                                    :options="positions"
                                    @oninput="setWidgetPosition(defaultWidgets[1], $event)"
                                    />
                                    <FormToggle 
                                    label="Enabled"
                                    :value="defaultWidgets[1].active"
                                    @oninput="defaultWidgets[1].active = $event"
                                    name="guestsEnabled"
                                    />
                                    <FormToggle 
                                    label="Show Latency"
                                    :value="defaultWidgets[1].cfg.showLatency"
                                    @oninput="defaultWidgets[1].cfg.showLatency = $event"
                                    name="guestsShowLatency"
                                    />
                                </AppDrawer>
                                <AppDrawer title="Gamepads" startOpen>
                                    <FormSelect
                                    label="Position"
                                    name="padsPosition"
                                    :value="defaultWidgets[2].position.fixed ? defaultWidgets[2].position.fixed : 'custom'"
                                    :options="positions"
                                    @oninput="setWidgetPosition(defaultWidgets[2], $event)"
                                    />
                                    <FormToggle 
                                    label="Enabled"
                                    :value="defaultWidgets[2].active"
                                    @oninput="defaultWidgets[2].active = $event"
                                    name="gamepadsEnabled"
                                    />
                                    <FormToggle 
                                    label="Show Hotseat Time"
                                    :value="defaultWidgets[2].cfg.showHotseatTime"
                                    @oninput="defaultWidgets[2].cfg.showHotseatTime = $event"
                                    name="gamepadsShowHotseatTime"
                                    />
                                </AppDrawer>

                                <template v-for="widget in customWidgets">
                                    
                                    <AppDrawer :title="widget.name" startOpen>
                                        <FormToggle 
                                        label="Enabled"
                                        :value="widget.active"
                                        @oninput="widget.active = $event; console.log($event)"
                                        :name="`${widget.name}-enabled`"
                                        />
                                    </AppDrawer>

                                </template>
                            </div>
                        </div>
                        <div v-else-if="group === 'hotkeys'">
                            <div v-for="(hotkey, index) in $app.stores.config.app.hotkeys" class="hotkey-group">
                                <div class="hotkey">
                                    <div class="hotkey-label">{{ getHotkeyName(index) }}</div>
                                    <div class="form-help">
                                        {{ getHotkeyString(hotkey) }}
                                    </div>
                                </div>
                                <div class="btn btn-secondary" @click="setHotkey">Change</div>
                            </div>
                        </div>
                    </div>
                    <div class="window-footer font-primary">
                        <div class="btn btn-secondary" @click="close">Cancel</div>
                        <div class="btn btn-primary" @click="save">Submit</div>
                    </div>
                </div>

                <div class="modal-close">
                    <div class="btn btn-round" @click="close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <HotkeyDialog ref="hotkeyDialog" />
</template>
<script lang="ts">
import { GetMonitors, MoveMainWindowToMonitor } from '@bindings/services/windowservice';
import Config from '@/models/Config';
import OverlayWidget from '@/models/overlay/OverlayWidget';
import AppDrawer from './AppDrawer.vue';
import FormToggle from '../form/FormToggle.vue';
import FormSelect from '../form/FormSelect.vue';
import HotkeyDialog from '../Dialogs/HotkeyDialog.vue';

export default {
    name: 'AppModal',
    components: {
        AppDrawer,
        FormToggle,
        FormSelect,
        HotkeyDialog,
    },
    setup() {

        // Name is label, value is the index
        const styles = window.$app.stores.overlay.styles.map((style: any, index: number) => {
            return {
                label: style.Name,
                value: index,
            } as any;
        });

        return {
            positions: [
                { label: 'Top Left', value: 'top-left' },
                { label: 'Top Right', value: 'top-right' },
                { label: 'Top Center', value: 'top-center' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
                { label: 'Bottom Center', value: 'bottom-center' },
                { label: 'Custom', value: 'custom' },
            ],
            themes: [
                { label: 'Default', value: 'default' },
                ...styles,
            ],
        };
    },
    data() {
        return {
            active: false,
            group: 'general',
            defaultWidgets: [] as OverlayWidget[],
            customWidgets: [] as OverlayWidget[],
            config: new Config(),
            displays: [] as { label: string, value: any}[],
        };
    },
    computed: {
        
    },
    methods: {
        open() {

            this.getMonitors();

            // Clone the config
            this.config = this.$app.stores.config.app.clone();
            // Clone the default widgets
            this.defaultWidgets = this.$app.stores.overlay.widgets.default.map((w: OverlayWidget) => w.clone());
            // Clone the custom widgets
            this.customWidgets = this.$app.stores.overlay.widgets.custom.map((w: OverlayWidget) => w.clone());

            this.$app.stores.overlay.isBusy = true;
            this.$app.stores.overlay.focus();
            this.active = true;
        },
        close() {
            this.active = false;
            this.$app.stores.overlay.isBusy = false;
            this.$app.stores.overlay.blur();
        },
        setGroup(group: string) {
            this.group = group;
        },
        setWidgetPosition(widget: OverlayWidget, position: string) {
            if (position === 'custom') {
                widget.position.fixed = null;
            } else {
                widget.position.fixed = position;
            }
        },
        setTheme(theme: string) {
            this.config.overlay.theme = theme;
            
            const style = document.getElementById('custom-css');
            if (!style) {
                return;
            }

            if (theme !== 'default') {
                style.innerHTML = window.$app.stores.overlay.styles[theme].CSS;
            } else {
                style.innerHTML = '';
            }
        },
        async setDisplay(display: any) {
            this.config.overlay.display = parseInt(display);
            MoveMainWindowToMonitor(display).then(() => {
                console.log(`Moved to monitor ${display}`);
            }).catch((err: any) => {
                console.error(err);
            });
        },
        save() {
            this.$app.stores.config.app = this.config.clone();
            this.$app.stores.overlay.widgets.default = this.defaultWidgets.map((w: OverlayWidget) => w.clone());
            this.$app.stores.overlay.widgets.custom = this.customWidgets.map((w: OverlayWidget) => w.clone());
            this.$app.stores.overlay.evalCustomWidgets();
            this.active = false;
            this.$app.stores.overlay.isBusy = false;
            this.$app.stores.overlay.blur();
            this.$app.stores.config.save();
        },
        async getMonitors() {
            this.displays = [];
            GetMonitors().then((monitors: any) => {
                monitors.forEach((monitor, index) => {
                    this.displays.push({ label: monitor.Name, value: index });
                });
            }).catch((err: any) => {
                console.error(err);
            });
        },
        getHotkeyName(hotkey: string) {
            return hotkey.split(':').slice(1).join(' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
        },
        getHotkeyString(hotkey: { modifiers: number[], key: number, event: string }) {
            return hotkey.modifiers.map((m: number) => this.$app.helpers.getKeyName(m)).join(' + ') + ' + ' + this.$app.helpers.getKeyName(hotkey.key);
        },
        setHotkey() {
            (this.$refs.hotkeyDialog as any).open();
        },
    },
    mounted() {

    },
}
</script>
<style lang="scss" scoped>
.modal-overlay {
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container {
    width: 100%;
    height: 100%;
    max-height: 480px;
    max-width: 640px;
    scrollbar-color: var($color-tertiary) var($color-primary) !important;
}

.modal {
    width: 100%;
    height: 100%;
    position: relative;

    &.has-sidebar {
        display: flex;

        .modal-content {
            flex: 1;
        }
    }

    .modal-close {
        position: absolute;
        top: -12px;
        right: -12px;
        cursor: pointer;
    }
}

.widgets {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-help {
    color: $color-tertiary;
    margin-top: 0.25rem;
}

.hotkey-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;

    &:nth-child(odd) {
        background: rgba(255, 255, 255, 0.05);
    }
}
</style>