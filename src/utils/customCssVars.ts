import defaultTheme from '@/utils/defaultTheme.json';


function findRoot() : CSSStyleRule | undefined {
  const styleSheetArr: CSSStyleSheet[] = [].slice.call(document.styleSheets);
  for (let i = 0; i < styleSheetArr.length; i++) {
    const styleSheet = styleSheetArr[i];
    if (styleSheet.href) continue;
    const rule = [].slice.call(styleSheet.rules).find((r: CSSStyleRule) => r.selectorText === ":root");
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
        styleSheet.cssRules;
        return true;
      } catch {
        return false;
      }
    })
    .map((styleSheet: any) => [].slice.call(styleSheet.cssRules))
    .flat()
    .filter((cssRule: any) => cssRule.selectorText === ":root")
    .map((cssRule: any) =>
      cssRule.cssText
        .split("{")[1]
        .split("}")[0]
        .trim()
        .split(";")
    )
    .flat()
    .filter(text => text !== "")
    .map(text => text.split(":"))
    .map(parts => ({ key: parts[0].trim(), value: parts[1].trim() }));
  return variables;
}

export function removeCustomCssVars() {
  localStorage.removeItem("varColors");
}
export function getCustomCssVars() {
  const varColors: { [key: string]: string } = JSON.parse(
    localStorage.getItem("varColors") || "{}"
  );
  return varColors;
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
  
}


export function applyDefaultTheme(resetStorage: boolean) {
  resetStorage && removeCustomCssVars()
  const keys = Object.keys(defaultTheme);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const value = (defaultTheme as any)[key];
    changeCssVar("--" + key, value, false);
  }
}