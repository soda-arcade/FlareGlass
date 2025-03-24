<template>
    <div v-if="$app.stores.overlay.isConnected" id="overlay" :style="{opacity: config.opacity}">
        <OverlayChat v-if="$app.stores.overlay.widgets.default[0].active" />
        <OverlayGuests v-if="$app.stores.overlay.widgets.default[1].active"  />
        <OverlayPads v-if="$app.stores.overlay.widgets.default[2].active"  />

        <template v-for="widget in $app.stores.overlay.widgets.custom">
            <OverlayWidgetComponent 
            v-if="widget.active"
            :widget="widget"
            >
                <div class="widget-css" v-html="`<style>${widget.CSS}</style>`"></div>
                <div class="widget-html" v-html="widget.HTML"></div>
            </OverlayWidgetComponent>
        </template>
    </div>
    <div v-else class="window window-connecting">
        <div class="window-content">
            <div class="window-body font-primary">
                Connecting to FlareCast... &nbsp; <span class="window-countdown">Aborting in {{ countdown }}</span>
            </div>
        </div>
    </div>

    <AppModal ref="settings" />
</template>
<script lang="ts">
import { Application, Events } from "@wailsio/runtime";

import OverlayWidgetComponent from './OverlayWidgetComponent.vue';
import OverlayChat from './widgets/OverlayChat.vue';
import OverlayGuests from './widgets/OverlayGuests.vue';
import OverlayPads from './widgets/OverlayPads.vue';

import AppModal from "../common/AppModal.vue";

export default {
    name: 'OverlayView',
    components: {
        OverlayWidgetComponent,
        OverlayChat,
        OverlayGuests,
        OverlayPads,
        AppModal
    },
    data() {
        return {
            countdown: 5,
            timer: null as any,
        };
    },
    computed: {
        config() {
            return this.$app.stores.config.app.overlay;
        }
    },
    methods: {
        getPlugin(pluginName: string) {
            return this.$app.stores.overlay.plugins.find((plugin: any) => plugin.name === pluginName);
        }
    },
    mounted() {

        Events.On("hotkey:move", (data: any) => {
            console.log('Move hotkey pressed');
            if (window.$app.stores.overlay.isBusy || window.$app.stores.overlay.isChatting) return;
            window.$app.stores.overlay.toggleFocus();
            window.$app.stores.overlay.isMoving = !window.$app.stores.overlay.isMoving;
        });

        Events.On("hotkey:menu", (data: any) => {
            console.log('Menu hotkey pressed');
            (this.$refs.settings as any).open();
        });

        // for each custom widget, evaluate the JS
        this.$app.stores.overlay.evalCustomWidgets();

        // start the countdown
        this.$app.stores.overlay.blur();
        this.$app.stores.overlay.connectWebsocket();
        this.timer = setInterval(() => {
            this.countdown--;
            if (this.$app.stores.overlay.isConnected) {
                clearInterval(this.timer);
            } else {
                this.$app.stores.overlay.connectWebsocket();
            }
            if (this.countdown <= 0 && !this.$app.stores.overlay.isConnected) {
                clearInterval(this.timer);
                Application.Quit();
            }
        }, 2000);

    },
}
</script>
<style lang="scss" scoped>
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.2s ease;
    color: #FFF;
}

.widget-html {
    width: 100%;
    height: 100%;
}

.window-connecting {
    max-width: 350px;
    max-height: 48px;
}

.window-countdown {
    color: $color-tertiary;
}
</style>