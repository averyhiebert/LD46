//import Phaser from 'phaser'
import L1Scene from './L1Scene.js'

const GAME_DEBUG_MODE = true;

var map_width = 539
var map_height = 514;

// Set up Phaser
var config = {
    type: Phaser.AUTO,
    width: map_width,
    height: map_height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1000}
        }
    },
    scene:[L1Scene],
    parent:"gamediv"
}

export default new Phaser.Game(config)
