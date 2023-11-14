class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  draw(flip) {
    var sHeight = this.position.x;
    if (flip) {
      c.save();
      c.scale(-1, 1);
      sHeight =
        -this.position.x - (this.image.width / this.framesMax) * this.scale;
    }
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      sHeight,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
    if (flip) c.restore();
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else this.framesCurrent = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    offset,
    imageSrc,
    scale = 1,
    framesMax = 1,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
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
    this.energy = 0;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 25;
    this.sprites = sprites;
    this.isJumping = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 200);
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }

  update(enemy) {
    const canvas = document.querySelector("canvas");
    const canvasWidth = canvas.width;
    console.log(canvasWidth);

    if (this.position.x > enemy.position.x) {
      this.draw(false);
    } else {
      this.draw(true);
    }
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset;

    if (this.position.x > enemy.position.x)
      this.attackBox.position.x = this.position.x - 60;
    else this.attackBox.position.x = this.position.x + 60 - this.width;

    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    if (
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + this.velocity.x <= canvasWidth - 100
    )
      this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 20)
      this.velocity.y = 0;
    else this.velocity.y += gravity;
  }
}
