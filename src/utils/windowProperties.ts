import { reactive } from "vue";
// import throttle from "lodash/throttle";

const data = reactive({
  resizeWidth: 0,
  resizeHeight: 0,
  isFocused: document.hasFocus(),
  lastClickedElement: null as HTMLElement | null,
  isMobileWidth: false,
});

data.resizeWidth = window.innerWidth;
data.resizeHeight = window.innerHeight;
data.isMobileWidth = window.innerWidth <= 950;

function onResize() {
  data.resizeWidth = window.innerWidth;
  data.resizeHeight = window.innerHeight;
  data.isMobileWidth = window.innerWidth <= 950;
}
function onMouseDown(event: MouseEvent) {
  data.lastClickedElement = event.target as any;
}

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("resize", onResize);
window.addEventListener("focusin", (event) => {
  data.lastClickedElement = event.target as any;
});
window.addEventListener("focus", () => {
  data.isFocused = true;
});
window.addEventListener("blur", () => {
  data.isFocused = false;
});

export function useWindowProperties() {
  return { ...data };
}
