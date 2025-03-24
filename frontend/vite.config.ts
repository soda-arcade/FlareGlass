import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@globals": path.resolve(__dirname, "src/_globals"),
      "@bindings": path.resolve(__dirname, "bindings/FlareCast/flare/"),
    },
  },
  css: {
    preprocessorOptions: {
        scss: {
            additionalData: `
                @import "@/styles/scss/flare.scss";
            `,
        },
    },
  },
  esbuild: {
    tsconfigRaw: `{
      "compilerOptions": {
        "noImplicitThis": false
      }
    }`,
  },
})