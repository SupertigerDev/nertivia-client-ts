import { applyPublicTheme } from "@/services/exploreService";
import { getTheme } from "@/services/themeService";

export async function applyTheme(id: string, css?: string) {
  if (!css) {
    let theme = await getTheme(id).catch(() => {
      //
    });
    if (!theme) theme = await applyPublicTheme(id);
    if (!theme) return;
    css = theme.css;
  }
  localStorage["themeID"] = id;

  const styleEl = document.createElement("style");
  styleEl.classList.add("theme-" + id);
  styleEl.id = "theme";
  styleEl.innerHTML = css;

  const currentStyle = document.getElementById("theme");
  if (currentStyle) {
    currentStyle.outerHTML = styleEl.outerHTML;
    return;
  }
  document.head.appendChild(styleEl);
}
export function unapplyTheme() {
  const element = document.getElementById("theme");
  delete localStorage["themeID"];
  if (!element) return;
  element.parentNode?.removeChild(element);
}
