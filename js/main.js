var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); // obtain rendering context
// set canvas dimensions w/ variables instead of html attributes to move player in relation to canvas
var width = 1000;
var height = 400;
canvas.width = width;
canvas.height = height;

var player = {
  x: width/2,   // x axis position
  y: height-20, // y axis position
  width: 10,
  height: 20,
  speed: 6,
  velX: 0,
  velY: 0,
  jumping: false,
  draw: function() {
    ctx.fillStyle = '#09F';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}
var keys = [];
var gravity = 0.6;

document.addEventListener('keydown', function(e) {
  //console.log(e.keyCode);
  keys[e.keyCode] = true;
});

document.addEventListener('keyup', function(e) {
  keys[e.keyCode] = false;
  console.log(e.keyCode);
});


function move() {
if (keys[38] || keys[32]) {
  if (!player.jumping) {
    player.jumping = true;
    player.velY = -player.speed*2;
  }
}
if (keys[39]) {
  if (player.velX < player.speed) {
    player.velX++;
    //console.log(player.velX);
  }
}
if (keys[37]) {
  if (player.velX > -player.speed) {
    player.velX--;
    //console.log(player.velX);
  }
}

player.velX *= friction;
player.velY += gravity;

player.x += player.velX;
player.y += player.velY;

// check horizontal boundary
if (player.x >= width-player.width) {
    player.x = width-player.width;
} else if (player.x <= 0) {
    player.x = 0;
}
// check vertical boundary
if (player.y >= height-player.height){
        player.y = height - player.height;
        player.jumping = false;
    }
}

// GAME LOOP
function update() {
  ctx.clearRect(0,0,width,height);
  //////// trailing effect
  // ctx.fillStyle = 'rgba(255,255,255,0.3)';
  // ctx.fillRect(0,0,canvas.width,canvas.height);
  move();
  player.draw();
  requestAnimationFrame(update);
}

update();




