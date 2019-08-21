//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
//描述设计
export default class Descript  implements  IScreen{
    elem: HTMLElement;
    constructor(public btntitle:string,public text?:string) {
        console.log(arguments)
    }
    create(callback:Function) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.innerHTML = this.text||'';
        this.elem.style.position= 'absolute';
        let btn = document.createElement('button');
        btn.className = 'button start';
        btn.innerText = this.btntitle;
        // btn.onclick = callback.bind(this);
        btn.addEventListener('touchstart', function (event:TouchEvent) {
            callback.call(this)
        }.bind(this),false);
        btn.addEventListener('click', function (event:TouchEvent) {
            callback.call(this)
        }.bind(this),false);
        this.elem.appendChild(btn)
        return this.elem;
    }
    remove(){
        this.elem.parentNode.removeChild(this.elem);
    }
}