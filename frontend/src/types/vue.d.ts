// vue.d.ts
import Vue from '@/_globals/types/vue';
import { ComponentCustomProperties } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, replacements?: Record<string, string | number> | string[]) => string;
    $route: {
      params: Record<string, string>;
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $refs: {
      [key: string]: Vue | Element | Vue[] | Element[];
    };
  }
}