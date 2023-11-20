const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

var started = false;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.1;
let timer = 100;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "../assets/bg.jpg",
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const p1 = parseInt(urlParams.get("p1"));
const p2 = parseInt(urlParams.get("p2"));

const player = new Fighter({
  position: { x: 200, y: 0 },
  velocity: { x: 0, y: 0 },
  scale: players[p1].scale,
  offset: players[p1].offset[0],
  attack2Object: new Attack({
    position: { x: 200, y: 0 },
    imageSrc: `../sprites/${players[p1].name}/attack2FX.png`,
    scale: players[p1].attack.scale,
    framesMax: players[p1].attack.framesMax,
    velocity: { x: -5, y: 0 },
  }),

  sprites: {
    idle: {
      imageSrc: `../sprites/${players[p1].name}/idle.png`,
      framesMax: players[p1].moves[0],
      offset: players[p1].offset[0],
    },
    run: {
      imageSrc: `../sprites/${players[p1].name}/run.png`,
      framesMax: players[p1].moves[1],
      offset: players[p1].offset[1],
    },
    jump: {
      imageSrc: `../sprites/${players[p1].name}/jump.png`,
      framesMax: players[p1].moves[2],
      offset: players[p1].offset[2],
    },
    attack1: {
      imageSrc: `../sprites/${players[p1].name}/attack1.png`,
      framesMax: players[p1].moves[3],
      offset: players[p1].offset[3],
    },
    attack2: {
      imageSrc: `../sprites/${players[p1].name}/attack2.png`,
      framesMax: players[p1].moves[4],
      offset: players[p1].offset[4],
    },
    takeHit: {
      imageSrc: `../sprites/${players[p1].name}/takeHit1.png`,
      framesMax: players[p1].moves[5],
      offset: players[p1].offset[5],
    },
    fall: {
      imageSrc: `../sprites/${players[p1].name}/fall.png`,
      framesMax: players[p1].moves[6],
      offset: players[p1].offset[6],
    },
    block: {
      imageSrc: `../sprites/${players[p1].name}/block.png`,
      framesMax: players[p1].moves[7],
      offset: players[p1].offset[7],
    },
  },
});

const enemy = new Fighter({
  position: { x: 800, y: 100 },
  velocity: { x: 0, y: 0 },
  scale: players[p2].scale,
  offset: players[p2].offset[0],

  attack2Object: new Attack({
    position: { x: 200, y: 0 },
    imageSrc: `../sprites/${players[p2].name}/attack2FX.png`,
    scale: players[p2].attack.scale,
    framesMax: players[p2].attack.framesMax,
    velocity: { x: -5, y: 0 },
  }),

  sprites: {
    idle: {
      imageSrc: `../sprites/${players[p2].name}/idle.png`,
      framesMax: players[p2].moves[0],
      offset: players[p2].offset[0],
    },
    run: {
      imageSrc: `../sprites/${players[p2].name}/run.png`,
      framesMax: players[p2].moves[1],
      offset: players[p2].offset[1],
    },
    jump: {
      imageSrc: `../sprites/${players[p2].name}/jump.png`,
      framesMax: players[p2].moves[2],
      offset: players[p2].offset[2],
    },
    attack1: {
      imageSrc: `../sprites/${players[p2].name}/attack1.png`,
      framesMax: players[p2].moves[3],
      offset: players[p2].offset[3],
    },
    attack2: {
      imageSrc: `../sprites/${players[p2].name}/attack2.png`,
      framesMax: players[p2].moves[4],
      offset: players[p2].offset[4],
    },
    takeHit: {
      imageSrc: `../sprites/${players[p2].name}/takeHit1.png`,
      framesMax: players[p2].moves[5],
      offset: players[p2].offset[5],
    },
    fall: {
      imageSrc: `../sprites/${players[p2].name}/fall.png`,
      framesMax: players[p2].moves[6],
      offset: players[p2].offset[6],
    },
    block: {
      imageSrc: `../sprites/${players[p2].name}/block.png`,
      framesMax: players[p2].moves[7],
      offset: players[p2].offset[7],
    },
  },
});

const keys = {
  playerUp: { pressed: false },
  playerLeft: { pressed: false },
  playerRight: { pressed: false },
  enemyUp: { pressed: false },
  enemyLeft: { pressed: false },
  enemyRight: { pressed: false },
};

$(document).ready(() => {
  background.update();
  startCountdown(decreaseTimer, restoreEnergy);
});

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  player.update(enemy);
  enemy.update(player);

  if (player.attack2Object.launched) player.attack2Object.update(enemy);
  if (enemy.attack2Object.launched) enemy.attack2Object.update(player);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.playerLeft.pressed && player.lastKey == "playerLeft") {
    player.velocity.x = -2;
    player.switchSprite("run");
  } else if (keys.playerRight.pressed && player.lastKey == "playerRight") {
    player.velocity.x = 2;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  }

  if (keys.enemyLeft.pressed && enemy.lastKey == "enemyLeft") {
    enemy.velocity.x = -2;
    enemy.switchSprite("run");
  } else if (keys.enemyRight.pressed && enemy.lastKey == "enemyRight") {
    enemy.velocity.x = 2;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  }

  //detect for attack collision
  if (
    attackCollision({ rectangle1: enemy, rectangle2: player.attack2Object }) &&
    player.attack2Object.launched
  ) {
    player.attack2Object.launched = false;
    enemy.switchSprite("fall");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    attackCollision({ rectangle1: player, rectangle2: enemy.attack2Object }) &&
    enemy.attack2Object.launched
  ) {
    enemy.attack2Object.launched = false;
    player.switchSprite("fall");
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //detect for player collision

  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    player.takeHit();
    document.querySelector("#playerHealth").style.width = player.health + "%";
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0)
    determineWinner({ player, enemy });
}

animate();

window.addEventListener("keydown", (e) => {
  if (!started) return;
  switch (e.key) {
    case "d":
      keys.playerRight.pressed = true;
      player.lastKey = "playerRight";
      break;

    case "a":
      keys.playerLeft.pressed = true;
      player.lastKey = "playerLeft";
      break;

    case "w":
      keys.playerUp.pressed = true;
      if (player.velocity.y == 0) player.velocity.y = -8;
      break;

    case "ArrowRight":
      keys.enemyRight.pressed = true;
      enemy.lastKey = "enemyRight";
      break;

    case "ArrowLeft":
      keys.enemyLeft.pressed = true;
      enemy.lastKey = "enemyLeft";
      break;

    case "ArrowUp":
      keys.enemyUp.pressed = true;
      if (enemy.velocity.y == 0) enemy.velocity.y = -8;
      break;

    case " ":
      if (player.health > 0 && enemy.health > 0 && !player.isAttacked)
        player.attack1();
      break;

    case "q":
      if (player.health > 0 && enemy.health > 0 && !player.isAttacked)
        executeAttack2(player, player.attack2Object, "#playerEnergy");
      break;

    case "0":
      if (player.health > 0 && enemy.health > 0 && !enemy.isAttacked)
        executeAttack2(enemy, enemy.attack2Object, "#enemyEnergy");
      break;

    case "Control":
      if (player.health > 0 && enemy.health > 0 && !enemy.isAttacked)
        enemy.attack1();
      break;

    case "e":
      if (
        !player.isAttacking &&
        player.velocity.y === 0 &&
        player.velocity.x === 0
      )
        player.block();
      break;

    case "1":
      if (
        !enemy.isAttacking &&
        enemy.velocity.y === 0 &&
        enemy.velocity.x === 0
      )
        enemy.block();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  if (!started) return;

  switch (e.key) {
    case "d":
      keys.playerRight.pressed = false;
      player.offset = player.sprites.idle.offset;
      break;

    case "a":
      keys.playerLeft.pressed = false;
      player.offset = player.sprites.idle.offset;

      break;

    case "ArrowRight":
      keys.enemyRight.pressed = false;
      enemy.offset = enemy.sprites.idle.offset;

      break;

    case "ArrowLeft":
      keys.enemyLeft.pressed = false;
      enemy.offset = enemy.sprites.idle.offset;

      break;

    case "1":
      enemy.isBlocking = false;
      break;

    case "e":
      player.isBlocking = false;
  }
});
