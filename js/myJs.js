import { GameItem } from "./items.js";

export const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const beachBall = new Image();
beachBall.src = "../images/beach_ball.png";
const backGround = new Image();
backGround.src = "images/beach_background.jpg";
const gravity = 8;
let items = [];
let assetsLoaded = 0;
export const gameState= {
    gameTime: 0,
    gameSpeed: 1,};

function drawImageIfLoaded(img,x,y,w,h) {
    ctx.drawImage(img, x, y, w , h);
}

function drawScene(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImageIfLoaded(backGround,0,0,canvas.width,canvas.height);
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

function spawnBeachBall() {
    const itemImg = new Image();
    itemImg.src = "/images/beach_ball.png";
    const newItem = new GameItem(100, 0, 4, 0,40,40, "positive", itemImg,0.9);
    items.push(newItem);
  }

  function updateItems() {
    items.forEach(item => item.update());
    items.forEach(item => item.draw(ctx));
    let newitems = [];
    for(let i = 0;i< items.length;i++)
        newitems = items.filter(item=>!item.isHit);
    items = newitems;
  }

function gameLoop() {
    gameState.gameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    updateItems();

    requestAnimationFrame(gameLoop);
  }

gameLoop();
setInterval(() => {
    spawnBeachBall(); 
  }, 2000);
  
  