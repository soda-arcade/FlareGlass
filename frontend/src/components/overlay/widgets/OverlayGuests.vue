<template>
    <OverlayWidgetComponent :widget="widget">
        <div id="widget-guests" class="panel">
            Test
        </div>
    </OverlayWidgetComponent>
</template>
<script lang="ts">
import OverlayWidgetComponent from '../OverlayWidgetComponent.vue';

export default {
    name: 'OverlayGuests',
    components: {
        OverlayWidgetComponent,
    },
    data() {
        return {
        };
    },
    computed: {
        widget() {
            return this.$app.stores.overlay.widgets.default[1];
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