var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="index.ts" />
(function () {
    var G = (function (_super) {
        __extends(G, _super);
        function G() {
            _super.apply(this, arguments);
            this.count = 1;
            this.v = 2; //速度 
            this.ballList = []; //球的集合
            this.score = 0;
        }
        G.prototype.newGame = function () {
            this.count = 1;
            this.v = 2;
            this.score = 0;
            this.ballList = [];
            //init
            this.createRole();
            _super.prototype.newGame.call(this);
            this.control();
        };
        G.prototype.running = function () {
            this.count++;
            // console.log(this.count)
            this.context.clearRect(0, 0, this.stage.width, this.stage.height);
            this.role.draw();
            this.ballList.forEach(function (ball) {
                ball.draw();
            });
            this.createBoll();
            this.scoreScreen.change('您已行驶 ' + this.score + ' 米');
            this.drop();
            this.checkHits();
            _super.prototype.running.call(this);
        };
        G.prototype.checkHits = function () {
            var _this = this;
            this.ballList.forEach(function (ball) {
                if (_this.hits(_this.role, ball)) {
                    _this.over();
                }
            });
        };
        G.prototype.gameOver = function () {
            _super.prototype.gameOver.call(this);
            this.gameOverStage.setText('得分：' + this.score);
        };
        G.prototype.loading = function () {
            console.log('loading...');
            _super.prototype.loading.call(this);
        };
        //创建英雄
        G.prototype.createRole = function () {
            this.role = new Sprite(this.context, 'car.png');
            var rect = this.stage.width / 3 - 10;
            this.role.setSize(rect, rect);
            var x = this.stage.width / 2 - this.role.w / 2;
            // this.role.setPosition(this.stage.width/3,this.stage.height - this.role.h);
            this.jump(1, this.role);
        };
        //控制器
        G.prototype.control = function () {
            this.stage.bindEvent(function (epos) {
                var w = this.stage.width;
                var h = this.stage.height;
                var col = Math.ceil(epos[0] / (w / 3)); //分三栏，判断点击是哪一栏
                this.jump(col, this.role);
            }.bind(this));
        };
        //跳啊
        G.prototype.jump = function (col, obj) {
            var x = this.stage.width / 3 * col - this.stage.width / 3 / 2 - this.role.w / 2;
            obj.setPosition(x, this.stage.height / 2 + this.role.h);
        };
        //设置球的初始位置
        G.prototype.setBallInitPosition = function (ball, col) {
            var x = this.stage.width / 3 * col - this.stage.width / 3 / 2 - ball.w / 2;
            ball.setPosition(x, 0);
        };
        G.prototype.createBoll = function () {
            //创建小球
            if (this.count % 100 == 0) {
                this.v = Math.min(this.v + .3, 5);
                this.score++;
                //10帧创建
                var colPos = [1, 2, 3]; //三列中的某一列
                var rnd = Math.ceil(Math.random() * 2); //创建一个或2;
                var i = 0;
                while (true) {
                    var ball = new Ball(this.context, this.stage.width / 3 - 10, this.stage.width / 4);
                    var col = Math.floor(Math.random() * colPos.length);
                    this.setBallInitPosition(ball, colPos[col]);
                    this.ballList.push(ball);
                    colPos.splice(col, 1);
                    i++;
                    if (i >= rnd) {
                        break;
                    }
                }
            }
        };
        G.prototype.drop = function () {
            var _this = this;
            this.ballList.forEach(function (ball, index) {
                ball.drop(_this.v);
                if (ball.x > _this.stage.height) {
                    _this.ballList.splice(index, 1);
                }
            });
        };
        return G;
    }(JY));
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(context, w, h) {
            _super.call(this, context, 'car1.png');
            this.setSize(w, h);
        }
        Ball.prototype.drop = function (v) {
            this.setPosition(this.x, this.y + v);
        };
        return Ball;
    }(Sprite));
    var view = document.getElementById('view');
    var w = view.offsetWidth;
    var h = view.offsetHeight;
    var stage = new Stage(w, h);
    var descript = new Discript('start');
    descript.text = '<p class="title">碰撞汽车</p>';
    var gameOver = new GameOver('restart');
    var title = new Title('碰撞汽车');
    var control = new Control();
    control.rect = [100, 100];
    var game = new G(view, stage, title, descript, gameOver);
    game.files = { image: ['car1.png', 'car2.png', 'car.png'] };
    game.setup();
})();

//# sourceMappingURL=dropCars.js.map
