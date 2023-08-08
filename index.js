const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.1;

class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking = false;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attackbox
    c.fillStyle = "green";
    if (this.isAttacking) {
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 200);
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height)
      this.velocity.y = 0;
    else this.velocity.y += gravity;
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: 0, y: 0 },
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "red",
  offset: { x: -50, y: 0 },
});

const keys = {
  playerUp: { pressed: false },
  playerLeft: { pressed: false },
  playerRight: { pressed: false },
  enemyUp: { pressed: false },
  enemyLeft: { pressed: false },
  enemyRight: { pressed: false },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.playerLeft.pressed && player.lastKey == "playerLeft") {
    player.velocity.x = -2;
  } else if (keys.playerRight.pressed && player.lastKey == "playerRight") {
    player.velocity.x = 2;
  }

  if (keys.enemyLeft.pressed && enemy.lastKey == "enemyLeft") {
    enemy.velocity.x = -2;
  } else if (keys.enemyRight.pressed && enemy.lastKey == "enemyRight") {
    enemy.velocity.x = 2;
  }

  //detect for collision
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    console.log("player attacked");
    player.isAttacking = false;
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    console.log("enemy attack");
    enemy.isAttacking = false;
  }
}

animate();

window.addEventListener("keydown", (e) => {
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
      player.velocity.y = -8;
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
      enemy.velocity.y = -8;
      break;

    case " ":
      player.attack();
      break;

    case "Insert":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.playerRight.pressed = false;
      break;

    case "a":
      keys.playerLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.enemyRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.enemyLeft.pressed = false;
      break;
  }
});
