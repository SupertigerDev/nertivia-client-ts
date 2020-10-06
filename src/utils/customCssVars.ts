
export function getAllCssVars() {
  const variables = [].slice.call(document.styleSheets)
  .map(styleSheet => [].slice.call((styleSheet as any).cssRules))
  .flat()
  .filter(cssRule => (cssRule as any).selectorText === ':root')
  .map(cssRule => (cssRule as any).cssText.split('{')[1].split('}')[0].trim().split(';'))
  .flat()
  .filter(text => text !== "")
  .map(text => text.split(':'))
  .map(parts => ({key: parts[0].trim(), value: parts[1].trim() }))
  return variables;
}

export function removeCustomCssVars() {
  localStorage.removeItem("varColors")
}
export function getCustomCssVars() {
  const varColors: {[key: string]: string} = JSON.parse(localStorage.getItem("varColors") || "{}");
  return varColors
}
export function changeCssVar(name: string, change: any, store = true) {
  if (store) {
    const varColors = JSON.parse(localStorage.getItem("varColors") || "{}");
    localStorage.setItem("varColors", JSON.stringify({...varColors, ...{[name]: change}}));
  }
  document.documentElement.style.setProperty(
    name,
    change
  );
}
