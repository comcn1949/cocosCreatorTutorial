import defines from './../defines'
import AnimationController from './animation-controller'
import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        Textures: {
            type: cc.SpriteFrame,
            default: []
        },
        label: {
            type: cc.Label,
            default: null
        }
    },
    onLoad: function () {
        this.animationController = AnimationController();
        let isTouch = false;
        let self = this;
        const onTouchStart = function () {
            self.oldPos = self.node.position;
            self.currentDirection = undefined;

            if (global.gameDataController.getIsCanInput()){
                isTouch = true;
            }

        };
        const onTouchMove = function (event) {
            if (isTouch){
                let targetPos = self.node.parent.convertTouchToNodeSpace(event);
                self.processDirection(targetPos);
            }
        };
        const onTouchEnd = function () {
            isTouch = false;
        };
        this.node.on(cc.Node.EventType.TOUCH_START,onTouchStart, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,onTouchMove,this.node);
        this.node.on(cc.Node.EventType.TOUCH_END,onTouchEnd,this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,onTouchEnd,this.node);

    },
    processDirection: function (position) {
        //计算方向
        if (this.currentDirection !== undefined){
            return;
        }
        if (position.y - this.oldPos.y > 50){
            this.currentDirection = "UP";
        }else if (position.y - this.oldPos.y < -50){
            this.currentDirection = "DOWN";
        }else if (position.x - this.oldPos.x < -50){
            this.currentDirection = "LEFT";
        }else if (position.x - this.oldPos.x > 50){
            this.currentDirection = "RIGHT";
        }
        // cc.log("this.currentDirection =  " + this.currentDirection);

        if (this.currentDirection !== undefined){
            this.node.parent.getComponent("GameLayer").cellScrollDirection(this);
        }
        //通知parent的脚本  ，我滑动了方向
    }
    ,
    init: function (data) {
        cc.log("init cell " + JSON.stringify(data));
        let type = data.type;
        this.isMoving = false;
        this.type = data.type;
        let index = defines.cellType[type];
        this.indexWidth = data.indexWidth;
        this.indexHeight = data.indexHeight;
        this.node.getComponent(cc.Sprite).spriteFrame = this.Textures[index];
        this.label.string = data.index;
        this.index = data.index;

    },
    update: function () {


        if (this.isMoving){

        }else {

            let actionData = this.animationController.popFirstAnimation();

            if (actionData !== null){

                this.isMoving = true;
                let self = this;
                // cc.log("animation data = " + JSON.stringify(actionData));
                let callBack = cc.callFunc(function () {
                    cc.log("运行结束");
                    self.isMoving = false;
                    global.gameDataController.removeOneAction();
                },this);
                let action = cc.sequence(cc.moveTo(0.2, actionData.position.x,actionData.position.y),callBack);
                this.node.runAction(action)
            }
        }
    },
    pushAnimationData: function (data) {
        // global.eventListener.fire("add_action");
        global.gameDataController.addOneAction();
        this.animationController.pushAnimation(data);
    },
    getDirection: function () {
        return this.currentDirection;
    },
    getIsMoving: function () {
      return this.isMoving;
    },
    getType : function () {
        return this.type;
    }
});