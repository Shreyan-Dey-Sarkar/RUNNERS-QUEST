var player, player_running;
var ground, groundImg;
var stone, stoneImg;
var backGround, backgroundImg;
var coin, coinImg;
var potion, potionImg;
var PLAY = 0;
var END = 1;
var WON = 2;
var gameState = 0;
var Coin = 0;
var energy = 100;
var coinSound, potionCollect, ObstacleHitSound;
var woodImg;
var bearTrapAni;

function preload(){
	player_running = loadAnimation("running_ani-0.png","running_ani-1.png","running_ani-2.png","running_ani-3.png","running_ani-4.png","running_ani-5.png","running_ani-6.png","running_ani-7.png","running_ani-8.png","running_ani-9.png","running_ani-10.png","running_ani-11.png","running_ani-12.png");
  stoneImg = loadImage("stone.png");
  backgroundImg = loadImage("backgroundImg.jpg");
  groundImg = loadImage("groundImg.jpg");
  coinImg = loadImage("coin.png");
  potionImg = loadImage("energy.png");
  woodImg = loadImage("wood.png");
  bearTrapAni = loadAnimation("bearTrap-0.png", "bearTrap-1.png", "bearTrap-2.png", "bearTrap-3.png");
  coinSound = loadSound("coinCollectingSound.mp3");
  potionCollect = loadSound("potionCollectingSound.mp3");
  ObstacleHitSound = loadSound("StoneHitSound.mp3");
 }

function setup() {
	createCanvas(940, 720);
  backGround = createSprite(200, 200);
  backGround.addImage(backgroundImg);
  backGround.velocityX = -6;
 

  player = createSprite(200,700,10,10);
	player.addAnimation("moving", player_running);  
	player.scale = 0.3;

  

	ground = createSprite(500,700,1000,20);
  ground.addImage(groundImg);
  ground.scale = 0.2;
  ground.debug = false;
  ground.setCollider("rectangle", 0, 0, 10000, 500);
  stoneGroup = new Group();
  coinGroup = new Group();
  potionGroup = new Group();
}

function spawnObstacles() {
  
  if (World.frameCount % 100 === 0) {         
    stone = createSprite(1000, 620);
    if(Coin <= 20 ){
      stone.addImage(stoneImg);
      stone.velocityX = -40;
    }

     if(Coin > 20 && Coin <= 60){
       stone.addAnimation("trap",bearTrapAni);
       stone.velocityX = -40;
    }

    if(Coin > 60 && Coin <= 100){
      stone.addImage(woodImg);
      stone.velocityX = -60;
    } 
    
    stone.scale = 0.4;
    stone.depth = player.depth;
    player.depth = player.depth + 1;
    stone.debug = false;
    stone.setCollider("circle", 10, 20, 100);
    stoneGroup.add(stone);
  }
}

function spawnCoin() {
  if(World.frameCount % 25 === 0){
    coin = createSprite(1000,610);
    coin.addImage(coinImg);
    coin.scale = 0.1;
    coin.velocityX = -70;
    coin.y = Math.round(random(200, 400));
    coin.depth = player.depth;
    player.depth = player.depth + 1;
    coin.debug = false;
    coin.setCollider("circle", 50, 20, 10);
    coinGroup.add(coin);
  }
  
}

function spawnPotion(){
  if(World.frameCount % 100 === 0){ 
    potion = createSprite(1000,920);
    potion.addImage(potionImg);
    potion.scale = 0.1;
    potion.velocityX = -25;
    potion.depth = player.depth;
    player.depth = player.depth + 1;
    potionGroup.add(potion);
  }
}

function draw() {
  background(0);

  
  
  if (gameState  === PLAY){
    spawnObstacles();
    spawnCoin();
    spawnPotion();
  if (backGround.x < 40) {
    backGround.x = backGround.width / 2;
 }
  
  if (keyDown("UP_ARROW") && player.y >= 500) {
	player.velocityY = -60;
 }
  player.velocityY = player.velocityY + 5.8;
  player.collide(ground);
}
  drawSprites();

  if (player.isTouching(stoneGroup)) {
    ObstacleHitSound.play();
    gameState = END;
  }

  if(player.isTouching(potionGroup)){
    energy = energy+5;
    potionCollect.play();
    potionGroup.destroyEach();
  }

  if (energy === 0){
    gameState = END;
  }

  stroke("black");
  fill("yellow");
  textSize(35);
  text("Coins: $" + Coin + " / $100", 40, 50)

  stroke("black");
  fill("darkblue");
  textSize(35);
  text("Energy: " + energy + "%", 350, 50)

  if(player.isTouching(coinGroup)){
    Coin = Coin+1;
    coinSound.play();
    coinGroup.destroyEach();
  }
  
  if(World.frameCount % 80 === 0){
    energy = energy - 1;
  }

  if(Coin === 100){
    gameState = WON;
  }

  if(gameState === WON){
    stoneGroup.destroyEach();
    coinGroup.destroyEach();
    energy = 0;
    player.visible = false;
    stoneGroup.velocityX = 0;
    backGround.velocityX = 0;
    stroke("black");
    fill("green");
    textSize(80);
    text("YOU WON!", 300, 250)
  }

  if (gameState === END) {
    stoneGroup.destroyEach();
    coinGroup.destroyEach();
    energy = 0;
    player.visible = false;
    stoneGroup.velocityX = 0;
    backGround.velocityX = 0;
    stroke("black");
    fill("red");
    textSize(80);
    text("GAME'S UP!", 300, 250);
  }
}



