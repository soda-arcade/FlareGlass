import AppLoader from "./AppLoader.vue";
import AppWindow from "./AppWindow.vue";

export default {
    AppLoader,
    AppWindow
};

declare module 'vue' {
    export interface GlobalComponents {
        AppLoader: typeof AppLoader;
        AppWindow: typeof AppWindow;
    }
}