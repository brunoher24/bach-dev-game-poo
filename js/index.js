import Board from "./classes/Board.js";
import Obstacle from "./classes/Obstacle.js";
import Player from "./classes/Player.js";
import Weapon from "./classes/Weapon.js";

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

const board = new Board(14, 14, obstacles, weapons, players);
board.startNewGame();
