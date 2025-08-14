const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function getCurrentPlayer() {
  if (urlParams.has("online")) return;
  if (urlParams.has("p1"))
    document.querySelector("#currentPlayer").innerHTML = "Player 2";
  else document.querySelector("#currentPlayer").innerHTML = "Player 1";
}

function selectCharacter(id) {
  const online = urlParams.has("online");
  if (online) {
    window.open(
      `game.html${window.location.search}&p1=${id}&p2=0`,
      (target = "_self")
    );
  } else {
    if (urlParams.has("p1")) {
      // After both players chosen, go to background select for offline flow
      try {
        sessionStorage.setItem("axf_last_p2", String(id));
      } catch {}
      const qs = window.location.search.replace(/&?p2=\d+/, "") + `&p2=${id}`;
      window.open(`backgroundSelect.html${qs}`, (target = "_self"));
    } else {
      // First player select; remain on page to select Player 2
      window.open(`${window.location.href}?p1=${id}`, (target = "_self"));
    }
  }
}

$(document).ready(() => {
  players.map((player, id) => {
    $("#allCharacters").append(
      `<div class="characterBox" onclick="selectCharacter(${id})"><img class="characterImage"src="../sprites/${player.name}/portrait.jpg"/> <b class="text-center" style="text-transform:capitalize">${player.name}</b></div>`
    );
  });
});
