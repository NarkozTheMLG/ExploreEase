
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const beachBall = new Image();
beachBall.src = "../images/beach_ball.png";
const backGround = new Image();
backGround.src = "images/beach_background.jpg";
const gravity = 8;
let assetsLoaded = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  
  function drawImageIfLoaded(img,x,y,w,h) {
    ctx.drawImage(img, x, y, w , h);
}
function drawScene(){
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawImageIfLoaded(backGround,0,0,canvas.width,canvas.height);
    drawImageIfLoaded(beachBall,500,0,80,80);
}

backGround.onload = function () {
    assetsLoaded++;
    if (assetsLoaded === 2) 
        drawScene();
};
beachBall.onload = function () {
    assetsLoaded++;
    if (assetsLoaded === 2) 
        drawScene();
};

class GameItem {
    constructor(x, y, vx, vy, type, image,angle =0) {
      this.x = x;
      this.y = y;
      this.vx = vx; 
      this.vy = vy; 
      this.type = type;
      this.image = image; 
      this.width = 40;
      this.height = 40;
      this.gravity = 0.5;
      this.bounceFactor = 0.7;
      this.angle = angle;
    }
  
    update() {
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;
  
        this.angle += 0.01*this.vx;
    
      if (this.y + this.height > canvas.height) {
        this.y = canvas.height - this.height;
        this.vy *= -this.bounceFactor;
      }
      if (this.x < 0 || this.x + this.width > canvas.width)
        this.vx *= -1;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
  }

  const items = [];

function spawnItem() {
  const itemImg = new Image();
  itemImg.src = "/images/beach_ball.png";
  const newItem = new GameItem(100, 0, 4, 0, "positive", itemImg);
  items.push(newItem);
}
function updateItems() {
  items.forEach(item => item.update());
}
function drawItems() {
  items.forEach(item => item.draw(ctx));
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    updateItems();
    drawItems();
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();
  


setInterval(() => {
    spawnItem(); 
  }, 2000);
  
  