import BoardItem from "./BoardItem.js";

export default class Weapon extends BoardItem {
  constructor(name, image, damage = 5) {
    super(name, image, "weapon");
    this.damage = damage;
  }
}