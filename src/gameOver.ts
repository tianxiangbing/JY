/// <reference path="iScreen.ts" />
class GameOver implements  IScreen{
    elem:HTMLElement;
    constructor(public btntitle:string){

    }
    create(callback:Function){
        this.elem = document.createElement('div');
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