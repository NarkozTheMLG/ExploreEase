import { gameState, canvas, KEYS } from "./myJs.js";

class Ball {
    constructor(x, y, vx, vy,w,h, type, image,bounceFactor) {
      this.x = x;
      this.y = y;
      this.vx = vx; 
      this.vy = vy; 
      this.type = type;
      this.image = image; 
      this.width = w;
      this.height = h;
      this.gravity = 0.1;
      this.bounceFactor = bounceFactor;
      this.isHit = false;
      this.bounced = 0;
      this.angle = 0;
    }
    update() {
        if(gameState.gameTime % gameState.gameSpeed === 0) {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        }
        if(gameState.gameTime % 20 * gameState.gameSpeed === 0) this.vx *= 0.99;
        this.angle += 0.04*this.vx;
      
        if (this.y + this.height > canvas.height) {
          this.y = canvas.height - this.height;
          this.vy *= -this.bounceFactor;
          this.bounced++;
        }
        if (this.x < 0 || this.x + this.width > canvas.width) this.vx *= -1;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
  }

  class Chest {
    constructor(x, vx, vy,w,h, image) {
      this.xPercent = x / canvas.width; 
      this.x = x;
      this.y = canvas.height;
      this.vx = vx; 
      this.vy = vy; 
      this.image = image; 
      this.width = w;
      this.height = h;
    }
    update() {
      this.x = this.xPercent * canvas.width;
        this.y = canvas.height-this.height;
      if(this.vx < 5)
    this.vx *= 1.02;
  if (KEYS["ArrowLeft"] && !KEYS["ArrowRight"] && this.x > 0) {
    this.x -= this.vx;
  } else if (KEYS["ArrowRight"] && !KEYS["ArrowLeft"] && this.x + this.width < canvas.width) {
    this.x += this.vx;
  } else {
    this.vx = 1; // reset speed if no valid key or both pressed
  }
      this.xPercent = this.x / canvas.width;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
  }

class Boom {
    constructor(x, y,w,h,image) {
      this.x = x;
      this.y = y;
      this.image = image; 
      this.width = w;
      this.height = h;
      this.end = false;
      this.alpha = 1;
    }
     update() {
      this.alpha -= 0.01;
      if (this.alpha <= 0.01) 
        this.end = true;
    }
    draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
    }
  }




  export { Ball, Chest, Boom };