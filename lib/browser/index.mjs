import core from "../openxum-core/index.mjs";
import browser from "./openxum/index.mjs";

let OpenXum = core.OpenXum;

for (let key in browser.OpenXum) {
  if (key === "Games") {
    for (let game in browser.OpenXum.Games) {
      OpenXum[game] = Object.assign(OpenXum[game], browser.OpenXum.Games[game]);
    }
  } else {
    OpenXum[key] = browser.OpenXum[key];
  }
}

export default OpenXum;