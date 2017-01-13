/// <reference path="../../src/index.ts" />
/// <reference path="names.ts" />
(function () {
    class Ball extends Sprite {
        name: string = "游客" + (new Date().getTime()).toString().substr(-5);
        url: string;
        score: number = 0;
        constructor(context: any, w: number, h: number, name?: string, url: string = 'head-a.png', score: number = 10) {
            super(context, url);
            this.score = score;
            this.setSize();
            this.url = url;
            this.shape = SHAPE.circle;
            this.name = name || this.name;
        }
        draw(angle?: number) {
            this.setSize();
            super.draw(angle);
            let text = new WriteText(this.context);
            text.write(this.name, this.x, this.y + this.r, null, '#cccccc')
        }
        drop(v: number) {
            this.setPosition(this.x, this.y + v)
        }
        eat(url: string = 'eat-a.png') {
            this.setImg(url);
            setTimeout(() => this.setImg(this.url), 300);
        }
        setSize() {
            //1分相当于math.pi*5*5
            let r = Math.sqrt(this.score) * 5;
            super.setSize(2 * r, 2 * r);
        }
    }
    //机器人
    class Robot extends Ball {
        score: number = 0;
        angle: number = 0;
        v: number = 1;
        vx: number = this.v;
        vy: number = this.v;
        constructor(public context: any) {
            super(context, 10, 10, undefined, 'head.png');
            let score = 10 + Math.floor(Math.random() * 10);
            this.score = score;
            let index = Math.floor(Math.random() * names.length - 1);;
            this.name = names[index];
            names.splice(index, 1);
            this.trans();
            this.setSize();
        }
        //随机更换方向
        trans() {
            this.angle = Math.atan2(-1 + Math.random() * 2, -1 + Math.random() * 2);
            return this.angle;
        }
        move(stage: Stage) {
            let angle = 0;
            if (Math.random() * 1000 < 3) {
                this.trans();
            }
            angle = - this.angle;
            if (angle != 0) {
                this.vx = Math.cos(angle) * this.v;
                this.vy = Math.sin(angle) * this.v;
            }
            this.x = this.vx + this.x;
            this.y = this.y - this.vy;
            this.x = Math.max(0, this.x);
            this.x = Math.min(this.x, stage.width - this.w);
            this.y = Math.max(0, this.y);
            this.y = Math.min(this.y, stage.height - this.h);
            if (this.x == 0 || this.y == 0 || this.x == stage.width - this.w || this.y == stage.height - this.h) {
                // console.log(this.x,this.y)
                this.trans();
            }
        }
        draw() {
            super.draw(this.angle);
        }
        eat() {
            super.eat('eat.png')
        }
    }
    class G extends JY {
        interval: 15;
        role: Ball;
        roleSize: number = 10;
        v: number = 1;//速度 
        av: number = 0;//加速度
        vx: number = this.v;
        vy: number = this.v;
        ballList: Array<Sprite> = [];
        score: number = 10;
        zdList: Array<Sprite> = [];
        angle: number;
        robotList: Array<Robot> = [];
        accelerate: Accelerate;
        decompose: boolean = false;
        decomposeV: number = 0;//分解速度
        newGame() {
            this.init();
            this.createRole();
            //创建5个炸弹
            this.createZd();
            this.createRobot();
            super.newGame();
            //
            this.createAccelerate()//创建加速器
        }
        createAccelerate() {
            this.accelerate = new Accelerate();
            this.view.appendChild(this.accelerate.create((e) => {
                this.v = 5;
                this.decompose = true;
            }, (e) => {
                this.v = 1;
                this.decompose = false;
            }));
        }
        init() {
            this.score = 10;
            this.ballList = [];
            this.zdList = [];
            this.robotList = [];
        }
        createRobot() {
            for (let i = this.robotList.length; i < 15; i++) {
                let robot = new Robot(this.context);
                robot.x = Math.random() * this.stage.width;
                robot.y = Math.random() * this.stage.height;
                robot.r = robot.h / 2;
                this.robotList.push(robot);
            }
            this.decomposeV <= 0 ? this.decomposeV = 20 : undefined;
            //加速时分解
            if (this.decompose && this.decomposeV >= 20 && this.role.score > 0) {
                // debugger;
                // console.log('分解了')
                this.decompose = false;
                this.createCopy();
                this.role.setSize();
            }
        }
        //创建分身
        createCopy() {
            if (this.decomposeV >= 20) {
                let ball: Robot = new Robot(this.context);
                ball.name = '分身';
                ball.score = Math.ceil(this.role.score / 2);
                ball.setSize();
                ball.x = this.vx > 0 ? this.role.x + this.role.r - 1 * (this.vx + this.role.w) : this.role.x + this.role.w - this.vx;
                ball.y = this.vy < 0 ? this.role.y + this.role.r - 1 * (this.vy + this.role.h) : this.role.y + this.role.h + this.vy;
                ball.shape = SHAPE.circle;
                ball.setPosition(ball.x, ball.y);
                this.role.score = Math.floor(this.role.score / 2);
                this.robotList.push(ball);
            }
        }
        createRole() {
            // this.role = new Sprite(this.context, 'head.png');
            this.role = new Ball(this.context, this.roleSize, this.roleSize);
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
            //robot
            this.drawRobot();
            this.createRobot();
            //移动视窗
            this.moveScreen();

            this.scoreScreen.change('得分：' + this.role.score.toString());

            this.decomposeV > 0 ? this.decomposeV-- : undefined;
        }
        moveScreen() {
            let h = this.view.clientHeight;
            let w = this.view.clientWidth;
            let x = Math.floor(this.role.x + this.role.r - w / 2);
            let y = Math.floor(this.role.y + this.role.r - h / 2);
            let maxx = this.stage.width - w;
            let maxy = this.stage.height - h;
            this.stage.elem.style.left = -Math.min(maxx, Math.max(0, x)) + 'px';
            this.stage.elem.style.top = -Math.min(maxy, Math.max(0, y)) + 'px';
        }
        drawZdList() {
            this.zdList.forEach(item => {
                item.draw()
            });
        }
        drawRobot() {
            this.robotList.forEach(item => {
                item.move(this.stage)
                item.draw();
            })
        }
        createZd() {
            for (let i = 0; i < 4; i++) {
                let zd: Sprite = new Sprite(this.context, 'zd.png');
                this.zdList.push(zd);
                zd.setSize(10, 10);
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
                    this.role.score++;
                    this.role.setSize()
                    // delete this.ballList[i];
                    this.ballList.splice(i, 1);
                    this.role.eat();
                }
                this.robotList.forEach((item, j) => {
                    if (this.hits(item, ball)) {
                        item.score++;
                        item.setSize()
                        // delete this.ballList[i];
                        this.ballList.splice(i, 1);
                        item.eat();
                    }
                    if (this.hits(item, this.role)) {
                        if (item.score > this.role.score) {
                            this.over();
                        } else if (item.score < this.role.score) {
                            this.role.score += item.score;
                            this.robotList.splice(j, 1);
                        }
                    }
                });
            });
            this.robotList.forEach((item, i) => {
                this.robotList.forEach((obj, j) => {
                    if (i != j && this.hits(item, obj) && item.score != obj.score) {
                        if (item.score > obj.score) {
                            item.score += obj.score;
                            this.robotList.splice(j, 1);
                        } else {
                            obj.score += item.score;
                            this.robotList.splice(i, 1);
                        }
                    }
                });
            });
            this.zdList.forEach((ball) => {
                if (this.hits(this.role, ball)) {
                    this.decomposeV <= 0 ? this.decomposeV = 20 : undefined;
                    this.createCopy();
                }
                this.robotList.forEach((item, i) => {
                    if (this.hits(item, ball)) {
                        this.robotList.splice(i, 1);
                    }
                });
            });
        }
        drawBallList() {
            this.ballList.forEach(item => {
                item.draw()
            });
        }
        createBallList() {
            let count: number = 300 - this.ballList.length;
            for (let i = 0; i < count; i++) {
                let ball: Sprite = new Sprite(this.context, 'head.png');
                this.ballList.push(ball);
                ball.setSize(5, 5);
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
            this.gameOverStage.setText('得分：' + this.role.score);
            this.accelerate.remove();
        }
        loading() {
            console.log('loading...')
            super.loading();
        }
    }
    //加速面板
    class Accelerate implements IScreen {
        elem: HTMLElement;
        create(startCallback?: Function, endCallback?: Function) {
            this.elem = document.createElement('div');
            this.elem.className = "accelerate";
            // this.elem.style.background = 'url(act.png) no-repeaat'
            this.elem.style.position = 'absolute';
            this.elem.style.right = '10%';
            this.elem.style.bottom = '10%';
            this.elem.addEventListener('touchstart', (e) => {
                startCallback(e);
            }, false);
            this.elem.addEventListener('touchend', (e) => {
                endCallback(e);
            }, false);
            return this.elem;
        }
        remove() {
            this.elem && this.elem.parentNode.removeChild(this.elem);
        }
    }
    setTimeout(function () {
        let view = document.getElementById('view');
        let w = view.offsetWidth;
        let h = view.offsetHeight;
        let stage = new Stage(w * 3, h * 3);
        let descript = new Discript('start');
        descript.text = '<p class="title">大头吃小头</p>'
        let gameOver = new GameOver('restart');
        let title = new Title('大头吃小头');
        let control = new Control();
        control.rect = [100, 100]
        let game = new G(view, stage, title, descript, gameOver, control);
        game.files = { image: ['act.png', 'head.png', 'head-a.png', 'eat-a.png', 'eat.png', 'zd.png'] };
        game.setup();
    }, 1000)
})();