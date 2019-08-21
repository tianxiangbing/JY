//sprite
//形状
export enum SHAPE{
 rect,
 circle
}
export default class Sprite {
    ///
    context: any;//画布对象
    x: number = 0;//x坐标
    y: number = 0;//y坐标
    w: number = 0;//宽度 
    h: number = 0;//高度
    sw: number = 0;//剪裁的宽
    sh: number = 0;//前裁的高
    sx: number = 0;//剪裁的x
    sy: number = 0;//前裁的y
    r:number = 0 ;//半径
    img: any;//图像地址
    shape:SHAPE = SHAPE.rect;//默认方形
    constructor(context: any, url: string) {
        this.getImg(url);
        this.context = context;
    }
    setImg(url: string) {
        this.getImg(url);
    }
    getImg(url: string): void {
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
            console.log('loaded')
        }
        // this.img = document.createElement('img');
        // this.img.src = url;
    }
    setSize(w?:number, h?:number) {
        this.w = w||this.w;
        this.h = h||this.h;
        this.r = this.h/2;
    }
    getCenter(){
        //圆心位置
        return [this.x +this.r,this.y +this.r];
    }
    setCutSize(sw:number, sh:number) {
        this.sw = sw;
        this.sh = sh;
    }
    setPosition(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
    draw(angle?:number) {
        this.context.save();
        if(angle){
            this.context.translate(this.x+this.r ,this.y+this.r)
            this.context.rotate(angle);
            this.context.translate(-(this.x+this.r) ,-(this.y+this.r));
        } 
        if (this.sw && this.sh) {
            this.context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
        } else {
            //不需要剪切
            this.context.drawImage(this.img,Math.round(this.x), Math.round(this.y), this.w, this.h);
        }
        // this.context.drawImage(this.img,10,10);
        this.context.restore();
    }
}