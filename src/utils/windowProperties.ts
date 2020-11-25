import Vue from "vue";
// import throttle from "lodash/throttle";

const WindowProperties = new Vue({
  data() {
    return {
      resizeWidth: 0,
      resizeHeight: 0,
      isFocused: document.hasFocus()
    };
  },
  created() {
    this.resizeWidth = window.innerWidth;
    this.resizeHeight = window.innerHeight;

    // let debouncedResize = null;

    // debouncedResize = throttle(this.onResize, 70);
    window.addEventListener("resize", this.onResize);
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
    }
  }
});

export default WindowProperties;
