export function bitwiseRemove(all: number, flag: number) {
  return (all &= ~flag);
}
export function bitwiseAdd(all: number, flag: number) {
  return all | flag;
}
export function bitwiseContains(all: number, flag: number) {
  return all & flag;
}
