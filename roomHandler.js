const performAction = (player, data) => {
  if (!started) return;

  const currentPlayer = player1 ? player : enemy;
  const opponent = player1 ? player : enemy;

  const currentPlayerKey = player1 ? "player" : "enemy";
  const opponentKey = player1 ? "player" : "enemy";

  switch (data) {
    case "rightDown":
      currentPlayer.keys.right = true;
      currentPlayer.lastKey = `${currentPlayer}Right`;
      break;

    case "leftDown":
      currentPlayer.keys.left = true;
      currentPlayer.lastKey = `${currentPlayer}Left`;
      break;

    case "up":
      currentPlayer.keys.up = true;
      if (currentPlayer.velocity.y == 0) currentPlayer.velocity.y = -8;
      break;

    case "attack1":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        currentPlayer.attack1();
      break;

    case "attack2":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        executeAttack2(
          player,
          currentPlayer.attack2Object,
          `#${currentPlayer}Energy`
        );
      break;

    case "blockDown":
      currentPlayer.keys.block = true;
      if (
        !currentPlayer.isAttacking &&
        currentPlayer.velocity.y === 0 &&
        currentPlayer.velocity.x === 0
      )
        currentPlayer.block();
      break;

    case "rightUp":
      currentPlayer.keys.right = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;
      break;

    case "leftUp":
      currentPlayer.keys.left = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;

      break;

    case "blockUp":
      currentPlayer.isBlocking = false;
      opponent.keys.block = false;
  }
};
