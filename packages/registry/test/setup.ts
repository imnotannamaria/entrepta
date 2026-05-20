import "@testing-library/jest-dom";

// cmdk and some Radix components use ResizeObserver which jsdom doesn't implement
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// cmdk calls scrollIntoView on selected items
Element.prototype.scrollIntoView = () => {};

// jsdom's default url is `about:blank`, which disables Storage. Replace it
// with a Map-backed shim so hooks that persist preferences can be tested.
const store = new Map<string, string>();
const storageShim: Storage = {
  get length() {
    return store.size;
  },
  clear() {
    store.clear();
  },
  getItem(key: string) {
    return store.has(key) ? (store.get(key) as string) : null;
  },
  key(index: number) {
    return Array.from(store.keys())[index] ?? null;
  },
  removeItem(key: string) {
    store.delete(key);
  },
  setItem(key: string, value: string) {
    store.set(key, String(value));
  },
};
Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: storageShim,
});
