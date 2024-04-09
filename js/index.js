// consigne 1
// créer une classe Board qui prend en paramètre (dans la fonction constructor)
// - num_of_columns, num_of_squares

// consigne 2
// ajouter un eventListener se déclanchant au click de chaque case
// afficher dans la console les coordonnées (x, y) de la case cliquée

// consigne 3
// créer 3 classes : Player, Weapon, Obstacle, implémenter les propriétés qui semblent pertinentes
// pour les disposer ensuite sur le plateau de jeu


// exemple :
class Player {
  constructor(name) {
    this.name = name;
    this.x = -1;
    this.y = -1;
  }

  displayOnBoard(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Board {
  constructor(columns, squares) {
    this.columns = columns;
    this.squares = squares;
    this.draw();
  }

  draw() {
    const mainCtnr = document.querySelector("#game-board");
    let innerHTML = "";
    for (let x = 0; x < this.columns; x++) {
      innerHTML += this.drawColumn(x);
    }
    mainCtnr.innerHTML = innerHTML;
    mainCtnr.querySelectorAll(".square").forEach(square => {
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
      innerHTML += `<div data-x=${x} data-y=${y} class="square"></div>`;
    }
    innerHTML += `</div>`;
    return innerHTML;
  }
}

const board = new Board(10, 10);











