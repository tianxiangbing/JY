//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class Stage implements IScreen {
    elem: HTMLCanvasElement;
    constructor(public width: number, public height: number, public style?: string) {
        console.log(arguments)
    }
    create() {
        this.elem = document.createElement('canvas');
        // this.canvas.style ={width: this.width,height:this.height};
        this.elem.width = this.width;
        this.elem.height = this.height;
        this.elem.style.position = 'absolute';
        return this.elem;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }
    //绑定事件回调
    bindEvent(callback?: Function) {
        this.elem.addEventListener('touchstart', function (event) {
            let epos = event.touches[0];
            callback([epos.pageX,epos.pageY]);
        }, false);
    }
}
