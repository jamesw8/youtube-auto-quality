// Run script on initial www.youtube.com/* load
injectQualityScript();

// Set initial badge value
chrome.storage.sync.get({ youtubeAutoQuality: "auto" }, (object) => {
  let quality = object["youtubeAutoQuality"];
  chrome.action.setBadgeText({
    text: convertQualityToText[quality],
  });
});

// Update quality when video starts
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

  // Insert the quality setting into the script tag for retrieval
  chrome.storage.sync.get(
    {
      youtubeAutoQuality: "auto",
    },
    (object) => {
      script.setAttribute("data-id", object["youtubeAutoQuality"]);

      (document.head || document.documentElement).appendChild(script);
    }
  );
}

function getScriptUrl() {
  var src = src || chrome.runtime.getURL("js/setQuality.js");
  return src;
}

// Update quality when a preferred quality is selected
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key == "youtubeAutoQuality") {
      injectQualityScript();
    }
  }
});
