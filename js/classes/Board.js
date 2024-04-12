import { randomIntFromInterval } from "../utilities.js";


export default class Board {
  constructor(columns, squares, obstacles, weapons, players) {
    this.columns = columns;
    this.squares = squares;
    this.obstacles = obstacles;
    this.weapons = weapons;
    this.players = players;
    this.mainCtnr = document.querySelector("#game-board");
    this.fightHasStarted = false;
    this.allSquares = new Array(this.columns).fill(null)
      .map((_, x) => new Array(this.squares)
        .fill(null)
        .map((_, y) => ({ x, y, occupiedBy: null, playableBy: null })));
    this.draw();
    this.currentPlayer;
  }

  startNewGame() {
    this.disposeItems(this.obstacles);
    this.disposeItems(this.weapons);
    this.disposeItems(this.players);
    this.setCurrentPlayer(this.players[randomIntFromInterval(0, 1)]);
    this.displayPlayerInfos(this.players[0]);
    this.displayPlayerInfos(this.players[1]);
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
    this.currentPlayer.number === 1 ? this.setCurrentPlayer(this.players[1]) : this.setCurrentPlayer(this.players[0]);
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
          this.fillSquare(this.currentPlayer, x, y);
          this.currentPlayer.setPosition({ x, y });
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
      this.displayPlayerInfos(defending);
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
    const otherPlayer = this.currentPlayer.number === 1 ? this.players[1] : this.players[0];
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
        item.setPosition(position);
        this.fillSquare(item);
      }
    });
  }
}
