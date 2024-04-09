// consigne 1
// créer une classe Board qui prend en paramètre (dans la fonction constructor)
// - num_of_columns, num_of_squares
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
      innerHTML += this.drawColumn();
    }
    mainCtnr.innerHTML = innerHTML;
  }

  drawColumn() {
    let innerHTML = "";
    innerHTML += `<div class="column">`;
    for (let y = 0; y < this.squares; y++) {
      innerHTML += `<div class="square"></div>`;
    }
    innerHTML += `</div>`;
    return innerHTML;
  }
}

const board = new Board(10, 10);











