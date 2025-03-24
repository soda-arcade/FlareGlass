<template>
    <OverlayWidgetComponent :widget="widget">
        <div id="widget-chat">
            <input 
            ref="input" 
            class="chat-input"
            type="text"
            @blur="onBlur"
            @keyup.enter="sendMessage"
            :style="{display: (isFocused || $app.stores.overlay.isMoving) ? 'block' : 'none'}"
            >

            <div v-if="widget.cfg?.showHistory && (isFocused || $app.stores.overlay.isMoving)" class="panel message-history">
                <template v-for="message in messages" :key="message.id">
                </template>
            </div>

            <div v-if="bubbles.length > 0" ref="bubbles" class="bubbles">
                <template v-for="bubble in bubbles" :key="bubble.id">
                    
                </template>
            </div>
        </div>
    </OverlayWidgetComponent>
</template>
<script lang="ts">
import OverlayWidgetComponent from '../OverlayWidgetComponent.vue';
import { Events } from "@wailsio/runtime";

export default {
    name: 'OverlayChat',
    components: {
        OverlayWidgetComponent,
    },
    data() {
        return {
            isFocused: false,
            messages: [],
            bubbles: [],
        };
    },
    computed: {
        widget() {
            return this.$app.stores.overlay.widgets.default[0];
        }
    },
    methods: {
        onFocus() {
            if (window.$app.stores.overlay.isBusy || window.$app.stores.overlay.isMoving) return;
            window.$app.stores.overlay.isChatting = !window.$app.stores.overlay.isChatting;
            if (!this.isFocused) {
                window.$app.stores.overlay.focus();
                this.isFocused = true;
                setTimeout(() => {
                    (this.$refs.input as HTMLInputElement).focus();
                    (this.$refs.input as HTMLInputElement).focus();
                }, 200);
            } else {
                (this.$refs.input as HTMLInputElement).blur();
            }
        },
        onBlur() {
            if (window.$app.stores.overlay.isBusy || window.$app.stores.overlay.isMoving) return;
            window.$app.stores.overlay.isChatting = false;
            this.isFocused = false;
            window.$app.stores.overlay.blur();
        },
        sendMessage() {
        },
    },
    mounted() {
        Events.On("hotkey:chat", this.onFocus);
    },
    beforeUnmount() {
        Events.Off("hotkey:chat");
    }
}
</script>
<style lang="scss" scoped>
#widget-chat {
    width: 100%;
    height: 100%;
}

input {
    outline: none !important;
}
</style>