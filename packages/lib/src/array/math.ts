export function sum(arr: number[]): number {
  return arr.reduce((total, n) => total + n, 0);
}

export function avg(arr: number[]): number {
  return sum(arr) / arr.length;
}

export function max(arr: number[]): number {
  return Math.max(...arr);
}
