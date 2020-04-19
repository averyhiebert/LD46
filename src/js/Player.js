export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y){
        super(scene,x,y,'carrying');
        scene.physics.world.enable(this)
        scene.add.existing(this);
        this.body.setBounce(0.2);
        //this.body.setCollideWorldBounds(true);

        this.playerSpeed = 280;
        this.holding = null;
    }

    caught(thing){
        this.holding = thing;
        thing.caughtBy(this);
        this.setTexture('carrying');
    }

    doControls(cursors){
        // Move left/right
        if (cursors.left.isDown){
            this.body.setVelocityX(-1*this.playerSpeed);
        }else if (cursors.right.isDown){
            this.body.setVelocityX(this.playerSpeed);
        }else{
            this.body.setVelocityX(0);
        }

        // Jump
        if (cursors.space.isDown && this.body.blocked.down){
            this.body.setVelocityY(-500);
        }

        // Throw puffball, if holding:
        if (cursors.up.isDown && this.holding != null){
            this.holding.tossed();
            this.holding = null;
            this.setTexture('notcarrying')
        }
    }

    getHoldPosition(){
        //Returns the position where the centre of the puffball will be
        // held, if it is being held.
        return [this.x,this.y - 70];
    }
}
