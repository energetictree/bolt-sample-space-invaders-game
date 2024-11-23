import { Player } from './Player';
import { Enemy } from './Enemy';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = new Player(canvas);
    this.enemies = [];
    this.keys = {};
    this.score = 0;
    this.gameOver = false;

    this.createEnemies();
    this.setupControls();
  }

  createEnemies() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        this.enemies.push(new Enemy(col * 60 + 50, row * 50 + 30));
      }
    }
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ') {
        this.player.shoot();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  checkCollisions() {
    this.player.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach((enemy, enemyIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          this.player.bullets.splice(bulletIndex, 1);
          this.enemies.splice(enemyIndex, 1);
          this.score += 100;
        }
      });
    });

    this.enemies.forEach(enemy => {
      if (enemy.y + enemy.height >= this.player.y) {
        this.gameOver = true;
      }
    });
  }

  update() {
    if (this.gameOver) return;

    if (this.keys['ArrowLeft']) {
      this.player.move('left');
    }
    if (this.keys['ArrowRight']) {
      this.player.move('right');
    }

    let shouldMoveDown = false;
    this.enemies.forEach(enemy => {
      enemy.move();
      if (
        enemy.x + enemy.width >= this.canvas.width ||
        enemy.x <= 0
      ) {
        shouldMoveDown = true;
      }
    });

    if (shouldMoveDown) {
      this.enemies.forEach(enemy => {
        enemy.direction *= -1;
        enemy.moveDown();
      });
    }

    this.checkCollisions();
  }

  draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.draw(this.ctx);
    this.enemies.forEach(enemy => enemy.draw(this.ctx));

    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 25);

    if (this.gameOver) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '40px Arial';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2 - 100, this.canvas.height / 2);
    }
  }
}
