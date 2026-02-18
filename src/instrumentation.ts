export async function register() {
  // Node.js 22+ adds a global localStorage that doesn't work properly
  // without --localstorage-file flag, causing "localStorage.getItem is not a function"
  // errors in libraries like next-themes during SSR.
  if (typeof globalThis.localStorage !== "undefined") {
    try {
      globalThis.localStorage.getItem("test");
    } catch {
      // @ts-expect-error - removing broken Node.js localStorage
      delete globalThis.localStorage;
    }
  }
}
