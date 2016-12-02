/// <reference path="../../src/index.ts" />
(function () {
    class Ball extends Sprite {
        name:string="游客"+ (new Date().getTime()).toString().substr(-5);
        constructor(context:any, w:number, h:number,name?:string) {
            super(context, 'head.png');
            this.setSize(w, h);
            this.shape = SHAPE.circle;
            this.name = name||this.name;
        }
        draw(angle?:number){
            super.draw(angle);
            let text = new WriteText(this.context);
            text.write(this.name,this.x,this.y+this.r)
        }
        drop(v: number) {
            this.setPosition(this.x, this.y + v)
        }
        eat(){
            this.setImg('eat.png');
            setTimeout(()=>this.setImg('head.png'),300);
        }
    }
    //机器人
    class Robot extends Ball{
        move(stage:Stage){

        }
    }
    class G extends JY {
        interval: 15;
        role: Ball;
        roleSize: number = 20;
        v: number = .5;//速度 
        av: number = 0;//加速度
        vx: number = this.v;
        vy: number = this.v;
        ballList: Array<Sprite> = [];
        score: number = 0;
        zdList: Array<Sprite> = [];
        angle: number;
        newGame() {
            this.init();
            this.createRole();
            //创建5个炸弹
            this.createZd()
            super.newGame();
        }
        init() {
            this.ballList = [];
            this.zdList = [];
        }
        createRole() {
            // this.role = new Sprite(this.context, 'head.png');
            this.role = new Ball(this.context, this.roleSize, this.roleSize)
            this.role.x = this.stage.width / 2;
            this.role.y = this.stage.height / 2;
            this.role.r = this.role.h / 2;
        }
        running() {
            // console.log(this.controlStage.getAngle())
            super.running();
            this.move()
            this.role.draw(this.angle);
            this.createBallList();//创建小点点
            this.drawBallList();
            //吃小点
            this.checkHits();
            this.drawZdList();
        }
        drawZdList() {
            this.zdList.forEach(item => {
                item.draw()
            });
        }
        createZd() {
            for (let i = 0; i < 4; i++) {
                let zd: Sprite = new Sprite(this.context, 'zd.png');
                this.zdList.push(zd);
                zd.setSize(20, 20);
                let keyx: number = this.stage.width / 4;
                let keyy: number = this.stage.height / 4;
                if (i == 0) {
                    zd.setPosition(keyx, keyy);
                }
                if (i == 1) {
                    zd.setPosition(this.stage.width - keyx, keyy);
                }
                if (i == 2) {
                    zd.setPosition(keyx, this.stage.height - keyy);
                }
                if (i == 3) {
                    zd.setPosition(this.stage.width - keyx, this.stage.height - keyy);
                }
                zd.shape = SHAPE.circle;
                // console.log(zd.x,zd.y)
            }
        }
        checkHits() {
            this.ballList.forEach((ball, i) => {
                if (this.hits(this.role, ball)) {
                    this.score++;
                    this.role.w += 1;
                    this.role.h += 1;
                    this.role.setSize()
                    // delete this.ballList[i];
                    this.ballList.splice(i, 1);
                    this.role.eat();
                }
            });
            this.zdList.forEach((ball) => {
                if (this.hits(this.role, ball)) {
                    this.over();
                }
            })
        }
        drawBallList() {
            this.ballList.forEach(item => {
                item.draw()
            });
        }
        createBallList() {
            let count: number = 100 - this.ballList.length;
            for (let i = 0; i < count; i++) {
                let ball: Sprite = new Sprite(this.context, 'head.png');
                this.ballList.push(ball);
                ball.setSize(6, 6);
                ball.x = Math.random() * this.stage.width;
                ball.y = Math.random() * this.stage.height;
                ball.shape = SHAPE.circle;
            }
        }
        move() {
            let angle = this.controlStage.getAngle();
            this.angle = -angle;
            if (angle != 0) {
                this.vx = Math.cos(angle) * this.v;
                this.vy = Math.sin(angle) * this.v;
            }
            // console.log(this.angle)
            // return;
            this.role.x = this.vx + this.role.x;
            this.role.y = this.role.y - this.vy;
            this.role.x = Math.max(0, this.role.x);
            this.role.x = Math.min(this.role.x, this.stage.width - this.role.w);
            this.role.y = Math.max(0, this.role.y);
            this.role.y = Math.min(this.role.y, this.stage.height - this.role.h)
        }
        gameOver() {
            super.gameOver();
            this.gameOverStage.setText('得分：' + this.score);
        }
        loading() {
            console.log('loading...')
            super.loading();
        }
    }
    let view = document.getElementById('view');
    let w = view.offsetWidth;
    let h = view.offsetHeight;
    let stage = new Stage(w, h);
    let descript = new Discript('start');
    descript.text = '<p class="title">头头大作战</p>'
    let gameOver = new GameOver('restart');
    let title = new Title('头头大作战');
    let control = new Control();
    control.rect = [100, 100]
    let game = new G(view, stage, title, descript, gameOver, control);
    game.files = { image: ['head.png', 'zd.png'] };
    game.setup();
})();