const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function getCurrentPlayer() {
  if (urlParams.has("p1"))
    document.querySelector("#currentPlayer").innerHTML = "Player 2";
  else document.querySelector("#currentPlayer").innerHTML = "Player 1";
}

function selectCharacter(id) {
  const online = parseInt(urlParams.get("online"));
  console.log(online);
  if (online === 1) {
    console.log(online);
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
