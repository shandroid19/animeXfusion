const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function getCurrentPlayer() {
  if (urlParams.has("initiator")) return;
  if (urlParams.has("p1"))
    document.querySelector("#currentPlayer").innerHTML = "Player 2";
  else document.querySelector("#currentPlayer").innerHTML = "Player 1";
}

function selectCharacter(id) {
  const online = urlParams.has("initiator");
  if (online) {
    window.open(
      `game.html${window.location.search}&p1=${id}&p2=0`,
      (target = "_self")
    );
  } else {
    if (urlParams.has("p1")) {
      window.open(
        `game.html${window.location.search}&p2=${id}`,
        (target = "_self")
      );
    } else {
      window.open(`${window.location.href}&p1=${id}`, (target = "_self"));
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
