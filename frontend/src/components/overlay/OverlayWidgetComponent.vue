<template>
    <div 
    class="widget" 
    :class="`${ widget.position.fixed ? `fixed ${widget.position.fixed}` : `` } ${ $app.stores.overlay.isMoving ? `moving` : `` }`"
    :style="position"
    >
        <div class="widget-content" @mousedown="startMoving">
            <slot></slot>
        </div>
        <div class="resize-handle top-left" @mousedown="startResizing('top-left')"></div>
        <div class="resize-handle top-right" @mousedown="startResizing('top-right')"></div>
        <div class="resize-handle bottom-left" @mousedown="startResizing('bottom-left')"></div>
        <div class="resize-handle bottom-right" @mousedown="startResizing('bottom-right')"></div>
    </div>
</template>
<script lang="ts">
import OverlayWidget from '@/models/overlay/OverlayWidget';

export default {
    name: 'OverlayWidgetComponent',
    props: {
        widget: {
            type: OverlayWidget,
            required: true
        }
    },
    data() {
        return {
            offset: { x: 0, y: 0 },
            resizing: false,
            resizeDirection: null
        };
    },
    computed: {
        moveMode() {
            return this.$app.stores.overlay.isMoving;
        },

        position() {
            return !this.widget.position.fixed 
            ? `position: fixed; top: ${this.widget.position.y}px; left: ${this.widget.position.x}px;`
              + `${this.widget.position.w ? `width: ${this.widget.position.w}px` : ``}; ${this.widget.position.h ? `height: ${this.widget.position.h}px` : ``};`
            : `position: absolute; ${this.widget.position.w ? `width: ${this.widget.position.w}px` : ``}; ${this.widget.position.h ? `height: ${this.widget.position.h}px` : ``};`;
        }
    },
    methods: {
        /**
         * Start moving the widget
         * 
         * @param $event
         */
        startMoving(event: MouseEvent) {
            if (!this.moveMode) {
                return;
            }

            // Get widget's current position
            const widgetRect = this.$el.getBoundingClientRect();
            this.widget.position.x = widgetRect.left;
            this.widget.position.y = widgetRect.top;

            // Register mouse move event
            this.widget.position.fixed = null;
            this.offset.x = event.clientX - this.widget.position.x;
            this.offset.y = event.clientY - this.widget.position.y;
            document.addEventListener('mousemove', this.moveWidget);
            document.addEventListener('mouseup', this.stopMoving);
        },

        /**
         * Move the widget
         * 
         * @param $event
         */
        moveWidget(event: MouseEvent) {
            let newX = event.clientX - this.offset.x;
            let newY = event.clientY - this.offset.y;
            const parent = this.$el.parentNode as HTMLElement;
            const parentRect = parent.getBoundingClientRect();

            // Ensure the widget stays within the parent's boundaries
            newX = Math.max(0, Math.min(newX, parentRect.width - this.widget.position.w));
            newY = Math.max(0, Math.min(newY, parentRect.height - this.widget.position.h));

            this.widget.position.x = newX;
            this.widget.position.y = newY;
        },

        /**
         * Stop moving the widget
         * 
         * @param $event
         */
        stopMoving(event: MouseEvent) {
            document.removeEventListener('mousemove', this.moveWidget);
            document.removeEventListener('mouseup', this.stopMoving);

            this.saveChanges();
        },

        /**
         * Start resizing the widget
         * 
         * @param $event
         */
        startResizing(direction: string) {
            if (!this.moveMode) {
                return;
            }
            this.resizing = true;
            this.resizeDirection = direction;

            document.addEventListener('mousemove', this.onResize);
            document.addEventListener('mouseup', this.stopResizing);
        },

        /**
         * Resize the widget
         * 
         * @param $event
         */
        onResize(event: MouseEvent) {
            if (!this.resizing) {
                return;
            }

            let newWidth = this.widget.position.w;
            let newHeight = this.widget.position.h;
            let newX = this.widget.position.x;
            let newY = this.widget.position.y;

            if (this.resizeDirection.includes('left')) {
                newWidth = this.widget.position.w + (this.widget.position.x - event.clientX);
                newX = event.clientX;
            }

            if (this.resizeDirection.includes('right')) {
                newWidth = event.clientX - this.widget.position.x;
            }

            if (this.resizeDirection.includes('top')) {
                newHeight = this.widget.position.h + (this.widget.position.y - event.clientY);
                newY = event.clientY;
            }

            if (this.resizeDirection.includes('bottom')) {
                newHeight = event.clientY - this.widget.position.y;
            }

            this.widget.position.w = Math.max(100, newWidth);
            this.widget.position.h = Math.max(100, newHeight);
            this.widget.position.x = newX;
            this.widget.position.y = newY;
        },

        /**
         * Stop resizing the widget
         * 
         * @param $event
         */
        stopResizing(event: MouseEvent) {
            this.resizing = false;
            this.resizeDirection = null;

            document.removeEventListener('mousemove', this.onResize);
            document.removeEventListener('mouseup', this.stopResizing);

            this.saveChanges();
        },

        /**
         * Save changes to the widget
         */
        saveChanges() {
            this.$app.stores.config.saveOverlayWidget(this.widget.name, this.widget.position, this.widget.active, this.widget.cfg);
        }
    },
    mounted() {
    },
}
</script>
<style lang="scss" scoped>
.widget {
    .widget-content {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .resize-handle {
        display: none;
    }

    &.fixed {
        &.top-left {
            top: 0;
            left: 0;
        }

        &.top-right {
            top: 0;
            right: 0;
        }

        &.bottom-left {
            bottom: 0;
            left: 0;
        }

        &.bottom-right {
            bottom: 0;
            right: 0;
        }

        &.top-center {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        &.bottom-center {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    &.moving {
        cursor: move;
        border: solid 2px var(--color-tertiary);
        user-select: none;

        .resize-handle {
            display: block;
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: var(--color-tertiary);
            border-radius: 50%;

            &.top-left {
                top: -5px;
                left: -5px;
                cursor: nwse-resize;
            }

            &.top-right {
                top: -5px;
                right: -5px;
                cursor: nesw-resize;
            }

            &.bottom-left {
                bottom: -5px;
                left: -5px;
                cursor: nesw-resize;
            }

            &.bottom-right {
                bottom: -5px;
                right: -5px;
                cursor: nwse-resize;
            }
        }
    }
}
</style>