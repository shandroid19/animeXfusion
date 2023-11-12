class Sprite {
  constructor({ position, imgSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else this.framesCurrent = 0;
    }
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    offset,
    imgSrc,
    scale = 1,
    framesMax = 1,
  }) {
    super({
      position,
      image,
      scale,
      framesMax,
      framesCurrent,
      framesElapsed,
      framesHold,
    });
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
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y - 30, this.width, this.height);

    //attackbox
    c.fillStyle = "green";
    if (this.isAttacking) {
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y - 30,
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

  update(enemy) {
    this.draw();

    // if (this.position.x > enemy.position.x)
    //   this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    // else this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    if (this.position.x > enemy.position.x)
      this.attackBox.position.x = this.position.x - 50;
    else this.attackBox.position.x = this.position.x + 50 - this.width;

    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height)
      this.velocity.y = 0;
    else this.velocity.y += gravity;
  }
}
