declare module "*.vue" {
  import { DefineComponent } from "@vue/runtime-dom";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue" {
  import { CompatVue } from "@vue/runtime-dom";
  const Vue: CompatVue;
  export default Vue;
  export * from "@vue/runtime-dom";
}
