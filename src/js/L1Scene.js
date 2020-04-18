//import Phaser from 'phaser';
import Player from './Player.js';
import Puffball from './Puffball.js';

export default class L1Scene extends Phaser.Scene{
    constructor(){
        super('l1-scene')
    }

    preload(){
        this.load.image('sky','src/assets/sky.png');
        this.load.image('black','src/assets/black.png');
        this.load.image('platform','src/assets/platform.png');
        this.load.image('carrying','src/assets/carrying.png');
        this.load.image('notcarrying','src/assets/notcarrying.png');
        this.load.image('puffball','src/assets/puffball.png');
        this.load.image('puffball-dead','src/assets/puffball_dead.png');
    }

    create(){
        let { width, height } = this.sys.game.canvas;
        this.add.tileSprite(0,0,width,height,'sky').setOrigin(0,0);

        // Add objects to the scene
        const platforms = this.createPlatforms();
        this.player = new Player(this,100,300);
        this.puffball = new Puffball(this,200,200);
        this.player.caught(this.puffball)

        // Set up interactions etc.
        this.physics.add.collider(this.player,platforms);
        this.physics.add.overlap(this.player,this.puffball,
            () => this.player.caught(this.puffball));
        this.physics.add.overlap(this.puffball,platforms,
            () => this.puffball.die());
        this.physics.add.collider(this.puffball,platforms);


        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update(){
        this.player.doControls(this.cursors);
        this.puffball.update();
    }

    createPlatforms(){
        let { width, height } = this.sys.game.canvas;
        const platforms = this.physics.add.staticGroup();
        let ground = platforms.create(width/2,height-50,'platform');
        return platforms
    }
}


