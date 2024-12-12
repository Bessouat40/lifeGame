const size = 500;
let width = window.innerWidth;
let height = window.innerHeight;

const params = new URLSearchParams(window.location.search);

const threshold = parseFloat(params.get('threshold') ?? 0.5);
const time = parseInt(params.get('time') ?? 50);

let matrix = Array.from({ length: size }, () => {
  return Array.from({ length: size }, () => {
    return Math.random() < threshold ? 1 : 255;
  });
});

class LifeGame {
  constructor(height, width, time, threshold) {
    this.height = height;
    this.width = width;
    this.time = time;
    this.matrix = this.createMatrix(threshold);
    this.data = this.createData(this.matrix);
    this.drawImage();
  }

  createMatrix(threshold) {
    return Array.from({ length: this.width }, () =>
      Array.from({ length: this.height }, () =>
        Math.random() < threshold ? 1 : 255
      )
    );
  }

  updateMatrix(matrix) {
    return matrix.map((row, x) => {
      return row.map((cell, y) => {
        const neighbors = this.countNeighbors(matrix, x, y);
        return this.computeNewValue(neighbors, cell);
      });
    });
  }

  computeNewValue(neighbors, value) {
    if (neighbors === 3) {
      return 1;
    }
    if (neighbors === 2) {
      return value;
    } else {
      return 255;
    }
  }

  countNeighbors(matrix, x, y) {
    let sum = 0;
    if (x > 0) {
      matrix[x - 1][y] === 1 ? sum++ : sum;
    }
    if (x < this.width - 1) {
      matrix[x + 1][y] === 1 ? sum++ : sum;
    }
    if (y > 0) {
      matrix[x][y - 1] === 1 ? sum++ : sum;
    }
    if (y < this.height - 1) {
      matrix[x][y + 1] === 1 ? sum++ : sum;
    }
    if (x > 0 && y > 0) {
      matrix[x - 1][y - 1] === 1 ? sum++ : sum;
    }
    if (x < this.width - 1 && y < this.height - 1) {
      matrix[x + 1][y + 1] === 1 ? sum++ : sum;
    }
    if (x > 0 && y < this.height - 1) {
      matrix[x - 1][y + 1] === 1 ? sum++ : sum;
    }
    if (x < this.width - 1 && y > 0) {
      matrix[x + 1][y - 1] === 1 ? sum++ : sum;
    }
    return sum;
  }

  createData(matrix) {
    return matrix.flatMap((row) =>
      row.flatMap((cell) => [cell, cell, cell, 255])
    );
  }

  drawImage() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(this.width, this.height);
    imageData.data.set(this.data);
    ctx.putImageData(imageData, 0, 0);
  }

  updateImage() {
    this.matrix = this.updateMatrix(this.matrix);
    this.data = this.createData(this.matrix);
    this.drawImage();
  }
}

let lifeGame = new LifeGame(height, width, time, threshold);

setInterval(() => lifeGame.updateImage(), time);
