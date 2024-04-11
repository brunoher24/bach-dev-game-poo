// consigne 1
// créer une classe Board qui prend en paramètre (dans la fonction constructor)
// - num_of_columns, num_of_squares

// consigne 2
// ajouter un eventListener se déclanchant au click de chaque case
// afficher dans la console les coordonnées (x, y) de la case cliquée

// consigne 3
// créer 3 classes : Player, Weapon, Obstacle, implémenter les propriétés qui semblent pertinentes
// pour les disposer ensuite sur le plateau de jeu


function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let board;

class Player {
  constructor(name, image, number) {
    this.name = name;
    this.image = image;
    this.position = { x: -1, y: -1 };
    this.type = "player";
    this.number = number;
  }

  displayOnBoard({ x, y }) {
    this.position = { x, y };
    board.fillSquare(this);
  }
}

class Obstacle {
  constructor(name, image, num) {
    this.name = name;
    this.image = image;
    this.position = { x: -1, y: -1 };
    this.type = "obstacle";
    this.num = num;
  }

  displayOnBoard({ x, y }) {
    this.position = { x, y };
    board.fillSquare(this);
  }
}

class Weapon {
  constructor(name, image) {
    this.name = name;
    this.image = image;
    this.position = { x: -1, y: -1 };
    this.type = "weapon";
  }

  displayOnBoard({ x, y }) {
    this.position = { x, y };
    board.fillSquare(this);
  }
}

class Board {
  NUM_OF_OBSTACLES = 20;
  constructor(columns, squares) {
    this.columns = columns;
    this.squares = squares;
    this.mainCtnr = document.querySelector("#game-board");
    this.allSquares = new Array(this.columns).fill(null)
      .map((_, x) => new Array(this.squares).fill(null).map((_, y) => ({ x, y, occupiedBy: null, isOccupied: false })));
    this.draw();
  }

  draw() {
    let innerHTML = "";
    for (let x = 0; x < this.columns; x++) {
      innerHTML += this.drawColumn(x);
    }
    this.mainCtnr.innerHTML = innerHTML;
    this.mainCtnr.querySelectorAll(".square").forEach(square => {
      square.addEventListener("click", e => {
        const { x, y } = e.target.dataset;
        console.log({ x, y });
      });
    });
  }

  drawColumn(x) {
    let innerHTML = "";
    innerHTML += `<div class="column">`;
    for (let y = 0; y < this.squares; y++) {
      const size = (100 / this.squares - 1) + "vh";
      innerHTML += `<div data-x=${x} data-y=${y} id="_${x}-${y}" class="square" style="width:${size};height:${size}"></div>`;
    }
    innerHTML += `</div>`;
    return innerHTML;
  }

  fillSquare(item, newX, newY) {
    const { x, y } = item.position;
    if (newX && newY) {
      this.mainCtnr.querySelector(`#_${item.x}-${item.y}`).innerHTML = "";
      this.mainCtnr.querySelector(`#_${newX}-${newY}`).innerHTML = "<img src='" + item.image + "' alt=''/>";
      this.allSquares[x][y].occupiedBy = null;
      this.allSquares[x][y].isOccupied = false;
      this.allSquares[newX][newY].occupiedBy = item;
      this.allSquares[newX][newY].isOccupied = true;
    } else {
      const square = this.mainCtnr.querySelector(`#_${x}-${y}`);
      square.innerHTML = "<img src='" + item.image + "' alt=''/>";
      this.allSquares[x][y].occupiedBy = item;
      this.allSquares[x][y].isOccupied = true;
    }
  }

  disposeItems(items) {
    items.forEach(item => {
      const num = item.type === "obstacle" ? this.NUM_OF_OBSTACLES : 1;
      for (let i = 0; i < num; i++) {
        const availableSquares = this.allSquares.slice(1, -1).map(squares => squares.slice(1, -1).filter(square => !square.isOccupied));
        const randX = item.type === "player" ? randomIntFromInterval(0, this.columns - 1) : randomIntFromInterval(0, this.columns - 3);
        const randY = item.type === "player" ? item.number === 1 ? 0 : this.squares - 1 : randomIntFromInterval(0, availableSquares[randX].length - 1);
        const position = item.type === "player" ? { x: randX, y: randY } : { x: availableSquares[randX][randY].x, y: availableSquares[randX][randY].y };
        item.displayOnBoard(position);
      }
    });
  }

  canFillSquare(x, y) { }
}

board = new Board(15, 15);

const players = [
  new Player('Michel', './assets/players/knight-1.png', 1),
  new Player('Jean-Pierre', './assets/players/knight-2.png', 2)
];

const obstacles = [
  new Obstacle('Rocher', './assets/obstacles/rock.png', 30)
];

const weapons = [
  new Weapon('Pistolet laser', './assets/weapons/laser-gun.png'),
  new Weapon('Epée', './assets/weapons/sword.png'),
  new Weapon('Dague', './assets/weapons/knife.png'),
];

board.disposeItems(players);
board.disposeItems(obstacles);
board.disposeItems(weapons);
