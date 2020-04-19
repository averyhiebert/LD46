export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y){
        //super(scene,x,y,'carrying');
        super(scene,x,y,'player');
        scene.physics.world.enable(this)
        scene.add.existing(this);
        this.body.setBounce(0);
        //this.body.setCollideWorldBounds(true);

        this.playerSpeed = 280;
        this.holding = null;
    }

    caught(thing){
        if(thing.isCatchable()){
            this.holding = thing;
            thing.caughtBy(this);
        }
    }

    drop(){
        console.log("DEBUG: Player dropped thing.");
        this.holding = null;
        console.log(this.holding?"Still holding":"No longer holding");
    }

    doControls(cursors){
        // Move left/right
        if (cursors.left.isDown){
            this.body.setVelocityX(-1*this.playerSpeed);
            if (this.body.blocked.down){
                this.anims.play(this.holding?'carry-walk':'walk',true);
            }else{
                this.anims.play(this.holding?'carry-jump':'jump')
            }
        }else if (cursors.right.isDown){
            this.body.setVelocityX(this.playerSpeed);
            if (this.body.blocked.down){
                this.anims.play(this.holding?'carry-walk':'walk',true);
            }else{
                this.anims.play(this.holding?'carry-jump':'jump')
            }
        }else{
            this.body.setVelocityX(0);
            if (this.body.blocked.down){
                this.anims.play(this.holding?'carry-idle':'idle')
            }else{
                this.anims.play(this.holding?'carry-jump':'jump')
            }
        }

        // Jump
        if (cursors.up.isDown && this.body.blocked.down){
            this.body.setVelocityY(-500);
        }

        // Throw puffball, if holding:
        if (cursors.down.isDown && this.holding != null){
            this.holding.tossed();
            this.holding = null;
            //this.setTexture('notcarrying')
        }
    }

    getHoldPosition(){
        //Returns the position where the centre of the puffball will be
        // held, if it is being held.
        return [this.x,this.y - 70];
    }
}
