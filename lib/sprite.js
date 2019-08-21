"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//sprite
//形状
var SHAPE;
(function (SHAPE) {
    SHAPE[SHAPE["rect"] = 0] = "rect";
    SHAPE[SHAPE["circle"] = 1] = "circle";
})(SHAPE = exports.SHAPE || (exports.SHAPE = {}));
var Sprite = /** @class */ (function () {
    function Sprite(context, url) {
        this.x = 0; //x坐标
        this.y = 0; //y坐标
        this.w = 0; //宽度 
        this.h = 0; //高度
        this.sw = 0; //剪裁的宽
        this.sh = 0; //前裁的高
        this.sx = 0; //剪裁的x
        this.sy = 0; //前裁的y
        this.r = 0; //半径
        this.shape = SHAPE.rect; //默认方形
        this.getImg(url);
        this.context = context;
    }
    Sprite.prototype.setImg = function (url) {
        this.getImg(url);
    };
    Sprite.prototype.getImg = function (url) {
        //地址转换成img对象 
        this.img = new Image();
        this.img.src = url;
        // this.img = document.createElement('img');
        // this.img.src = url;
        // console.log(this.img.readyState)
        // this.img.onreadystatechange=function(){
        //     console.log(222,this.img.readyState)
        // }
        this.img.onload = function () {
            console.log('loaded');
        };
        // this.img = document.createElement('img');
        // this.img.src = url;
    };
    Sprite.prototype.setSize = function (w, h) {
        this.w = w || this.w;
        this.h = h || this.h;
        this.r = this.h / 2;
    };
    Sprite.prototype.getCenter = function () {
        //圆心位置
        return [this.x + this.r, this.y + this.r];
    };
    Sprite.prototype.setCutSize = function (sw, sh) {
        this.sw = sw;
        this.sh = sh;
    };
    Sprite.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Sprite.prototype.draw = function (angle) {
        this.context.save();
        if (angle) {
            this.context.translate(this.x + this.r, this.y + this.r);
            this.context.rotate(angle);
            this.context.translate(-(this.x + this.r), -(this.y + this.r));
        }
        if (this.sw && this.sh) {
            this.context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
        }
        else {
            //不需要剪切
            this.context.drawImage(this.img, Math.round(this.x), Math.round(this.y), this.w, this.h);
        }
        // this.context.drawImage(this.img,10,10);
        this.context.restore();
    };
    return Sprite;
}());
exports.default = Sprite;
