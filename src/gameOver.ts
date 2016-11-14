/// <reference path="iScreen.ts" />
class GameOver implements  IScreen{
    elem:HTMLElement;
    create(callback:Function){
        this.elem = document.createElement('div');
        return this.elem;
    }
    remove(){

    }

}