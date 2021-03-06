import monsterDataConfig from './../../data/config/monster-data'
import global from './../../global'
const MonsterState = {
    Invalide: -1,
    Live: 1,
    Running: 3,
    Dead: 2,
    ToDead: 4
};
cc.Class({
    extends: cc.Component,

    properties: {
        healthProgress: {
            default: null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function () {
        // this.node.tag = "enemy";
        this.moveSpeed = 1;
        this.healthCount = 4;
        this.state = MonsterState.Invalide;
        this.setState(MonsterState.Live);
        this.speedY = 0;
        this.accY = 0.1;
        global.gameworldEventListener.on("game_win", ()=>{
            cc.log("game win");
           this.setState(MonsterState.ToDead);
        });

    },
    init: function (monstername) {
        cc.log("初始化敌人用数据 " + JSON.stringify(monstername));
        let enemyData = monsterDataConfig[monstername];
        cc.log("enemy data = " + JSON.stringify(enemyData));
        this.moveSpeed = enemyData["speed"];
        this.healthCount = enemyData["health"];
        this.healthCountTotal = enemyData["health"];
        this.damage = enemyData["damage"];
        let image = enemyData.image;
        cc.loader.loadRes(image, cc.SpriteFrame, (err, spriteFrame)=>{
            if (err){
                cc.log("err = " + err);
            }
            if (this.node === null){
                return;
            }
            this.node.addComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.node.addComponent(cc.BoxCollider);
        });
        this.setState(MonsterState.Running);
    },
    update: function (dt) {

        if (this.state === MonsterState.Running){
            this.node.position = cc.p(this.node.position.x - this.moveSpeed , this.node.position.y);
            if (this.node.position.x < - cc.Canvas.instance.designResolution.width * 0.5){
                // this.node.destroy();
            }
            if (this.node.position.y > -160){
                this.node.position = cc.p(this.node.position.x, this.node.position. y - this.speedY);
                this.speedY += this.accY;
            }
            this.healthProgress.getComponent(cc.ProgressBar).progress = this.healthCount / this.healthCountTotal;
        }
    },
    onCollisionEnter: function (other, self) {

        if (other.node.getComponent("hero-node") && this.state === MonsterState.Running){
            cc.log("碰到主角了");
            this.setState(MonsterState.Dead);

        }

        if (other.node.getComponent("bullet") && this.state === MonsterState.Running){
            let damage = other.node.getComponent("bullet").getDamage();
            this.healthCount -= damage;

            if (this.healthCount <= 0 ){
                this.healthCount = 0;
                this.setState(MonsterState.Dead);
            }
        }

    },
    getHealthCount: function () {
      return this.healthCount;
    },
    setState: function (state) {
        if (state === this.state){
            cc.log("重复状态");
            return;
        }
        switch (state){
            case MonsterState.Invalide:
                break;
            case MonsterState.Live:
                break;
            case MonsterState.Dead:
                if (this.node){
                    this.node.removeComponent(cc.BoxCollider);
                    this.node.removeFromParent(true);
                    // this.node.destroy();
                    setTimeout(()=>{
                        this.node.destroy();
                    },5000)
                }
                break;
            case MonsterState.ToDead:
                this.node.removeComponent(cc.BoxCollider);
                setTimeout(()=>{
                    this.setState(MonsterState.Dead);
                },1000);
                break;
            default:
                break;
        }
        this.state = state;
    },
    getDamage: function () {
        return this.damage;
    },
    getIsDead: function () {
        if (this.state === MonsterState.Dead){
            return true;
        }
        return false;
    }

});
