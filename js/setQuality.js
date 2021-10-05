var observer = observer || new MutationObserver(mutationCallback);
var moviePlayer;

observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
});

function mutationCallback(mutations, observer) {
  for (let mutation of mutations) {
    switch (mutation.type) {
      case "childList": {
        for (let node of mutation.addedNodes) {
          if (node.id === "movie_player") {
            moviePlayer = node;
            handlePlayer(moviePlayer, () => observer.disconnect());
            return;
          }
        }
      }
      case "attributes": {
        if (!moviePlayer) {
          break;
        }
        if (mutation.target.id === "movie_player") {
          if (moviePlayer.getAvailableQualityLevels().length > 0) {
            observer.disconnect();

            handlePlayer(moviePlayer);
            return;
          }
        }
      }
    }
  }
}

function handlePlayer(player, callback = () => {}) {
  let currentQuality = player.getPlaybackQuality();
  let highestQuality = player.getAvailableQualityLevels().at(0);

  player.setPlaybackQualityRange(highestQuality);
  player.setPlaybackQuality(highestQuality);

  formattedLog(`Quality: ${currentQuality} => ${player.getPlaybackQuality()}`);

  callback();
}

function formattedLog(logStr) {
  console.log(
    `%c[Youtube Auto Quality] ${logStr}`,
    "background: #373b81; color: #Ebeff1; font-size: 14px"
  );
}
