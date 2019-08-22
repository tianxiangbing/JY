class G extends JY {
    constructor(...args){
        super(...args)
        this.interval = 20;
        this.count = 1;
        this.role;
        this.v = 2;//速度 
        this.ballList = [];//球的集合
        this.score = 0;
        this.scoreScreen;
    }
    newGame() {
        this.count = 1;
        this.v = 2;
        this.score = 0;
        this.ballList = [];
        //init
        this.createRole();
        super.newGame();
        this.control();
    }
    running() {
        super.running();
        this.count++;
        // console.log(this.count)
        this.role.draw();
        this.ballList.forEach(ball => {
            ball.draw();
        });
        this.createBoll();
        this.scoreScreen.change('您已行驶 ' + this.score + ' 米');
        this.drop();
        this.checkHits();

    }
    checkHits() {
        this.ballList.forEach(ball => {
            if (this.hits(this.role, ball)) {
                this.over()
            }
        });
    }
    gameOver() {
        super.gameOver();
        this.gameOverStage.setText('得分：' + this.score);
    }
    loading() {
        console.log('loading...')
        super.loading();
    }
    //创建英雄
    createRole() {
        this.role = new Sprite(this.context, 'car.png');
        let rect = this.stage.width / 3 - 10;
        this.role.setSize(rect, rect);
        let x = this.stage.width / 2 - this.role.w / 2;
        // this.role.setPosition(this.stage.width/3,this.stage.height - this.role.h);
        this.jump(1, this.role);
    }
    //控制器
    control() {
        this.stage.bindEvent(function (epos) {
            let w = this.stage.width;
            let h = this.stage.height;
            let col = Math.ceil(epos[0] / (w / 3));//分三栏，判断点击是哪一栏
            this.jump(col, this.role);
        }.bind(this));
    }
    //跳啊
    jump(col, obj) {
        let x = this.stage.width / 3 * col - this.stage.width / 3 / 2 - this.role.w / 2;
        obj.setPosition(x, this.stage.height / 2 + this.role.h);
    }
    //设置球的初始位置
    setBallInitPosition(ball, col) {
        let x = this.stage.width / 3 * col - this.stage.width / 3 / 2 - ball.w / 2;
        ball.setPosition(x, 0);
    }
    createBoll() {
        //创建小球
        if (this.count % 100 == 0) {
            this.v = Math.min(this.v + .3, 5);
            this.score++;
            //10帧创建
            let colPos = [1, 2, 3];//三列中的某一列
            let rnd = Math.ceil(Math.random() * 2);//创建一个或2;
            let i = 0;
            while (true) {
                let ball = new Ball(this.context, this.stage.width / 3 - 10, this.stage.width / 4);
                let col = Math.floor(Math.random() * colPos.length);
                this.setBallInitPosition(ball, colPos[col]);
                this.ballList.push(ball);
                colPos.splice(col, 1);
                i++;
                if (i >= rnd) {
                    break;
                }
            }
        }
    }
    drop() {
        this.ballList.forEach((ball, index) => {
            ball.drop(this.v);
            if (ball.x > this.stage.height) {
                this.ballList.splice(index, 1)
            }
        });
    }
}
class Ball extends Sprite {
    constructor(context, w, h) {
        super(context, 'car1.png');
        this.setSize(w, h);
    }
    drop(v) {
        this.setPosition(this.x, this.y + v)
    }
}
var view = document.getElementById('root');
var height = 200;
var width = 200;
var stage = new Stage(width, height);
var descript = new Descript('welcome');
descript.text = "hello world. descript";
let gameOver = new GameOver('restart');
let title = new Title('碰撞汽车');
let control = new Control();
control.rect = [100, 100]
let game = new G(view, stage, title, descript, gameOver);
game.files = { image: ['car1.png', 'car2.png', 'car.png'] };
game.setup();