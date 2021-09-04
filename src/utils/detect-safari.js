import { detect } from "detect-browser";

export function isSafari() {
  const browser = detect();
  return browser ? ["iOS", "Mac OS"].includes(browser.os) && ["safari", "ios"].includes(browser.name) : false;
}
