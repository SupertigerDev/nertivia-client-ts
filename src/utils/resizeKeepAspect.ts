function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}
function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export default function resizeKeepAspect(
  resizeEl: any,
  parentEl: any,
  width: number,
  height: number,
  _clamp = true
) {
  if (!parentEl) return {};
  const w = parentEl.offsetWidth;
  const h = parentEl.offsetHeight;
  const minWidth = w / 1.5;
  const minHeight = h / 1.5;

  const srcWidth = width;
  const srcHeight = height;
  const newDimentions = calculateAspectRatioFit(
    srcWidth,
    srcHeight,
    _clamp ? clamp(minWidth, 200, 500) : minWidth,
    minHeight
  );

  resizeEl.style.height = clamp(newDimentions.height, 0, srcHeight) + "px";
  resizeEl.style.width = clamp(newDimentions.width, 0, srcWidth) + "px";
}
