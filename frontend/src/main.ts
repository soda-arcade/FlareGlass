import '@/styles/css/main.css';
import '@/styles/css/flare.css';

// Import global configurations
import {initOverlay} from '@/app/overlay';
import components from './utils/components';

// Vue
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ConfirmDialog from 'vuejs-confirm-dialog';
import OverlayView from './components/overlay/OverlayView.vue';

// Create the Vue app
const app = createApp(OverlayView)
.use(createPinia())
.use(ConfirmDialog)
.use(components);

// Initialize the Vue 3 app
async function initializeVueApp() {

    // Initialize overlay window object
    await initOverlay();

    // Make app available in Vue components
    app.config.globalProperties.$app = window.$app;

    // Mount the app
    app.mount('#overlay-app').$nextTick(() => {
        document.getElementById('loader')?.remove();
        document.getElementById('arcade-install')?.remove();
        document.body.classList.remove('body-fill');
        window.$app.helpers.log('App is ready!');
    });

}

// Initialize the app
initializeVueApp();