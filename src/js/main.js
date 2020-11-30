//import Phaser from 'phaser'
import L1Scene from './L1Scene.js'

const GAME_DEBUG_MODE = true;

var map_width = 800;
var map_height = 550;

// Set up Phaser
var config = {
    //type: Phaser.AUTO,
    type: Phaser.CANVAS,
    width: map_width,
    height: map_height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 350}
        }
    },
    scene:[L1Scene],
    parent:"gamediv",
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autocenter: Phaser.Scale.CENTER_BOTH,
        width:128,
        height:88
    }
}

export default new Phaser.Game(config)
