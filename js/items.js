import { gameState, canvas } from "./myJs.js";

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
    constructor(x, y, vx, vy,w,h, type, image,bounceFactor) {
      this.x = x;
      this.y = y;
      this.vx = vx; 
      this.vy = vy; 
      this.type = type;
      this.image = image; 
      this.width = w;
      this.height = h;
    }
    update() {
        if(gameState.gameTime % gameState.gameSpeed === 0) {
        this.x += this.vx;
        this.y += this.vy;
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



  export { Ball };