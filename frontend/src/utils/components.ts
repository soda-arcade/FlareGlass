import { App } from 'vue';
import common from '@/components/common';

export default {
    install(app: App) {
        // Register common components
        for (const key in common) {
            app.component(key, common[key]);
        }
    }
};