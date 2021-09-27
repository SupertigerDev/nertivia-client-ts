import defaultTheme from "@/utils/defaultTheme.json";

function findRoot(): CSSStyleRule | undefined {
  const styleSheetArr: CSSStyleSheet[] = [].slice.call(document.styleSheets);
  for (let i = 0; i < styleSheetArr.length; i++) {
    const styleSheet = styleSheetArr[i];
    if (styleSheet.href) continue;
    let rule: any = null;
    try {
      rule = [].slice
        .call(styleSheet.rules)
        .find((r: CSSStyleRule) => r.selectorText === ":root");
    } catch {
      continue;
    }
    if (rule) {
      return rule;
    }
  }
  return undefined;
}

export function getAllCssVars() {
  const variables = [].slice
    .call(document.styleSheets)
    // filter external css files.
    .filter((styleSheet: any) => {
      try {
        return styleSheet.cssRules;
      } catch {
        return false;
      }
    })
    .map((styleSheet: any) => [].slice.call(styleSheet.cssRules))
    .flat()
    .filter((cssRule: any) => cssRule.selectorText === ":root")
    .map((cssRule: any) =>
      cssRule.cssText.split("{")[1].split("}")[0].trim().split(";")
    )
    .flat()
    .filter((text) => text !== "")
    .map((text) => text.split(":"))
    .map((parts) => ({ key: parts[0].trim(), value: parts[1].trim() }));
  return variables;
}

export function removeCustomCssVars() {
  localStorage.removeItem("varColors");
}
export function removeCustomCssVar(val: string) {
  const varColors = JSON.parse(localStorage["varColors"] || "{}");
  delete varColors[val];
  localStorage["varColors"] = JSON.stringify(varColors);
}
export function getCustomCssVars() {
  const varColors: { [key: string]: string } = JSON.parse(
    localStorage.getItem("varColors") || "{}"
  );
  return varColors;
}
// set theme color (for mobile)
export function setThemeColor() {
  const customVars = getCustomCssVars();
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor?.setAttribute(
    "content",
    customVars["--pwa-theme-color"] || defaultTheme["pwa-theme-color"]
  );
}

export function getAppliedColor(color: string) {
  const customVars = getCustomCssVars();

  return customVars["--" + color] || (defaultTheme as any)[color];
}

export function changeCssVar(name: string, change: any, store = true) {
  if (store) {
    const varColors = JSON.parse(localStorage.getItem("varColors") || "{}");
    localStorage.setItem(
      "varColors",
      JSON.stringify({ ...varColors, ...{ [name]: change } })
    );
  }
  findRoot()?.style.setProperty(name, change);
  setThemeColor();
}

export function applyDefaultTheme(resetStorage: boolean) {
  resetStorage && removeCustomCssVars();
  const keys = Object.keys(defaultTheme);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const value = (defaultTheme as any)[key];
    changeCssVar("--" + key, value, false);
  }
  setThemeColor();
}
export function applyDefaultValue(val: string) {
  removeCustomCssVar(val);
  const defaultVal = defaultTheme[val.substring(2)];
  changeCssVar(val, defaultVal);

  setThemeColor();
}
