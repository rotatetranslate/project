// physics and collision detection from: http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
var playing;

var timerDiv = document.getElementById('timer');
function timer(time) {
  timerDiv.innerHTML = time.toFixed(2);
  if (time <= .00001) {
    winGame();
  } else {
    setTimeout(function() {
      console.log(time);
      time -= .1;
      timer(time);
    }, 100);
  }
}





var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// D A T A

// var camera;
// save(); translate(-camera.x, -camera.y); draw(); restore();

var width = 1400;
var height = 700;
canvas.width = width;
canvas.height = height;

var player = {
  name: 'Player 1',
  x: width - 30,   // x axis position
  y: 500, // y axis position
  width: 10,
  height: 20,
  maxVelX: 6,
  // vel < 1/2 player width + 1/2 box width
  maxVelY: 12,
  // added max Y velocity because player was falling through platforms
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  score: 0,
  draw: function() {
    ctx.fillStyle = '#09F';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
};

var player2 = {
  name: 'Player 2',
  x: width - 50,   // x axis position
  y: 500, // y axis position
  width: 10,
  height: 20,
  maxVelX: 6,
  maxVelY: 12,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  score: 0,
  draw: function() {
    ctx.fillStyle = 'rgb(255, 162, 167)';
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  }
};
// sounds
var p1jump = document.getElementById('p1-jump');
var p2jump = document.getElementById('p2-jump');
var coinSound = document.getElementById('coin');

var keys = [];

var friction = 0.875;
var gravity = 0.6;


// platform constructor
var boxes = [];

// function Platform(x, y, width, height) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
// }

function Platform(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

boxes.push(new Platform(20 + width/2, height - 114, 11, 114));
boxes.push(new Platform(250, 75, 100, 10));
boxes.push(new Platform(500, 155, 50, 10)); //
boxes.push(new Platform(700, 245, 150, 10));
boxes.push(new Platform(900, 355, 150, 10));
boxes.push(new Platform(1090, 380, 200, 10));
//boxes.push(new Platform(1300, 405, 150, 10));
boxes.push(new Platform(1100, 480, 150, 10));
boxes.push(new Platform(750, 425, 150, 10));
boxes.push(new Platform(550, 500, 150, 10));
boxes.push(new Platform(350, 575, 150, 10));
boxes.push(new Platform(150, 650, 150, 10));
boxes.push(new Platform(50, 340, 50, 10)); // \/
boxes.push(new Platform(250, 340, 40, 10));
boxes.push(new Platform(400, 340, 50, 10));
boxes.push(new Platform(1050, 200, 50, 10));
boxes.push(new Platform(1150, 100, 30, 10));

// strech goal
// // 1400 x 700px
// for (var i = 0; i < 25; i++){
//  var randWidth = Math.floor(Math.random() * 250) + 50;
//  var randHeight = Math.floor(Math.random() * 30) + 10;
//  var randX = Math.floor(Math.random() * 1300);
//  var randY = Math.floor(Math.random() * 650);
//  boxes.push(new Platform(randX, randY, randWidth, randHeight));
// }

// bottom, left, right boundaries
boxes.push({
  x: -10,
  y: height,
  width: width + 20,
  height: 10
});
boxes.push({
  x: -10,
  y: -120,
  width: 10,
  height: height + 125
});
boxes.push({
  x: width,
  y: -120,
  width: 10,
  height: height + 125
});

//coin constructor



function Coin(x, y) {
  this.x = x;
  this.y = y;
  this.width = 7;
  this.height = 7;
  this.sound = new Audio('./sound/SFX_Jump_12.wav');
}

//Coin.prototype.sound = new Audio('./sound/SFX_Jump_12.wav');

var coins = [];

// for (var i = 50; i < 1400; i += 100) {
//   coins.push(new Coin(i, 685));
// }

// for (var i = 0; i < boxes.length; i++) {
//   coins.push(new Coin(boxes[i].x + (boxes[i].width /2), boxes[i].y - 15));
// }

for (var i = 0; i < boxes.length; i++) {
  coins.push(new Coin(boxes[i].x + (boxes[i].width /2), boxes[i].y - 15));
}


// hard code addl coins on skinny platforms for now - multiple for loops wrecks performance
// (or just too many coins?)
coins.push(new Coin(525, 100));
coins.push(new Coin(75, 300));
coins.push(new Coin(75, 275));
coins.push(new Coin(75, 250));
coins.push(new Coin(75, 225));
coins.push(new Coin(1075, 150));
coins.push(new Coin(1075, 125));
coins.push(new Coin(1165, 65));
coins.push(new Coin(1165, 40));
coins.push(new Coin(1165, 15));
coins.push(new Coin(1125, 465));
coins.push(new Coin(1225, 465));

// for (var i = 50; i < 1400; i += 100) {
//   coins.push({
//     x: i,
//     y: 685,
//     width: 7,
//     height: 7,
//   });
// }

document.addEventListener('keydown', function(e) {
  //console.log(e.keyCode);
  keys[e.keyCode] = true;

  if (e.keyCode === 80) {
    playing ? pauseGame() : startGame();
  }
});

document.addEventListener('keyup', function(e) {
  keys[e.keyCode] = false;
  console.log(e.keyCode);
});


// B E H A V I O R

function move() {
  ////////// try adding numJumps. when not jump/grounded

  // up arrow/space
  if (keys[38]) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      p1jump.play();
      player.grounded = false;
      player.velY = -player.maxVelY;
    }
  };

  // right arrow
  if (keys[39]) {
    if (player.velX < player.maxVelX) {
      player.velX++;
    }
  };

  // left arrow
  if (keys[37]) {
    if (player.velX > -player.maxVelX) {
      player.velX--;
    }
  };

  player.velX *= friction; //.875
  player.velY += gravity;  // .6
  if (Math.abs(player.velY) >= player.maxVelY) player.velY = player.maxVelY;
}

function move2() {
  // up arrow/space
  if (keys[87]) {
    if (!player2.jumping && player2.grounded) {
      player2.jumping = true;
      p2jump.play();
      player2.grounded = false;
      player2.velY = -player2.maxVelY;

    }
  };

  // right arrow
  if (keys[68]) {
    if (player2.velX < player2.maxVelX) {
      player2.velX++;
    }
  };

  // left arrow
  if (keys[65]) {
    if (player2.velX > -player2.maxVelX) {
      player2.velX--;
    }
  };

  player2.velX *= friction; //.875
  player2.velY += gravity;  // .6
  if (Math.abs(player2.velY) >= player2.maxVelY) player2.velY = player2.maxVelY;
}


function collisionCheck(player, platform) {
  // get vectors to check against
  var actualDistanceX = (player.x + (player.width/2)) - (platform.x + (platform.width/2));
  var actualDistanceY = (player.y + (player.height/2)) - (platform.y + (platform.height/2));
  // add the half widths and half heights of the player and platform
  // minimum distance between origins
  var minDistanceOriginsX = (player.width/2) + (platform.width/2);
  var minDistanceOriginsY = (player.height/2) + (platform.height/2);
  // by default col dir is set to null
  var collisionDirection = null;

  // if the x and y vector are less than the half width or half height
  // (minimum distance between origin of player and platform)
  // then must be inside object, causing collision
  if (Math.abs(actualDistanceX) < minDistanceOriginsX && Math.abs(actualDistanceY) < minDistanceOriginsY) {
    // figures out on which side we are colliding (top, bottom, left, right)
    // difference between minimum distance between origins and actual distance between origins
    var overlapX = minDistanceOriginsX - Math.abs(actualDistanceX);
    var overlapY = minDistanceOriginsY - Math.abs(actualDistanceY);

    if (overlapX >= overlapY && actualDistanceY > 0) {
      // actualDistance > 0 === y coordinate of player > y coordinate of platform
      // player hits head/bottom of platform
      collisionDirection = 't';
      // player.y incremented = moved down distance needed to put at edge of platform
      player.y += overlapY;
    } else if (overlapX >= overlapY && actualDistanceY < 0) {
      // player hits feet/top of platform
      collisionDirection = 'b';
      player.y -= overlapY;
    } else if (overlapY >= overlapX && actualDistanceX > 0) {
      collisionDirection = 'l';
      player.x += overlapX;
    } else if (overlapY >= overlapX && actualDistanceX < 0) {
      collisionDirection = 'r';
      player.x -= overlapX;
    }
  }
  return collisionDirection;
};


function collisionCoin(player, coin) {
  var actualDistanceX = (player.x + (player.width/2)) - (coin.x + (coin.width/2));
  var actualDistanceY = (player.y + (player.height/2)) - (coin.y + (coin.height/2));
  var minDistanceOriginsX = (player.width/2) + (coin.width/2);
  var minDistanceOriginsY = (player.height/2) + (coin.height/2);
  var collision = false;
  if (Math.abs(actualDistanceX) < minDistanceOriginsX && Math.abs(actualDistanceY) < minDistanceOriginsY) {
    collision = true;
    // player.score++;
    // coin.clear();
    console.log('p1 score', player.score)
    console.log('coin!');
  }
  return collision;
}



// G A M E   L O O P

function update() {
  // ctx.clearRect(0,0,width,height);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  player.draw();
  move();
  player.grounded = false;

  player2.draw();
  move2();
  player2.grounded = false;

  // draw platforms & check for collisions
  ctx.fillStyle = "black";
  ctx.beginPath();
  for (var i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    var dir = collisionCheck(player, boxes[i]);
    var dir2 = collisionCheck(player2, boxes[i]);
    // var dirP = collisionCheck(player, player2);
    // var dirP2 = collisionCheck(player2, player);

    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.velY = 0;
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      // player.velY *= -1;
      player.velY = 0;
    }

    if (dir2 === "l" || dir2 === "r") {
      player2.velX = 0;
      player2.jumping = false;
    } else if (dir2 === "b") {
      player2.velY = 0;
      player2.grounded = true;
      player2.jumping = false;
    } else if (dir2 === "t") {
      // player2.velY *= -1;
      player2.velY = 0;
    }
  }

  if (player.grounded){
    player.velY = 0;
  }

  if (player2.grounded){
    player2.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  player2.x += player2.velX;
  player2.y += player2.velY;
  ctx.closePath();
  ctx.fill();

  // draw coins & check collision & clear coins
  ctx.fillStyle = "gold";
  ctx.beginPath();
  for (var i = 0; i < coins.length; i++) {
    ctx.rect(coins[i].x, coins[i].y, coins[i].width, coins[i].height);
    var coinCol = collisionCoin(player, coins[i]);
    var coinCol2 = collisionCoin(player2, coins[i]);
    ctx.fill();

    if (coinCol === true){
      coins[i].sound.play();
      coins.splice(i, 1);
      player.score++;
    }
    if (coinCol2 === true){
      coins[i].sound.play();
      coins.splice(i, 1);
      player2.score++;
    }

  }

  // display score
  document.getElementById('p1-score').textContent = player.score;
  document.getElementById('p2-score').textContent = player2.score;

  if (playing) requestAnimationFrame(update);
}


function startGame() {
  console.log('hello')
  if (!playing) {
    playing = true;
    update();
    timer(30);
  }
}
// div.innerhtml = timer

function pauseGame() {
  playing = false;
}

function winGame() {
  pauseGame();
  var winner;
  if (player.score > player2.score) {
    winner = player;
  } else {
    winner = player2;
  }
  timerDiv.innerHTML = winner.name + ' wins!';
  //return winner;
}

var start = document.getElementById('start');
start.addEventListener('click', startGame);

// once clicked, change to pause
