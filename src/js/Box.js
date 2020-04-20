export default class Box extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,hideInitially,key){
        key = key || 'box';
        super(scene,x,y,key); //TODO: Configurable image
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0,0);

        this.hideInitially = hideInitially;
        if(hideInitially){
            this.hide();
        }
    }

    hide(){
        this.setVisible(false);
        this.body.enable = false;
        this.body.checkCollision.none = true;
    }

    show(){
        this.setVisible(true);
        this.body.enable = true;
        this.body.checkCollision.none = false;
    }

    activate(){
        if(this.hideInitially){
            this.show();
        }else{
            this.hide();
        }
    }
}
