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
        this.load.image('blob1','src/assets/blobs/blob1.png');
        this.load.spritesheet('player',
            'src/assets/player.png',
            {frameWidth: 50, frameHeight: 100}
        );

        this.load.image('tileset','src/assets/level/tileset.png');
        this.load.tilemapCSV('test-level','src/assets/level/test_level.csv');
    }

    create(){
        this.createAnimations();

        let { width, height } = this.sys.game.canvas;
        //Background & tilemap
        this.add.tileSprite(0,0,width,height,'sky')
            .setOrigin(0,0)
            .setScrollFactor(0)
        const map = this.make.tilemap({key:'test-level',tileWidth:50,
            tileHeight:50});
        const tiles = map.addTilesetImage('tileset');
        const layer = map.createStaticLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(0,4);
        this.layer = layer;

        // Add particle emitter for puffball death.
        var particles = this.add.particles('blob1');
        let deathEmitter = particles.createEmitter({
            lifespan: 1000,
            gravityY: 1000,
            rotate:{min:0,max:360},
            scale: {start: 2, end: 0},
            frequency:10,
            quantity: 20
        });
        deathEmitter.on = false;

        // Add objects to the scene
        this.player = new Player(this,100,300);
        this.puffball = new Puffball(this,200,200,deathEmitter);
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
        cam.followOffset.set(0,50);
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

    createAnimations(){
        this.anims.create({
            key: 'carry-walk',
            frames: this.anims.generateFrameNumbers('player',{start:3,end:8}),
            framerate:5,
            repeat:-1
        });

        this.anims.create({
            key: 'carry-idle',
            frames: this.anims.generateFrameNumbers('player',{start:0,end:0}),
            framerate:5,
            repeat:-1
        });

        this.anims.create({
            key: 'carry-jump',
            frames: this.anims.generateFrameNumbers('player',{start:15,end:15}),
            framerate:5,
            repeat:-1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player',{start:9,end:14}),
            framerate:5,
            repeat:-1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player',{start:1,end:1}),
            framerate:5,
            repeat:-1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player',{start:16,end:16}),
            framerate:5,
            repeat:-1
        });
    }
}//Scene


