<template>
    <div 
    class="app-window moving"
    :style="{ left: position.x + 'px', top: position.y + 'px', width: position.w + 'px', height: position.h + 'px' }"
    >
        <div class="window-body">
            <slot></slot>
        </div>
        <div class="resize-handle top-left" @mousedown.stop="startResize('top-left')"></div>
        <div class="resize-handle bottom-left" @mousedown.stop="startResize('bottom-left')"></div>
        <div class="resize-handle bottom-right" @mousedown.stop="startResize('bottom-right')"></div>
    </div>
</template>
<script lang="ts">
import Position from '@/models/Position';

export default {
    name: 'AppWindow',
    props: {
        position: {
            type: Position,
            required: true,
        }
    },
    data() {
        return {
            active: false,
            dragging: false,
            offset: { x: 0, y: 0 },
            resizing: false,
            resizeDirection: '',
        };
    },
    methods: {
        startResize(direction: string) {
            this.resizing = true;
            this.resizeDirection = direction;
            document.addEventListener('mousemove', this.onresize);
            document.addEventListener('mouseup', this.stopResize);
        },
        stopResize() {
            this.resizing = false;
            document.removeEventListener('mousemove', this.onresize);
            document.removeEventListener('mouseup', this.stopResize);
        },
        onresize(event: MouseEvent) {

            const parent = this.$el.parentNode as HTMLElement;
            const parentRect = parent.getBoundingClientRect();
            let newWidth = this.position.w;
            let newHeight = this.position.h;
            let newX = this.position.x;
            let newY = this.position.y;

            if (this.resizeDirection.includes('right')) {
                newWidth = event.clientX - this.position.x;
            }
            if (this.resizeDirection.includes('left')) {
                newWidth = this.position.w + (this.position.x - event.clientX);
                newX = event.clientX;
            }
            if (this.resizeDirection.includes('bottom')) {
                newHeight = event.clientY - this.position.y;
            }
            if (this.resizeDirection.includes('top')) {
                newHeight = this.position.h + (this.position.y - event.clientY);
                newY = event.clientY;
            }

            // Ensure the widget stays within the parent's boundaries
            newWidth = Math.max(100, Math.min(newWidth, parentRect.width - newX));
            newHeight = Math.max(100, Math.min(newHeight, parentRect.height - newY));

            this.$emit('onresize', { x: newX, y: newY, w: newWidth, h: newHeight });

        }
    },
    mounted() {
    },
}
</script>
<style lang="scss" scoped>
.app-window {
    position: fixed;
    background: #fff;

    &.moving {
        z-index: 100;

        .resize-handle {
            position: absolute;
            width: 8px;
            height: 8px;
            z-index: 10;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
            background: yellow;

            &.top-left {
                top: -4px;
                left: -4px;
                cursor: nwse-resize;
            }
            &.top-right {
                top: -4px;
                right: -4px;
                cursor: nesw-resize;
            }
            &.bottom-left {
                bottom: -4px;
                left: -4px;
                cursor: nesw-resize;
            }
            &.bottom-right {
                bottom: -4px;
                right: -4px;
                cursor: nwse-resize;
            }
        }
    }
}
</style>