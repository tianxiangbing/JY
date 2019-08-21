//// <reference path="iScreen.ts" />
import IScreen from './iScreen';
//操作界面
export default class Control implements IScreen {
    elem: HTMLElement;
    rect: Array<number> = [160, 160];
    moveElem: HTMLElement;
    moveRect: Array<Number> = [50, 50];
    moveCenter: Array<any>;
    elemCenter: Array<any>;
    elemPosition: Array<Number> = [10, 10];
    position: Array<any>;
    toPosition:Array<number>;
    private angle:number=0;//角度

    create() {
        this.elem = document.createElement('div');
        this.elem.className = "control";
        this.elem.style.position = 'absolute';
        this.elem.style.width = this.rect[0] + 'px';
        this.elem.style.height = this.rect[1] + 'px';
        this.elem.style.left = this.elemPosition[0] + '%';
        this.elem.style.bottom = this.elemPosition[1] + '%';
        this.moveElem = document.createElement('div');
        this.moveElem.className = 'move';
        this.moveElem.style.position = 'absolute';
        this.moveElem.style.width = this.moveRect[0] + 'px';
        this.moveElem.style.height = this.moveRect[1] + 'px';
        this.elem.appendChild(this.moveElem);
        this.moveCenter = this.moveRect.map(function (d: number) { return d / 2 });
        this.elemCenter = this.rect.map(function (d: number) { return d / 2 });
        this.resetPos();
        this.bindEvent();
        return this.elem;
    }
    resetPos() {
        //重置位置
        // console.log(this.moveCenter)
        this.toPosition = [0, 0];
        this.transPosition();
    }
    //传入圆心转换成坐标,
    transPosition() {
        let x = (this.elemCenter[0] - this.moveCenter[0]) + this.toPosition[0];
        let y = (this.elemCenter[1] - this.moveCenter[1]) - this.toPosition[1];
        this.moveElem.style.left = x + 'px';
        this.moveElem.style.top = y + 'px';

    }
    bindEvent() {
        this.elem.addEventListener('touchstart', function (event:TouchEvent) {
            let epos = event.touches[0] || event;
            this.setPosition(epos)
        }.bind(this), false);
        this.elem.addEventListener('touchmove', function (event:TouchEvent) {
            let epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchend', function (event:TouchEvent) {
            this.resetPos();
        }.bind(this), false);
    }
    // 计算边界值,设置位置
    setPosition(epos:Touch) {
        this.position =  [this.elem.offsetLeft, this.elem.offsetTop];
        let x: number = epos.pageX - this.position[0];
        let y = epos.pageY - this.position[1];
        // x= Math.min (x,this.rect[0]-this.moveCenter[0]);
        // x = Math.max(x,this.moveCenter[0])
        let x1 = (x - this.elemCenter[0]);//相对于圆点的位置
        let y1 = -(y - this.elemCenter[1]);
        console.log(x1, y1)
        let ang = Math.atan2(y1, x1);
        // this.angle = ang;
        // console.log('角度：'+ang)
        let c = Math.sqrt(x1 * x1 + y1 * y1);
        let r = this.elemCenter[0] - this.moveCenter[0];//最长半径
        if (c > r) {
            // console.log('out', c)
            let x2 = Math.cos(ang) * r;
            let y2 = Math.sin(ang) * r;
            //下面是另一种算法
            // y2=y1*r/c;
            // x2= x1*r/c;
            // console.log('xy:', x1, y1)
            // console.log('x2y2:',x2, y2)
            x1 = x2;
            y1 = y2;
        }
        this.toPosition = [x1, y1];
        this.transPosition()
    }
    getAngle(){
        // console.log(this.toPosition)
        this.angle = Math.atan2(this.toPosition[1],this.toPosition[0]);
        return this.angle;
    }
    //获取到角度
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
}