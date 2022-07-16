const body = document.body;

// Convert qualities to human-readable badges
const convertQualityToText = {
  hd2160: "2160p",
  hd1440: "1440p",
  hd1080: "1080p",
  hd720: "720p",
  large: "480p",
  medium: "360p",
  small: "240p",
  tiny: "144p",
  auto: "auto",
};

//Add checkmark to the existing quality setting on popup
chrome.storage.sync
  .get({
    youtubeAutoQuality: "auto",
  })
  .then((object) => {
    let current = document.querySelector(
      `[data-id="${object["youtubeAutoQuality"]}"`
    );
    current.id = "current";
  });

// Update quality when changed in the popup
body.addEventListener("click", (event) => {
  const current = document.getElementById("current");
  const button = event.target;
  const quality = button.getAttribute("data-id");
  if (quality) {
    current.id = "";
    button.id = "current";

    chrome.action.setBadgeText({
      text: convertQualityToText[quality],
    });
    chrome.storage.sync.set({ youtubeAutoQuality: quality });
  }
});
