// physics and collision detection from: http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// D A T A

// var camera;
// save(); translate(-camera.x, -camera.y); draw(); restore();

var width = 800;
var height = 400;
canvas.width = width;
canvas.height = height;

var player = {
  x: 100,   // x axis position
  y: height - 20, // y axis position
  width: 10,
  height: 20,
  speed: 6,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  //jumping: 0,
  draw: function() {
    ctx.fillStyle = '#09F';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
};

var player2 = {
  x: width - 100,   // x axis position
  y: height - 20, // y axis position
  width: 10,
  height: 20,
  speed: 6,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  //jumping: 0,
  draw: function() {
    ctx.fillStyle = 'rgb(255, 162, 167)';
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  }
};

var p1jump = document.getElementById('p1-jump');
var p2jump = document.getElementById('p2-jump');

var keys = [];

var friction = 0.875;
var gravity = 0.6;


// platform constructor

// function Platform(x, y, width, height) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.draw = function(){
//     ctx.fillStyle = '#000';
//     ctx.fillRect(Platform.x, Platform.y, Platform.width, Platform.height);
//   }
// }

var boxes = [];
// bottom, right, left boundaries
boxes.push({
  x: 0,
  y: height - 1,
  width: width,
  height: 1
});
boxes.push({
  x: width - 1,
  y: 0,
  width: 1,
  height: height
});
boxes.push({
  x: 0,
  y: 0,
  width: 1,
  height: height
});
// test platforms
for (var i = 100; i <= 5000; i = i + 300) {
  boxes.push({
    x: i,
    y: 350,
    width: 150,
    height: 10
  });
}

boxes.push({
  x: 200,
  y: 250,
  width: 150,
  height: 50
});
boxes.push({
  x: 400,
  y: 200,
  width: 150,
  height: 10
});
boxes.push({
  x: 350,
  y: 350,
  width: 100,
  height: 10
})

document.addEventListener('keydown', function(e) {
  //console.log(e.keyCode);
  keys[e.keyCode] = true;
});

document.addEventListener('keyup', function(e) {
  keys[e.keyCode] = false;
  console.log(e.keyCode);
});


// B E H A V I O R

function move() {
  ////////// try adding numJumps. when not jump/grounded

  // up arrow/space
  if (keys[38] || keys[32]) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      p1jump.play();
      player.grounded = false;
      player.velY = -player.speed*2;

    }
  };

  // if (keys[38] || keys[32]) {
  //   player.jumping = 0;
  //   player.jumping++;
  //   if (player.jumping < 3) {
  //     console.log('jump', player.jumping);
  //     player.velY = -player.speed*2;
  //     console.log('velY', player.velY);
  //     console.log('speed', player.speed);
  //   }
  // };

  // right arrow
  if (keys[39]) {
    if (player.velX < player.speed) {
      player.velX++;
    }
  };

  // left arrow
  if (keys[37]) {
    if (player.velX > -player.speed) {
      player.velX--;
    }
  };

  player.velX *= friction; //.875
  player.velY += gravity;  // .6
}

function move2() {
  ////////// try adding numJumps. when not jump/grounded

  // up arrow/space
  if (keys[87]) {
    if (!player2.jumping && player2.grounded) {
      player2.jumping = true;
      p2jump.play();
      player2.grounded = false;
      player2.velY = -player2.speed*2;

    }
  };

  // if (keys[38] || keys[32]) {
  //   player.jumping = 0;
  //   player.jumping++;
  //   if (player.jumping < 3) {
  //     console.log('jump', player.jumping);
  //     player.velY = -player.speed*2;
  //     console.log('velY', player.velY);
  //     console.log('speed', player.speed);
  //   }
  // };

  // right arrow
  if (keys[68]) {
    if (player2.velX < player2.speed) {
      player2.velX++;
    }
  };

  // left arrow
  if (keys[65]) {
    if (player2.velX > -player2.speed) {
      player2.velX--;
    }
  };

  player2.velX *= friction; //.875
  player2.velY += gravity;  // .6
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
      // player hits feet/top of platform
      // actualDistance > 0 === y coordinate of player > y coordinate of platform
      collisionDirection = 't';
      // player.y incremented = moved down distance needed to put at edge of platform
      player.y += overlapY;
    } else if (overlapX >= overlapY && actualDistanceY < 0) {
      // player hits head/bottom of platform
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



// G A M E   L O O P

function update() {

  // ctx.translate(-player.x, 0);

  // ctx.clearRect(0,0,width,height);

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  player.draw();
  move();
  player.grounded = false;

  player2.draw();
  move2();
  player2.grounded = false;

  ctx.fillStyle = "black";
  ctx.beginPath();
  for (var i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    var dir = collisionCheck(player, boxes[i]);
    var dir2 = collisionCheck(player2, boxes[i]);
    var dirP = collisionCheck(player, player2);
    var dirP2 = collisionCheck(player2, player);

    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY *= -1;
    }

    if (dir2 === "l" || dir2 === "r") {
      player2.velX = 0;
      player2.jumping = false;
    } else if (dir2 === "b") {
      player2.grounded = true;
      player2.jumping = false;
    } else if (dir2 === "t") {
      player2.velY *= -1;
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

  ctx.fill();

  requestAnimationFrame(update);
}

update();




