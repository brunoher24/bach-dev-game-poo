import BoardItem from "./BoardItem.js";
import Weapon from "./Weapon.js";

export default class Player extends BoardItem {
  constructor(name, image, number) {
    super(name, image, "player");
    this.number = number;
    this.weapon = new Weapon("crayon", "./assets/weapons/pencil.png");
    this.health = 100;
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
