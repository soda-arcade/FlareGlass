<template>
    <OverlayWidgetComponent :widget="widget">
        OverlayPads
    </OverlayWidgetComponent>
</template>
<script lang="ts">
import OverlayWidgetComponent from '../OverlayWidgetComponent.vue';

export default {
    name: 'OverlayPads',
    components: {
        OverlayWidgetComponent,
    },
    data() {
        return {
        };
    },
    computed: {
        widget() {
            return this.$app.stores.overlay.widgets.default[2];
        }
    },
    methods: {
        
    },
    mounted() {
    },
}
</script>
<style lang="scss" scoped>
</style>