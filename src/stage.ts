/// <reference path="iScreen.ts" />
//舞台设计
class Stage implements IScreen{
    elem:HTMLCanvasElement;
    constructor(public width:number,public height:number,public style?:string){
        console.log(arguments)
    }
    create(){
        this.elem = document.createElement('canvas');
        // this.canvas.style ={width: this.width,height:this.height};
        this.elem.width = this.width;
        this.elem.height = this.height;
        this.elem.style.position= 'absolute';
        return this.elem;
    }
    remove(){
        this.elem.remove();
    }
}
