cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        // this.moveSpeed = 20;

        this.moveSpeed = cc.p(1,0);


        let randomAngle =Math.PI  + ( 0 -  Math.random() * Math.PI * 0.1) * -1 ;
        this.moveSpeed = cc.pRotateByAngle(cc.p(0,0), this.moveSpeed, randomAngle);
        this.moveSpeed = cc.pMult(this.moveSpeed,8);

        //
        this.damage = 1;
        // this.node.getComponent(cc.EditBox).setFocus();

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.position = {
            x: this.node.position.x + this.moveSpeed.x,
            y: this.node.position.y + this.moveSpeed.y
        };
        if (this.node.position.x > cc.Canvas.instance.designResolution.width * 0.5 - 100){
            this.node.destroy();
        }
        if (this.node.position.y > cc.Canvas.instance.designResolution.height){
            this.node.destroy();
        }
    },
    onDestroy: function () {
    },
    onCollisionEnter: function (other, self) {
        // cc.log("碰撞了");
        // other.removeFromParent(true);
        // self.removeFromParent(true);
        this.node.removeFromParent(true);
        this.node.destroy();
    },
    getDamage: function () {
        return this.damage;
    }
});