// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock matchMedia and animation frame APIs used by Ionic internals in jsdom.
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
      media: '',
      onchange: null,
    };
  };

if (typeof window.requestAnimationFrame === 'undefined') {
  window.requestAnimationFrame = function (callback: FrameRequestCallback): number {
    return window.setTimeout(() => callback(Date.now()), 16);
  };
}

if (typeof window.cancelAnimationFrame === 'undefined') {
  window.cancelAnimationFrame = function (handle: number): void {
    window.clearTimeout(handle);
  };
}
