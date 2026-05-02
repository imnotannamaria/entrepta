import "@testing-library/jest-dom";

// cmdk and some Radix components use ResizeObserver which jsdom doesn't implement
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// cmdk calls scrollIntoView on selected items
Element.prototype.scrollIntoView = () => {};
