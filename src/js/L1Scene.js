//import Phaser from 'phaser';
import Player from './Player.js';
import Puffball from './Puffball.js';
import Button from './Button.js';
import Box from './Box.js';
import Saw from './Saw.js';

export default class L1Scene extends Phaser.Scene{
    constructor(){
        super('l1-scene')
    }

    init(data){
        this.curr_checkpoint = data.curr_checkpoint || 0;
    }

    preload(){
        this.load.image('sky','src/assets/sky.png');
        this.load.image('controls','src/assets/interface/controls.png');
        this.load.image('victory','src/assets/interface/victory_message.png');
        this.load.image('puffball','src/assets/sprites/puffball.png');
        this.load.image('puffball-dead','src/assets/sprites/puffball_dead.png');
        this.load.image('box','src/assets/sprites/box.png');
        this.load.image('maze-block','src/assets/sprites/maze_block.png');
        this.load.image('blade','src/assets/sprites/blade.png');
        this.load.image('grate','src/assets/sprites/grate.png');
        this.load.image('blob1','src/assets/sprites/blob.png');
        this.load.spritesheet('pixel-puffball',
            'src/assets/sprites/pixel_puffball.png',
            {frameWidth:8,frameHeight:8}
        );
        this.load.spritesheet('player',
            'src/assets/sprites/guy.png',
            {frameWidth: 16, frameHeight: 16}
        );
        this.load.spritesheet('button',
            'src/assets/sprites/button.png',
            {frameWidth: 50, frameHeight: 50}
        );
        this.load.spritesheet('monster',
            'src/assets/sprites/monster.png',
            {frameWidth: 300, frameHeight: 500}
        );

        this.load.image('tileset','src/assets/level/tileset.png');
        this.load.tilemapCSV('test-level','src/assets/level/level1.csv');
    }

    create(){
        this.createAnimations();
        this.checkpoints = [
            [200,300], // Start
            [3350,300], // Start of stone area
            //[6200,300], // Start of bridge (testing checkpoint)
            [8250,300],  // Castle entrance
            //[10350,1050],  // End of castle (testing checkpoint)
        ];

        let { width, height } = this.sys.game.canvas;
        //Background & tilemap
        this.add.tileSprite(0,0,width,height,'sky')
            .setOrigin(0,0)
            .setScrollFactor(0)
        const map = this.make.tilemap({key:'test-level',tileWidth:50,
            tileHeight:50});
        const tiles = map.addTilesetImage('tileset');
        const layer = map.createStaticLayer(0, tiles, 0, 0);
        layer.setCollisionBetween(0,14);
        this.layer = layer;
        //Hack, for the hacky puffball backup checks 
        this.safeTiles = [-1,15]
        // Other images
        this.add.image(200,230,'controls');

        // Add particle emitter for puffball death.
        // TODO: Move this to Puffball class.
        var particles = this.add.particles('blob1');
        let deathEmitter = particles.createEmitter({
            lifespan: 1000,
            gravityY: 1000,
            rotate:{min:0,max:360},
            scale: 2,
            alpha: {start:1,end:0},
            frequency:10,
            quantity: 20
        });
        particles.setDepth(10);
        deathEmitter.on = false;

        // Player & Puffball ========================================
        this.player = this.spawnPlayer();
        this.puffball = new Puffball(this,200,200,deathEmitter);
        this.player.caught(this.puffball)
        this.physics.add.collider(this.player,layer);
        this.physics.add.overlap(this.player,this.puffball,
            () => this.player.caught(this.puffball));
        this.physics.add.collider(this.puffball,layer,
            () => this.puffball.die());

        //Boxes ======================================================
        this.boxes = this.physics.add.group({
            immovable:true, allowGravity:false});
        let boxSets = [
            [new Box(this,5200,350),new Box(this,5200,300),
             new Box(this,5200,250),new Box(this,5200,200)],
            [
             new Box(this,6250,450),new Box(this,6250,400),
             new Box(this,6250,350),new Box(this,6700,350),
             new Box(this,6700,450),new Box(this,6700,400),
             new Box(this,6350,500,true),new Box(this,6650,500,true),
             new Box(this,6300,500,true),new Box(this,6700,500,true),
             new Box(this,6400,500,true),new Box(this,6550,500,true),
             new Box(this,6400,500,true),new Box(this,6550,500,true),
             new Box(this,6600,500,true)],
            [new Box(this,6250,500),new Box(this,6700,500)],
            [new Box(this,8150,450,false,'grate'),new Box(this,8150,400,false,'grate'),
             new Box(this,8150,350,false,'grate'),new Box(this,8150,300,false,'grate'),
             new Box(this,8150,250,false,'grate')],
            [new Box(this,9600,500),new Box(this,9650,500),
             new Box(this,9700,500),new Box(this,9750,500),
             new Box(this,9800,500),new Box(this,9850,500)],
            [new Box(this,9550,850,true,'grate'),new Box(this,9550,800,true,'grate'),
             new Box(this,9550,750,true,'grate'),new Box(this,9550,700,true,'grate')],
            [new Box(this,10500,1150,true,'maze-block'),new Box(this,10500,1200,true,'maze-block'),
             new Box(this,10550,1150,true,'maze-block'),new Box(this,10600,1150,true,'maze-block'),
             new Box(this,10650,1150,true,'maze-block'),new Box(this,10700,1150,true,'maze-block'),
             new Box(this,10750,1150,true,'maze-block'),new Box(this,10800,1150,true,'maze-block'),
             new Box(this,10800,1200,true,'maze-block')],
        ];
        for (var boxes of boxSets){
            this.boxes.addMultiple(boxes);
        }
        this.physics.add.collider(this.player,this.boxes);
        this.physics.add.collider(this.puffball,this.boxes,
            () => this.puffball.die());

        // Buttons ===================================================
        this.buttons = this.physics.add.group({
            immovable:true, allowGravity:false});
        this.buttons.addMultiple([
            new Button(this,5150,450,boxSets[0]),
            new Button(this,6050,450,boxSets[1],180),
            new Button(this,8050,50,boxSets[3],-90),
            new Button(this,9850,200,boxSets[4]),
            new Button(this,9250,850,boxSets[5],180),
            new Button(this,10200,750,boxSets[6],-90),
        ]);
        this.physics.add.overlap(this.player,this.buttons,
            (p,b) => b.click());
        this.physics.add.collider(this.puffball,this.buttons,
            (p,b) => b.click());

        // Saws ======================================================
        // (Sorry, I gave up on getting physics groups to work properly)
        this.saws = [ 
            new Saw(this,8400,100,8400,300,250),
            new Saw(this,8650,100,8650,300,400),
            new Saw(this,8950,100,8950,250,200),
            new Saw(this,9300,200,9300,100,100),
            new Saw(this,9350,100,9350,200,100),
            new Saw(this,9400,200,9400,100,100),
            new Saw(this,9450,100,9450,200,100),
            new Saw(this,10150,800,10400,800,300),
        ];
        for (var saw of this.saws){
            this.physics.add.collider(this.player,saw);
            this.physics.add.collider(this.puffball,saw,
                () => this.puffball.die());
        }

        // The monster ==================================================
        let monster = new Phaser.GameObjects.Sprite(this,11300,1200).setOrigin(0,0);
        //this.physics.world.enable(monster);
        this.add.existing(monster);
        monster.anims.play('monst');
        monster.depth = 10;

        this.victoryMessage = this.add.image(11300,1050,'victory')
            .setOrigin(0,0);
        this.victoryMessage.visible = false;



        // Technical setup ============================================
        // Make camera follow player
        const cam = this.cameras.main;
        cam.startFollow(this.player);
        cam.followOffset.set(0,50);
        cam.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys()

        // Cutscene stuff
        this.inCutscene = false;
        this.cutsceneStartX = 10880;
    }

    update(){
        if (this.inCutscene){
            // Don't do anything if in cutscene.
            this.puffball.update();
            return;
        }
        this.player.doControls(this.cursors);
        this.puffball.update();

        // Hack to handle overlap on puffball when carried:
        //  (This is still not ideal and I need to find a better fix.)
        var tile = this.layer.getTileAtWorldXY(this.puffball.x,this.puffball.y);
        if (tile && !this.safeTiles.includes(tile.index)){
            this.puffball.die();
        }

        // Check for falling off screen
        //  TODO: Better check (including exception for cutscene)
        if (this.player.y > 1700 + 300 || this.puffball.y > 1700 + 300){
            this.respawn();
        }

        for (var saw of this.saws){
            saw.update();
        }
        this.updateCheckpoint();
        this.checkCutscene();
    }

    spawnPlayer(){
        let point = this.checkpoints[this.curr_checkpoint]
        return new Player(this,point[0],point[1]);
    }

    checkCutscene(){
        if (!this.inCutscene && !this.puffball.dying &&
                this.player.x > this.cutsceneStartX){
                this.startCutscene();
        }
    }

    startCutscene(){
            this.inCutscene = true;
            // Reset everything to a known position
            this.player.x = this.cutsceneStartX
            this.player.y = 1100;
            this.player.caught(this.puffball);
            this.player.anims.play('carry-walk');
            this.player.body.setVelocityX(this.player.playerSpeed);
            this.time.delayedCall(750,function(){
                this.player.anims.play('idle');
                this.player.holding.tossed();
                this.player.body.setVelocityX(0);
                this.cameras.main.startFollow(this.puffball);
            },[],this);
            this.time.delayedCall(2000,function(){
                this.puffball.die();
                this.victoryMessage.visible = true;
            },[],this);

    }

    updateCheckpoint(){
        if (!this.player.holding){
            // Can only pass a checkpoint when carrying the puffball
            return;
        }
        let max_checkpoint = this.checkpoints.length - 1;
        if (this.curr_checkpoint < max_checkpoint){
            let next = this.checkpoints[this.curr_checkpoint + 1];
            if (this.player.x > next[0]){
                this.curr_checkpoint += 1;
                console.log("checkpoint passed");
            }
        }
    }

    respawn(){
        if(!this.inCutscene){
            this.scene.restart({curr_checkpoint: this.curr_checkpoint});
        }
    }

    createAnimations(){
        // Puffball =====================================================
        this.anims.create({
            key: 'roll',
            frames: this.anims.generateFrameNumbers('pixel-puffball',
                {start:0,end:7}),
            frameRate:10,
            repeat:-1
        });

        // Player =======================================================
        this.anims.create({
            key: 'carry-walk',
            frames: this.anims.generateFrameNumbers('player',{start:16,end:19}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create({
            key: 'carry-idle',
            frames: this.anims.generateFrameNumbers('player',{start:10,end:10}),
            frameRate:10,
            repeat:0
        });

        this.anims.create({
            key: 'carry-jump',
            frames: this.anims.generateFrameNumbers('player',{start:13,end:14}),
            frameRate:10,
            repeat:0
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player',{start:6,end:9}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player',{start:0,end:0}),
            frameRate:10,
            repeat:0
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player',{start:3,end:4}),
            frameRate:10,
            repeat:0
        });

        // Button ========================================================
        this.anims.create({
            key:'button-press',
            frames: this.anims.generateFrameNumbers('button',{start:0,end:3}),
            framerate:10,
            repeat:0
        });

        // Monster
        this.anims.create({
            key:'monst', // Because that's what a monster does.
            frames: this.anims.generateFrameNumbers('monster',{start:0,end:5}),
            framerate:10,
            repeat:-1,
            yoyo:true
        });
    }
}//Scene


