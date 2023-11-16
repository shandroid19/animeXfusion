function getCurrentPlayer() {
  console.log("exected", urlParams.has("p1"));
  if (urlParams.has("p1")) $("#currentPlayer").innerHTML = "Player 2";
  else $("#currentPlayer").innerHTML = "Player 1";
}

function selectCharacter(id) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
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
