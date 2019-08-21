//描述设计
//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class Title  implements  IScreen{
    elem: HTMLElement;
    constructor(public title:string) {
        console.log(arguments)
    }
    create(callback:Function) {
        this.elem = document.createElement('div');
        this.elem.className = "title";
        this.elem.style.position= 'absolute';
        this.elem.innerHTML = this.title;
        return this.elem;
    }
    remove(){
        this.elem.parentNode.removeChild(this.elem);
    }
}