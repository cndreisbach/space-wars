var CANVAS_WIDTH = 600,
CANVAS_HEIGHT = 400,
FPS = 30;

var gameOver = false;
var score = 0;

var Color = {
  black: "#000",
  green: "#C3FF68"
};

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
};    

var player = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT - 50,
  width: 20,
  height: 30,
};

player.explode = function() {
  this.active = false;
  gameOver = true;
  // Extra Credit: Add an explosion graphic and then end the game
};

player.sprite = Sprite("player");

player.draw = function() {
  this.sprite.draw(canvas, this.x, this.y);
};

player.shoot = function() {
  var bulletPosition = this.midpoint();

  player.bullets.push(Bullet({
    speed: 5,
    x: bulletPosition.x,
    y: bulletPosition.y
  }));
};

player.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

player.bullets = [];

function Bullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 3;
  I.color = Color.green;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
    I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    // Extra Credit: Add an explosion graphic
    this.active = false;

  };

  return I;
}

enemies = [];

function Enemy(I) {
  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);

  I.color = "#A2B";

  I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
  I.y = 0;
  I.xVelocity = 0
  I.yVelocity = 2;

  I.width = 32;
  I.height = 32;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
    I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.sprite = Sprite("enemy");

  I.draw = function() {
    this.sprite.draw(canvas, this.x, this.y);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

    I.age++;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    // Extra Credit: Add an explosion graphic
    score += 1;
    this.active = false;
  };

  return I;
};

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
  "' height='" + CANVAS_HEIGHT + "'></canvas");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

function update() {
  if(keydown.space) {
    player.shoot();
  }

  if(keydown.left) {
    player.x -= 5;
  }

  if(keydown.right) {
    player.x += 5;
  }

  player.x = clamp(player.x, 0, CANVAS_WIDTH - player.width);
  
  player.bullets.forEach(function(bullet) {
    bullet.update();
  });

  player.bullets = player.bullets.filter(function(bullet) {
    return bullet.active;
  });
  
  enemies.forEach(function(enemy) {
    enemy.update();
  });

  enemies = enemies.filter(function(enemy) {
    return enemy.active;
  });

  handleCollisions();

  if(Math.random() < 0.1) {
    enemies.push(Enemy());
  }
}

function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();
  
  player.bullets.forEach(function(bullet) {
    bullet.draw();
  });

  enemies.forEach(function(enemy) {
    enemy.draw();
  });

  
  canvas.fillStyle = Color.green;
  canvas.textAlign = 'left';
  canvas.font = "14pt Audiowide";
  canvas.fillText(score, 10, 30);
}

function collides(a, b) {
  return a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;
}

function handleCollisions() {
  player.bullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if(collides(bullet, enemy)) {
        enemy.explode();
        bullet.active = false;
      }
    });
  });

  enemies.forEach(function(enemy) {
    if(collides(enemy, player)) {
      enemy.explode();
      player.explode();
    }
  });
}

function gameLoop() {
  update();
  draw();
  if (gameOver) {
    canvas.fillStyle = Color.green;
    canvas.textAlign = 'center';
    canvas.font = "32pt Audiowide";
    canvas.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    // draw game over
  } else {
    setTimeout(gameLoop, 1000/FPS);    
  }
}

$(document).ready(function () {
  gameLoop();
})
