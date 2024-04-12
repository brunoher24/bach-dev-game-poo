export default class BoardItem {
  constructor(name, image, type, board) {
    this.name = name;
    this.image = image;
    this.type = type;
    this.position = { x: -1, y: -1 };
  }

  setPosition({ x, y }) {
    this.position = { x, y };
  }
}