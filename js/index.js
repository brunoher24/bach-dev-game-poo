// consigne 1
// créer une classe Board qui prend en paramètre (dans la fonction constructor)
// - num_of_columns, num_of_squares

// consigne 2
// ajouter un eventListener se déclanchant au click de chaque case
// afficher dans la console les coordonnées (x, y) de la case cliquée

// consigne 3
// créer 3 classes : Player, Weapon, Obstacle, implémenter les propriétés qui semblent pertinentes
// pour les disposer ensuite sur le plateau de jeu

// consigne 4
// gérer le déplacement des joueurs : faire apparaitre en surbrillance les cases autour
// des joueurs sur lesquelles ils peuvent se déplacer (la case doit être vide ou avoir une arme)
// les joueurs peuvent se déplacer sur 4 cases : en haut en bas à droite ou à gauche

// consigne 5
// gérer le déplacement des joueurs au clique sur les cases disponibles autour d'eux
// quand un joueur se déplace sur une nouvelle case, la case précédente est "vidée" de sa présence
// les cases disponibles qui clignotent sont réinitialisées

// consigne 6
// créer une classe "parente" BoardItem de laquelle héritent les 3 classes Player, Obstacle & Weapon
// lien utile : https://www.w3schools.com/jsref/jsref_class_extends.asp

// consigne 7
// donner par défault à chaque joueur une même arme
// ajouter une propriété "damage" à la classe weapon 
// gérer le déplacement d'un joueur sur une arme :
// la case adjacente au joueur contenant une arme est cliquable
// au click sur cette case, le joueur "échange" son arme avec celle de la case
// lorsque le joueur quite cette case, il laisse son ancienne arme sur cette case

// consigne 8 
// rajouter une jauge de vie aux joueurs
// gestion du combat :
// quand les 2 joueurs arrivent côte à côte ( à 1 seule case d'écart ),
// un duel à mort s'engage entre eux.
// toutes les 3 secondes, un coup est porté par chaque joueur, tour à tour
// de façon aléatoire, le joueur qui reçoit le coup peut l'esquiver
// sinon, il subit un dommage équivalant aux dégats de l'arme qui l'a frappé
// lorsque l'un des 2 joueurs arrive à zéro de jauge de vie, la partie se 
// termine par la victoire de l'autre joueur
// Lors de chaque "mouvement", un message supplémentaire s'affiche en bas de page 
// pour que l'on puisse suivre le déroulement du combat

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let board;

class BoardItem {
  constructor(name, image, type) {
    this.name = name;
    this.image = image;
    this.type = type;
    this.position = { x: -1, y: -1 };
  }

  displayOnBoard({ x, y }) {
    this.position = { x, y };
    board.fillSquare(this);
  }
}

class Player extends BoardItem {
  constructor(name, image, number) {
    super(name, image, "player");
    this.number = number;
    this.weapon = new Weapon("crayon", "./assets/weapons/pencil.png");
    this.health = 100;
  }

  moves({ x, y }) {
    board.fillSquare(this, x, y);
    this.position = { x, y };
  }

  attacks(otherPlayer) {
    const dodge = Math.random() > 0.5;
    if (dodge) {
      console.log(`${otherPlayer.name} a évité l'attaque de ${this.name} !`);
    } else {
      otherPlayer.health -= this.weapon.damage;
      let txt = `${this.name} fait perdre ${this.weapon.damage} points de vie à ${otherPlayer.name} ! `;
      if (otherPlayer.health > 0) {
        txt += `Il ne lui reste plus que ${otherPlayer.health} point${otherPlayer.health > 1 ? "s" : ""} de vie...`;
      }
      console.log(txt);
    }
  }
}

class Obstacle extends BoardItem {
  constructor(name, image, num) {
    super(name, image, "obstacle");
    this.num = num;
  }
}

class Weapon extends BoardItem {
  constructor(name, image, damage = 5) {
    super(name, image, "weapon");
    this.damage = damage;
  }
}

class Board {
  constructor(columns, squares) {
    this.columns = columns;
    this.squares = squares;
    this.mainCtnr = document.querySelector("#game-board");
    this.fightHasStarted = false;
    this.allSquares = new Array(this.columns).fill(null)
      .map((_, x) => new Array(this.squares)
        .fill(null)
        .map((_, y) => ({ x, y, occupiedBy: null, playableBy: null })));
    this.draw();
    this.currentPlayer;
  }

  displayPlayerInfos(player) {
    const ctnr = document.querySelector(`.player${player.number}-infos`);
    ctnr.innerHTML = `<img src="${player.image}" />
    <span>${player.name}</span>
    <span><span>Arme :</span> ${player.weapon.name}</span>
    <span>Dégats : ${player.weapon.damage}</span>
    <span><span>Santé :</span> ${player.health}</span>`;
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
    this.handleAvailableSquaresAroundPlayer();
  }

  switchTurn() {
    this.currentPlayer.number === 1 ? this.setCurrentPlayer(players[1]) : this.setCurrentPlayer(players[0]);
  }

  draw() {
    let innerHTML = "";
    for (let x = 0; x < this.columns; x++) {
      innerHTML += this.drawColumn(x);
    }
    this.mainCtnr.innerHTML = innerHTML;
    this.mainCtnr.querySelectorAll(".square").forEach(square => {
      square.addEventListener("click", () => {
        if (this.fightHasStarted) return;
        const x = Number(square.dataset.x);
        const y = Number(square.dataset.y);
        const currentSquare = this.allSquares[x][y];
        if (currentSquare.playableBy === this.currentPlayer.number) {
          this.currentPlayer.moves({ x, y });
          if (!this.fightHasStarted) {
            this.switchTurn();
          }
        }
      });
    });
  }

  drawColumn(x) {
    // this.allSquares.push([]);
    // const lastIndex = this.allSquares.length - 1;
    let innerHTML = "";
    innerHTML += `<div class="column"> `;
    for (let y = 0; y < this.squares; y++) {
      const size = Math.floor(100 / this.squares - 1) + "vh";
      innerHTML += `<div data-x=${x} data-y=${y} id="_${x}-${y}" class="square" style="width:${size};height:${size}" ></div>`;
      // this.allSquares[lastIndex].push({ x, y, occupiedBy: null })
    }
    innerHTML += `</div>`;
    return innerHTML;
  }

  squareIsOccupiedByWeapon(x, y) {
    return this.allSquares[x][y].occupiedBy && this.allSquares[x][y].occupiedBy.type === "weapon";
  }

  playerTakesNewWeaponAndLeavesOldOne(x, y) {
    this.allSquares[x][y].transitionWeapon = this.currentPlayer.weapon;
    this.currentPlayer.weapon = this.allSquares[x][y].occupiedBy;
    this.displayPlayerInfos(this.currentPlayer);
  }

  startFight(player1, player2) {
    this.fightHasStarted = true;
    let attacking = player1, defending = player2;
    const interval = window.setInterval(() => {
      attacking.attacks(defending);
      if (defending.health <= 0) {
        console.log(`${attacking.name} a gagné.`);
        window.clearInterval(interval);
      } else {
        if (attacking.number === player1.number) {
          defending = player1;
          attacking = player2;
        } else {
          defending = player2;
          attacking = player1;
        }
      }
    }, 3000);
  }

  startFightIfPlayersAreClose(player1X, player1Y) {
    const otherPlayer = this.currentPlayer.number === 1 ? players[1] : players[0];
    const player2X = otherPlayer.position.x;
    const player2Y = otherPlayer.position.y;

    if ((player1X === player2X && [-1, 1].includes(player1Y - player2Y)) ||
      (player1Y === player2Y && [-1, 1].includes(player1X - player2X))) {
      this.clearUpPlayableSquares();
      this.displayFightSquares(player1X, player1Y, player2X, player2Y);
      this.startFight(this.currentPlayer, otherPlayer);
    }
  }

  fillSquare(item, newX = -1, newY = -1) {
    const { x, y } = item.position;
    if (newX > -1 && newY > -1) {
      if (this.squareIsOccupiedByWeapon(newX, newY)) {
        this.playerTakesNewWeaponAndLeavesOldOne(newX, newY);
      }
      const transitionWeapon = this.allSquares[x][y].transitionWeapon;
      if (transitionWeapon) {
        this.mainCtnr.querySelector(`#_${x}-${y}`).innerHTML = "<img src='" + this.allSquares[x][y].transitionWeapon.image + "' alt=''/>";
        this.allSquares[x][y].occupiedBy = transitionWeapon;
        this.allSquares[x][y].transitionWeapon = null;
      } else {
        this.mainCtnr.querySelector(`#_${x}-${y}`).innerHTML = "";
        this.allSquares[x][y].occupiedBy = null;
      }

      this.mainCtnr.querySelector(`#_${newX}-${newY}`).innerHTML = "<img src='" + item.image + "' alt=''/>";
      this.allSquares[newX][newY].occupiedBy = item;

      this.startFightIfPlayersAreClose(newX, newY);
    } else {
      const square = this.mainCtnr.querySelector(`#_${x}-${y}`);
      square.innerHTML = "<img src='" + item.image + "' alt=''/>";
      this.allSquares[x][y].occupiedBy = item;
    }
  }

  clearUpPlayableSquares() {
    this.mainCtnr.querySelectorAll(".playable-animated").forEach(square => {
      square.className = "square";
      this.allSquares[square.dataset.x][square.dataset.y].playableBy = null;
    });
  }

  displayFightSquares(x1, y1, x2, y2) {
    this.mainCtnr.querySelector(`#_${x1}-${y1}`).className = "square animated-fight-square";
    this.mainCtnr.querySelector(`#_${x2}-${y2}`).className = "square animated-fight-square";
  }

  handleAvailableSquaresAroundPlayer() {
    const { x, y } = this.currentPlayer.position;

    this.clearUpPlayableSquares();

    const prevColumn = this.allSquares[x - 1];
    const nextColumn = this.allSquares[x + 1];
    if (prevColumn && (!prevColumn[y].occupiedBy || prevColumn[y].occupiedBy.type === "weapon")) { // case gauche existe et est innocupée
      this.mainCtnr.querySelector(`#_${x - 1}-${y}`).className = "square playable-animated";
      this.allSquares[x - 1][y].playableBy = this.currentPlayer.number;
    }
    if (nextColumn && (!nextColumn[y].occupiedBy || nextColumn[y].occupiedBy.type === "weapon")) { // case droite existe et est innocupée
      this.mainCtnr.querySelector(`#_${x + 1}-${y}`).className = "square playable-animated";
      this.allSquares[x + 1][y].playableBy = this.currentPlayer.number;
    }

    if (this.allSquares[x][y - 1] && (!this.allSquares[x][y - 1].occupiedBy || this.allSquares[x][y - 1].occupiedBy.type === "weapon")) { // case haut existe et est innocupée
      this.mainCtnr.querySelector(`#_${x}-${y - 1}`).className = "square playable-animated";
      this.allSquares[x][y - 1].playableBy = this.currentPlayer.number;
    }

    if (this.allSquares[x][y + 1] && (!this.allSquares[x][y + 1].occupiedBy || this.allSquares[x][y + 1].occupiedBy.type === "weapon")) { // case bas existe et est innocupée
      this.mainCtnr.querySelector(`#_${x}-${y + 1}`).className = "square playable-animated";
      this.allSquares[x][y + 1].playableBy = this.currentPlayer.number;
    }
  }

  disposeItems(items) {
    items.forEach(item => {
      const num = item.num ? item.num : 1;
      for (let i = 0; i < num; i++) {
        const availableSquares = this.allSquares.slice(1, -1).map(squares => squares.slice(1, -1).filter(square => !square.occupiedBy)).filter(column => column.length > 0);
        const randX = item.type === "player" ? randomIntFromInterval(0, this.columns - 1) : randomIntFromInterval(0, availableSquares.length - 3);
        const randY = item.type === "player" ? item.number === 1 ? 0 : this.squares - 1 : randomIntFromInterval(0, availableSquares[randX].length - 1);
        const position = item.type === "player" ? { x: randX, y: randY } : { x: availableSquares[randX][randY].x, y: availableSquares[randX][randY].y };
        item.displayOnBoard(position);
      }
    });
  }
}


board = new Board(7, 7);

const players = [
  new Player('Michel', './assets/players/knight-1.png', 1),
  new Player('Jean-Pierre', './assets/players/knight-2.png', 2)
];

const obstacles = [
  new Obstacle('Rocher', './assets/obstacles/rock.png', 10)
];

const weapons = [
  new Weapon('Pistolet laser', './assets/weapons/laser-gun.png', 30),
  new Weapon('Epée', './assets/weapons/sword.png', 20),
  new Weapon('Dague', './assets/weapons/knife.png', 10),
];

board.disposeItems(obstacles);
board.disposeItems(weapons);
board.disposeItems(players);
board.setCurrentPlayer(players[randomIntFromInterval(0, 1)]);
board.displayPlayerInfos(players[0]);
board.displayPlayerInfos(players[1]);
