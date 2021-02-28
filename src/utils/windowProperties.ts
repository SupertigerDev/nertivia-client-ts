import Vue from "vue";
// import throttle from "lodash/throttle";

declare interface BaseComponentData {
  resizeWidth: number;
  resizeHeight: number;
  isFocused: boolean;
  lastClickedElement: null | Element;
}

const WindowProperties = new Vue({
  data(): BaseComponentData {
    return {
      resizeWidth: 0,
      resizeHeight: 0,
      isFocused: document.hasFocus(),
      lastClickedElement: null
    };
  },
  created() {
    this.resizeWidth = window.innerWidth;
    this.resizeHeight = window.innerHeight;

    // let debouncedResize = null;

    // debouncedResize = throttle(this.onResize, 70);
    window.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("focusin", event => {
      this.lastClickedElement = event.target as any;
    });
    window.addEventListener("focus", () => {
      this.isFocused = true;
    });
    window.addEventListener("blur", () => {
      this.isFocused = false;
    });
  },
  methods: {
    onResize() {
      this.resizeWidth = window.innerWidth;
      this.resizeHeight = window.innerHeight;
    },
    onMouseDown(event: MouseEvent) {
      this.lastClickedElement = event.target as any;
    }
  }
});

export default WindowProperties;
