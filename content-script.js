// Run script on initial www.youtube.com/* load
injectQualityScript();

(document.body || document.documentElement).addEventListener(
  "yt-navigate-start",
  injectQualityScript
);

function injectQualityScript() {
  if (window.location.pathname !== "/watch") return;

  let script = document.createElement("script");
  script.src = chrome.runtime.getURL("js/setQuality.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}
