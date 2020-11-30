export default class Puffball extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,emitter){
        super(scene,x,y,'pixel-puffball');
        scene.physics.world.enable(this)
        scene.add.existing(this);
        this.body.setBounce(0.5); //?
        this.body.setCircle(3.5);
        this.setDepth(6);
        this.anims.play('roll');
        this.anims.pause()

        // All the stuff for being thrown & caught
        this.isCaught = false;
        this.heldBy = null;
        this.lastThrown = 0;
        this.catchTimeout = 500; // In milliseconds

        // All the stuff for dealing with death & particles
        this.DEATH_DURATION = 100;
        this.deathEmitter = emitter;
        this.dying = false;
        this.dead = false;
        this.tod = 0;
    }

    tossed(){
        this.body.enable=true; // Turn physics back on
        //this.body.setVelocityY(-80)
        this.body.setVelocityY(-130)
        this.body.setVelocityX(0.95*this.heldBy.body.velocity.x)
        this.isCaught = false;
        this.heldBy = null;
        this.anims.resume();
        this.lastThrown = (new Date()).getTime();
    }

    isCatchable(){
        return !(this.dying || this.isCaught
            || (new Date()).getTime() < this.lastThrown + this.catchTimeout);
    }

    caughtBy(catcher){
        // catcher must implement getHoldPosition() and drop()
        if (!this.isCaught && !this.dying 
                //&& (new Date()).getTime() > this.lastThrown + this.catchTimeout){
                ){
            this.isCaught = true;
            this.heldBy = catcher;
            this.body.enable=false; //Don't do physics when caught
            this.anims.pause();
        }
    }

    dropped(){
        // Call when object is dropped.
        this.isCaught = false;
        this.heldBy.drop();
        this.heldBy = null;
        this.body.enable=true;
    }

    die(){
        if (!this.dying){
            this.dying = true;
            this.tod = new Date().getTime();
            this.deathEmitter.on=true;
            //TODO: Figure out why this isn't working:
            this.scene.tweens.add({
                targets:this,
                alpha:0,
                duration:this.deathDuration,
                ease: 'Power2'
            },this.scene);
            if(this.isCaught){
                this.dropped()
            }
        }
    }

    update(){
        if (this.isCaught){
            let pos = this.heldBy.getHoldPosition();
            this.x = pos[0];
            this.y = pos[1];
        }
        if (this.dying){
            let t = new Date().getTime();
            //TODO: Maybe replace this check with a Timer event.
            if(t - this.tod > this.DEATH_DURATION){
                // We are done dying.
                this.deathEmitter.on = false;
                this.dead = true;
                this.body.enable = false;
                this.body.checkCollision.none = true;
                this.setActive(false).setVisible(false);
                //TODO: trigger the game over/respawn action in a moment.
                this.scene.time.delayedCall(1500,this.scene.respawn,
                    [],this.scene)
            }else{
                let velX = this.body.velocity.x;
                let velY = this.body.velocity.y;
                // Calculate angle for emitter.
                let angle = 0;
                if(velX == 0){
                    angle = velY > 0? 90: 270;
                }else if(velX > 0){
                    angle = 180*Math.atan(velY/velX)/Math.PI
                }else{
                    angle = 180 + 180*Math.atan(velY/velX)/Math.PI
                }
                let speed = Math.sqrt(velX*velX + velY * velY);
                this.deathEmitter.setAngle({min: angle - 30, max: angle + 30});
                this.deathEmitter.setSpeed({min: speed*0.5, max: speed+16});
                this.deathEmitter.setPosition(this.x,this.y);
            }
        }
    }
}
