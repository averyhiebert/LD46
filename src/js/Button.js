export default class Button extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,targets){
        super(scene,x,y,'button');
        scene.physics.world.enable(this)
        scene.add.existing(this);

        this.setOrigin(0,0);
        this.body.setImmovable(true);
        this.body.setGravityY(-1000); //Sorry for bad hack
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
