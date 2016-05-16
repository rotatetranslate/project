(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); // obtain rendering context
// set canvas dimensions w/ variables instead of html attributes to move player in relation to canvas
var width = 600;
var height = 400;
var player = {
  x: width/2,   // x axis position
  y: height-20, // y axis position
  width: 10,
  height: 20,
  speed: 3,
  velX: 0,
  velY: 0
}
var keys = []; // array required to capture simultaneous key presses, ie. up & right when jumping

canvas.width = width;
canvas.height = height;

document.addEventListener('keydown', function(e) {
  console.log(e.keyCode);
  keys[e.keyCode] = true;
});

document.addEventListener('keyup', function(e) {
  //console.log(e.keyCode);
  keys[e.keyCode] = false;
});

// check keys & movement
// arrowleft
if (keys[37]) {
  player.x -= 5;
}

// function draw(){
//   requestAnimationFrame(draw);
// }
// draw();
/////////////////////
// requestAnimationFrame(draw, element)

//animation loop
function draw() {

  if (keys[37]) {
    player.x -= 5;
  } else if (keys[39]) {
    player.x += 5;
  } else if (keys[38]) {
    player.y -= 5;
  } else if (keys[40]) {
    player.y += 5;
  }


  // rectangle to represent player
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = '#09F';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  requestAnimationFrame(draw);
}

draw();




