//// <reference path="iScreen.ts" />
import IScreen from './iScreen'
export default class GameOver implements IScreen {
    elem: HTMLElement;
    textElem: HTMLElement;
    constructor(public btntitle: string) {

    }
    create(callback?: Function, text: string = '') {
        this.elem = document.createElement('div');
        this.elem.className = 'gameOver';
        this.textElem = document.createElement('div');
        this.textElem.className = 'text';
        this.textElem.innerHTML = text;
        this.elem.appendChild(this.textElem);
        let btn = document.createElement('button');
        btn.className = "button"
        btn.innerText = this.btntitle;
        btn.addEventListener('touchstart', function (event:TouchEvent) {
            callback.call(this)
        }.bind(this),false);
        // btn.onclick = callback.bind(this);
        this.elem.appendChild(btn)
        return this.elem;
    }
    setText(text: string = '') {
        this.textElem.innerHTML = text;
    }
    remove() {
        this.elem.parentNode.removeChild(this.elem);
    }

}