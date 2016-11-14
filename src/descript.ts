/// <reference path="iScreen.ts" />
//描述设计
class Discript  implements  IScreen{
    elem: HTMLElement;
    constructor(public btntitle:string) {
        console.log(arguments)
    }
    create(callback:Function) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.style.position= 'absolute';
        let btn = document.createElement('button');
        btn.innerText = this.btntitle;
        btn.onclick = callback.bind(this);
        this.elem.appendChild(btn)
        return this.elem;
    }
    remove(){
        this.elem.remove();
    }
}