// Use to convert for number comparisons
var convertQualityToText = {
  hd2160: 2160,
  hd1440: 1440,
  hd1080: 1080,
  hd720: 720,
  large: 480,
  medium: 360,
  small: 240,
  tiny: 144,
  auto: "auto",
};

var convertTextToQuality = {
  2160: "hd2160",
  1440: "hd1440",
  1080: "hd1080",
  720: "hd720",
  480: "large",
  360: "medium",
  240: "small",
  144: "tiny",
  auto: "auto",
};

var observer = observer || new MutationObserver(mutationCallback);
var moviePlayer, currentPlayer;
var preferredQuality = document.currentScript.getAttribute("data-id");

// If a valid movie player isn't stored, then use the observer to find the node
if (validMoviePlayer()) {
  handleMoviePlayer(moviePlayer);
} else {
  findMoviePlayerAndSetQuality();
}

function validMoviePlayer() {
  return moviePlayer && moviePlayer.getAvailableQualityLevels().length > 0;
}

function findMoviePlayerAndSetQuality() {
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

function mutationCallback(mutations, observer) {
  for (let mutation of mutations) {
    switch (mutation.type) {
      case "childList": {
        // On initial video visit
        for (let node of mutation.addedNodes) {
          if (node.id === "movie_player") {
            moviePlayer = node;
            observer.disconnect();

            handleMoviePlayer(moviePlayer);
            return;
          }
        }
      }
      case "attributes": {
        // On subsequent video visits
        if (!moviePlayer) {
          break;
        }
        if (mutation.target.id === "movie_player") {
          if (moviePlayer.getAvailableQualityLevels().length > 0) {
            observer.disconnect();

            handleMoviePlayer(moviePlayer);
            return;
          }
        }
      }
    }
  }
}

function handleMoviePlayer(player) {
  let currentQuality = player.getPlaybackQuality();
  const availableQualities = player
    .getAvailableQualityLevels()
    .map((quality) => convertQualityToText[quality]);

  let highestPreferredQuality =
    convertTextToQuality[
      selectBestPreferredQuality(
        availableQualities,
        convertQualityToText[preferredQuality]
      )
    ];

  if (!highestPreferredQuality) return;

  player.setPlaybackQualityRange(highestPreferredQuality);

  formattedLog(`Quality: ${currentQuality} => ${player.getPlaybackQuality()}`);
}

function selectBestPreferredQuality(availableQualities, preferredQuality) {
  // If the preferred quality exists, then use that
  if (availableQualities.includes(preferredQuality)) return preferredQuality;

  // Find the best quality under the preferred quality
  for (let quality of availableQualities) {
    if (preferredQuality >= quality) {
      return quality;
    }
  }
  return "auto";
}

function formattedLog(logStr) {
  console.log(
    `%c[Youtube Auto Quality] ${logStr}`,
    "background: #373b81; color: #Ebeff1; font-size: 14px"
  );
}
