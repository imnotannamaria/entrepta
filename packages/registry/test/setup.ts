import "@testing-library/jest-dom";

// cmdk and some Radix components use ResizeObserver which jsdom doesn't implement.
// It reports a fixed size on observe: recharts' ResponsiveContainer renders
// nothing until it is told a non-zero box, and jsdom never lays anything out.
const OBSERVED_SIZE = { width: 800, height: 400 };

global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    const box = { ...OBSERVED_SIZE, top: 0, left: 0, bottom: 400, right: 800, x: 0, y: 0 };
    this.callback(
      [
        {
          target,
          contentRect: box as DOMRectReadOnly,
          borderBoxSize: [{ inlineSize: box.width, blockSize: box.height }],
          contentBoxSize: [{ inlineSize: box.width, blockSize: box.height }],
          devicePixelContentBoxSize: [{ inlineSize: box.width, blockSize: box.height }],
        },
      ],
      this
    );
  }

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
