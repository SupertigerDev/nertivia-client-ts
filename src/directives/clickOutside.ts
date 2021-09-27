const directive: any = {
  beforeMount(el: any, binding: any, vnode: any) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener("mousedown", el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.body.removeEventListener("mousedown", el.clickOutsideEvent);
  },
};
export default directive;
