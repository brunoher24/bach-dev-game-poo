import BoardItem from "./BoardItem.js";

export default class Obstacle extends BoardItem {
  constructor(name, image, num) {
    super(name, image, "obstacle");
    this.num = num;
  }
}