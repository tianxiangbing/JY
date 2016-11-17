//sprite
class Sprite {
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
    img: any;//图像地址
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
    setSize(w, h) {
        this.w = w;
        this.h = h;
    }
    setCutSize(sw, sh) {
        this.sw = sw;
        this.sh = sh;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        this.context.save();
        if (this.sw && this.sh) {
            this.context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
        } else {
            //不需要剪切
            this.context.drawImage(this.img, this.x, this.y, this.w, this.h);
        }
        // this.context.drawImage(this.img,10,10);
        this.context.restore();
    }
}