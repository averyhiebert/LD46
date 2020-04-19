export default class Puffball extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y){
        super(scene,x,y,'puffball');
        scene.physics.world.enable(this)
        scene.add.existing(this);
        this.body.setBounce(0.5);

        this.isCaught = false;
        this.heldBy = null;
    }

    tossed(){
        this.body.enable=true; // Turn physics back on
        this.body.setVelocityY(-500)
        this.body.setVelocityX(0.9*this.heldBy.body.velocity.x)
        this.isCaught = false;
        this.heldBy = null;
    }

    caughtBy(catcher){
        // catcher must implement getHoldPosition
        this.isCaught = true;
        this.heldBy = catcher;
        this.body.enable=false; //Don't do physics when caught
    }

    die(){
        this.setTexture('puffball-dead');
    }

    update(){
        if (this.isCaught){
            let pos = this.heldBy.getHoldPosition();
            this.x = pos[0];
            this.y = pos[1];
        }
    }
}
