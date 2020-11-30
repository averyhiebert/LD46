export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y){
        //super(scene,x,y,'carrying');
        super(scene,x,y,'player');
        scene.physics.world.enable(this)
        scene.add.existing(this);
        this.body.setBounce(0);
        this.setDepth(5);

        this.playerSpeed = 80;
        this.jumpStrength = 120;
        this.holding = null;
        //this.setScale(6);
    }

    caught(thing){
        if(thing.isCatchable()){
            this.holding = thing;
            thing.caughtBy(this);
        }
    }

    drop(){
        this.holding = null;
        console.log(this.holding?"Still holding":"No longer holding");
    }

    isTouchingDown(){
        return this.body.blocked.down || this.body.touching.down;
    }

    doControls(cursors){
        // Move left/right
        if (cursors.left.isDown){
            this.body.setVelocityX(-1*this.playerSpeed);
            if (this.isTouchingDown()){
                this.anims.play(this.holding?'carry-walk':'walk',true);
            }else{
            }
        }else if (cursors.right.isDown){
            this.body.setVelocityX(this.playerSpeed);
            if (this.isTouchingDown()){
                this.anims.play(this.holding?'carry-walk':'walk',true);
            }else{
            }
        }else{
            this.body.setVelocityX(0);
            if (this.isTouchingDown()){
                this.anims.play(this.holding?'carry-idle':'idle')
            }else{
            }
        }

        // Jump
        if (cursors.up.isDown && this.isTouchingDown()){
            this.body.setVelocityY(-this.jumpStrength);
            this.anims.play(this.holding?'carry-jump':'jump')
        }

        // Throw puffball, if holding:
        if (cursors.down.isDown && this.holding != null){
            this.holding.tossed();
            this.holding = null;
        }

        // For debugging/dev: Log location
        if (cursors.shift.isDown){
            console.log("Player location: " + this.x + ", " + this.y);
        }
    }

    getHoldPosition(){
        //Returns the position where the centre of the puffball will be
        // held, if it is being held.
        return [this.x,this.y - 9];
    }
}
