import { afterEach, expect, test, vi } from "vitest";
import { mountMagnifyingEye } from "./magnifying-eye";

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

test("renders transparent text and cleans up when remounted", () => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
  const container = document.createElement("div");
  document.body.append(container);
  const first = mountMagnifyingEye(container);
  expect(container.querySelectorAll("pre")).toHaveLength(2);
  expect(container.textContent?.trim().length).toBeGreaterThan(100);
  expect([...container.querySelectorAll("pre")].every((pre) => pre.style.background === "transparent")).toBe(true);
  first.destroy();
  expect(container.childElementCount).toBe(0);
  const second = mountMagnifyingEye(container);
  expect(container.querySelectorAll("pre")).toHaveLength(2);
  second.destroy();
});

test("starts and stops motion when reduced-motion preferences change", () => {
  let visibilityCallback: IntersectionObserverCallback;
  let preferenceCallback: () => void = () => {};
  const preference = {
    matches: true,
    addEventListener: (_name: string, callback: () => void) => { preferenceCallback = callback; },
    removeEventListener: vi.fn(),
  };
  const request = vi.fn(() => 42);
  const cancel = vi.fn();
  vi.stubGlobal("requestAnimationFrame", request);
  vi.stubGlobal("cancelAnimationFrame", cancel);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { visibilityCallback = callback; }
    observe() {} disconnect() {}
  });
  vi.stubGlobal("matchMedia", () => preference);
  const animation = mountMagnifyingEye(document.createElement("div"));
  visibilityCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
  expect(request).not.toHaveBeenCalled();
  preference.matches = false;
  preferenceCallback();
  expect(request).toHaveBeenCalledOnce();
  preference.matches = true;
  preferenceCallback();
  expect(cancel).toHaveBeenCalledWith(42);
  animation.destroy();
  expect(preference.removeEventListener).toHaveBeenCalled();
});
