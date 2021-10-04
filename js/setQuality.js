const qualities = {
  auto: "auto",
  "144p": "tiny",
  "240p": "small",
  "360p": "medium",
  "480p": "large",
  "720p": "hd720",
  "720p60": "hd720",
  "1080p": "hd1080",
  "1080p60": "hd1080",
  "1440p": "hd1440",
  "2160p": "hd2160",
  "2880p": "hd2880",
  "4320p": "highres",
};

let observer = new MutationObserver(mutationCallback);
observer.observe(document.documentElement || document.body, {
  childList: true,
  subtree: true,
});

function mutationCallback(mutations, observer) {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.id === "movie_player")
        handlePlayer(node, () => observer.disconnect());
    });
  });
}

function handlePlayer(player, callback) {
  let currentQuality = player.getPlaybackQuality();
  let highestQuality = qualities[player.getAvailableQualityLabels().at(0)];
  formattedLog(
    `Current quality: ${currentQuality}. Highest available quality: ${highestQuality}`
  );

  player.setPlaybackQualityRange(highestQuality);
  player.setPlaybackQuality(highestQuality);

  formattedLog(`Set quality to: ${player.getPlaybackQuality()}`);

  callback();
}

function formattedLog(logStr) {
  console.log(
    `%c[Youtube Auto Quality] ${logStr}`,
    "background: #373b81; color: #Ebeff1; font-size: 14px"
  );
}
