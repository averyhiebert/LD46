export default class Button extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,targets,rotation){
        super(scene,x + 25,y + 25,'button');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        rotation = rotation || 0;

        //this.setOrigin(0,0);
        //this.setDisplayOrigin(0,0);
        this.setAngle(rotation);
        this.setDepth(1);

        this.clicked = false;
        this.targets = targets || [];
    }

    click(){
        if(!this.clicked){
            this.clicked = true;
            this.anims.play('button-press');
            for (var t of (this.targets)){
                t.activate();
            }
        }
    }
}
