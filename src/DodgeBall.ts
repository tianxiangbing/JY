/// <reference path="index.ts" />
(function(){
    class G extends JY {
        interval:20;
        count = 1;
        role:Sprite;
        v= 2;//速度 
        ballList :Array<Ball>=[];//球的集合
        newGame() {
            this.count = 1;
            this.createRole();
            super.newGame();
            this.control();
        }
        running() {
            this.count++;
            if (this.count > 10000) {
                this.over();
                return;
            }
            // console.log(this.count)
            this.context.clearRect(0,0,this.stage.width,this.stage.height);
            this.role.draw();
            this.ballList.forEach(ball => {
                ball.draw();
            });
            this.createBoll();
            this.v = this.v+.003;
            this.drop();
            super.running();
        }
        gameOver() {
            super.gameOver();
        }
        loading() {
            console.log('loading...')
            super.loading();
        }
        //创建英雄
        createRole(){
            this.role = new Sprite(this.context,'car.png');
            let rect = this.stage.width/3-10;
            this.role.setSize(rect,rect);
            let x = this.stage.width/2-this.role.w/2;
            // this.role.setPosition(this.stage.width/3,this.stage.height - this.role.h);
            this.jump(1,this.role);
        }
        //控制器
        control(){
            this.stage.bindEvent(function(epos){
                let w = this.stage.width ; 
                let h = this.stage.height ;
                let col = Math.ceil (epos[0] /( w/3)) ;//分三栏，判断点击是哪一栏
                this.jump(col,this.role);
            }.bind(this));
        }
        //跳啊
        jump(col:number,obj:Sprite){
            let x = this.stage.width/3 * col -this.stage.width/3/2-this.role.w/2;
            obj.setPosition(x,this.stage.height/2 + this.role.h);
        }
        //设置球的初始位置
        setBallInitPosition(ball:Sprite,col:number){
            let x = this.stage.width/3 * col -this.stage.width/3/2-ball.w/2;
            ball.setPosition(x,0);
        }
        createBoll(){
            //创建小球
            if(this.count%100==0){
                //10帧创建
                let rnd = Math.ceil(Math.random()*2);//创建一个或2;
                let ball = new Ball(this.context,this.stage.width/3-10 ,this.stage.width/4 );
                let x = this.stage.width/3 * 2 -this.stage.width/3/2-this.role.w/2;
                ball.setPosition(x,0);
                this.ballList.push(ball);
            }
        }
        drop(){
            this.ballList.forEach(ball => {
                ball.drop(this.v);
            });
        }
    }
    class Ball extends Sprite{
        constructor(context,w,h){
            super(context,'car1.png');
            this.setSize(w,h);
        }
        drop(v:number){
            this.setPosition(this.x,this.y+v)
        }
    }
    let view = document.getElementById('view');
    let w = view.offsetWidth;
    let h = view.offsetHeight;
    let stage = new Stage(w, h);
    let descript = new Discript('start');
    descript.text= '<p class="title">DodgeBall</p>'
    let gameOver = new GameOver('restart');
    let title = new Title('DodgeBall');
    let control = new Control();
    control.rect = [100, 100]
    let game = new G(view, stage, title, descript, gameOver);
    game.files = {image: ['car1.png','car2.png','car.png']};
    game.setup();
})();