(() => {
  var script = document.createElement("script");
  script.src = chrome.runtime.getURL("js/setQuality.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
})();
