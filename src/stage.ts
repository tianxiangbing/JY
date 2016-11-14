//舞台设计
class Stage{
    private canvas:HTMLCanvasElement;
    constructor(public width:number,public height:number,public style?:string){
        console.log(arguments)
    }
    create(){
        this.canvas = document.createElement('canvas');
        // this.canvas.style ={width: this.width,height:this.height};
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position= 'absolute';
        return this.canvas;
    }
}