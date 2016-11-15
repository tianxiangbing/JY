/// <reference path="iScreen.ts" />
//操作界面
class Control implements IScreen {
    elem: HTMLElement;

    rect: Array<number> = [160, 160];
    moveElem: HTMLElement;
    moveRect: Array<Number> = [50, 50];
    moveCenter: Array<any>;
    elemCenter: Array<any>;
    elemPosition: Array<Number> = [80, 80];
    position: Array<any>;

    create() {
        this.elem = document.createElement('div');
        this.elem.className = "control";
        this.elem.style.position = 'absolute';
        this.elem.style.width = this.rect[0] + 'px';
        this.elem.style.height = this.rect[1] + 'px';
        this.elem.style.left = this.elemPosition[0] + 'px';
        this.elem.style.bottom = this.elemPosition[1] + 'px';
        this.moveElem = document.createElement('div');
        this.moveElem.className = 'move';
        this.moveElem.style.position = 'absolute';
        this.moveElem.style.width = this.moveRect[0] + 'px';
        this.moveElem.style.height = this.moveRect[1] + 'px';
        this.elem.appendChild(this.moveElem);
        this.moveCenter = this.moveRect.map(function (d: number, i) { return d / 2 });
        this.elemCenter = this.rect.map(function (d: number, i) { return d / 2 });
        this.resetPos();
        this.bindEvent();
        return this.elem;
    }
    resetPos() {
        //重置位置
        console.log(this.moveCenter)
        this.transPosition(this.elemCenter);
    }
    //传入圆心转换成坐标,
    transPosition(center: Array<number>) {
        let x = (center[0] - this.moveCenter[0]);
        let y = (center[1] - this.moveCenter[1]);
        this.moveElem.style.left = x + 'px';
        this.moveElem.style.top = y + 'px';
    }
    bindEvent() {
        this.elem.addEventListener('touchstart', function (event) {
            let epos = event.touches[0] || event;
            this.setPosition(epos)
        }.bind(this), false);
        this.elem.addEventListener('touchmove', function (event) {
            let epos = event.touches[0] || event;
            this.setPosition(epos)
        }.bind(this), false);

        this.elem.addEventListener('touchend', function (event) {
            this.resetPos();
        }.bind(this), false);
    }
    // 计算边界值,设置位置
    setPosition(epos) {
        this.position = this.position || [this.elem.offsetLeft, this.elem.offsetTop];
        let x:number = epos.pageX - this.position[0];
        let y = epos.pageY - this.position[1];
        // x= Math.min (x,this.rect[0]-this.moveCenter[0]);
        // x = Math.max(x,this.moveCenter[0])
        let toPos = [x, y];
        this.transPosition(toPos)
    }
    remove() {
        this.elem.remove();
    }
}