/// <reference types="vite/client" />

interface ImportMeta {
  env: Record<string, unknown>
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}