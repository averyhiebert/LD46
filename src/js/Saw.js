export default class Box extends Phaser.GameObjects.Sprite{
    constructor(scene,x1,y1,x2,y2,speed){
        //Note: Currently buggy & does not work in horizontal direction.
        super(scene,x1 + 4,y1 + 4,'buzzsaw');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        //scene.physics.add.existing(this);
        
        speed = speed || 250;
        
        if(x1 > x2){
            var x = x1;
            x1 = x2;
            x2 = x;
        }
        if(y1 > y2){
            var y = y1;
            y1 = y2;
            y2 = y;
        }

        this.x1 = x1 + 4;
        this.y1 = y1 + 4;
        this.x2 = x2 + 4;
        this.y2 = y2 + 4;
        this.speed = speed;
        this.body.setCircle();
        //this.body.setAngularVelocity(500);
        this.body.setGravityY(0);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.backwards = false;
        this.vertical = (this.x1 == this.x2);
    }

    update(){
        // Currently only supports horizontal or vertical trajectories,
        //  not both at the same time..
        if(this.vertical){
            if (this.y > this.y2){
                this.backwards = true;
            }else if(this.y < this.y1){
                this.backwards = false;
            }
            this.body.setVelocityY((this.backwards?-1:1) * this.speed);
            this.body.setVelocityX(0);
        }else{
            if (this.x > this.x2){
                this.backwards = true;
            }else if(this.x < this.x1){
                this.backwards = false;
            }
            this.body.setVelocityX((this.backwards?-1:1) * this.speed);
            this.body.setVelocityY(0);
        }
    }//update
}
