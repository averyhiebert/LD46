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

        this.load.image('tileset','src/assets/tiles/tileset.png');
        this.load.tilemapCSV('test-level','src/assets/tiles/test_level.csv');
    }

    create(){
        let { width, height } = this.sys.game.canvas;
        this.add.tileSprite(0,0,width,height,'sky')
            .setOrigin(0,0)
            .setScrollFactor(0)

        // Draw the tilemap
        //let level_data = this.cache.json.get('test-level');
        const map = this.make.tilemap({key:'test-level',tileWidth:50,
            tileHeight:50});
        const tiles = map.addTilesetImage('tileset');
        const layer = map.createStaticLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(1,3);
        this.layer = layer;

        // Add objects to the scene
        this.player = new Player(this,100,300);
        this.puffball = new Puffball(this,200,200);
        this.player.caught(this.puffball)

        // Set up interactions etc.
        this.physics.add.collider(this.player,layer);
        this.physics.add.overlap(this.player,this.puffball,
            () => this.player.caught(this.puffball));
        this.physics.add.collider(this.puffball,layer,
            () => this.puffball.die());

        // Make camera follow player
        const cam = this.cameras.main;
        cam.startFollow(this.player);
        cam.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update(){
        this.player.doControls(this.cursors);
        this.puffball.update();
        // Hack to handle overlap on puffball when carried:
        //  (This is still not ideal and I need to find a better fix.)
        var tile = this.layer.getTileAtWorldXY(this.puffball.x,this.puffball.y);
        if (tile && tile.index >= 1){
            this.puffball.die();
        }
    }
}//Scene


