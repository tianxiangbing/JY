export default class WriteText{
    context: CanvasRenderingContext2D;//画布对象
    x: number = 0;//x坐标
    y: number = 0;//y坐标
    constructor(context:any){
        this.context = context;
    }
    write(text:string,x:number,y:number,style:string='',fillStyle:string=''){
        this.x= x;
        this.y = y;
        this.context.font=style;
        this.context.fillStyle = fillStyle;
        this.context.fillText( text,this.x,this.y);
    }
}