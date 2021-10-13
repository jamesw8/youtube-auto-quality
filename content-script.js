// Run script on initial www.youtube.com/* load
injectQualityScript();

(document.body || document.documentElement).addEventListener(
  "yt-navigate-start",
  injectQualityScript
);

function injectQualityScript() {
  let script = document.createElement("script");
  script.src = getScriptUrl();
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

function getScriptUrl() {
  var src = src || chrome.runtime.getURL("js/setQuality.js");
  return src;
}
