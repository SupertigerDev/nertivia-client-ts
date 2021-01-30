const directive: any = {
  bind: function(el: any, binding: any, vnode: any) {
    el.clickOutsideEvent = function(event: any) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        const expression = binding.expression || binding.value;
        vnode.context[expression](event);
      }
    };
    document.body.addEventListener("mousedown", el.clickOutsideEvent);
  },
  unbind: function(el: any) {
    document.body.removeEventListener("mousedown", el.clickOutsideEvent);
  }
};
export default directive;
