export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function normalizeCategoryId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}]+/gu, "_") // any letter or number
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function debounce<T extends unknown[]>( fn: (...args: T) => void,time: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: T): void {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args)
    }, time)
  }
}