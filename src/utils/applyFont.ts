import fonts from "./fonts.json";

export function applyFont(id: string) {
  const font = fonts[id];
  if (!font) return;

  localStorage["font"] = id;
  if (font.stylesheet) {
    // add stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = font.stylesheet;
    document.head.appendChild(link);
  }

  const style = document.createElement("style");
  style.id = "font-pick";
  style.innerHTML = `
  * {
  font-family: ${font.css};
  }
  `;

  const el = document.getElementById("font-pick");
  if (el) {
    el.replaceWith(style);
    return;
  }
  document.head.appendChild(style);

  // document.body.style.fontFamily = font.css
}
