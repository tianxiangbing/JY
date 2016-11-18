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
            this.v = 3;
            this.ballList = []; //球的集合
        }
        G.prototype.newGame = function () {
            this.count = 1;
            this.createRole();
            _super.prototype.newGame.call(this);
            this.control();
        };
        G.prototype.running = function () {
            this.count++;
            if (this.count > 10000) {
                this.over();
                return;
            }
            // console.log(this.count)
            this.context.clearRect(0, 0, this.stage.width, this.stage.height);
            this.role.draw();
            this.ballList.forEach(function (ball) {
                ball.draw();
            });
            this.createBoll();
            this.drop();
            _super.prototype.running.call(this);
        };
        G.prototype.gameOver = function () {
            _super.prototype.gameOver.call(this);
        };
        G.prototype.loading = function () {
            console.log('loading...');
            _super.prototype.loading.call(this);
        };
        //创建英雄
        G.prototype.createRole = function () {
            this.role = new Sprite(this.context, 'role.gif');
            this.role.setSize(60, 60);
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
        G.prototype.createBoll = function () {
            //创建小球
            if (this.count % 70 == 0) {
                //10帧创建
                var rnd = Math.ceil(Math.random() * 2); //创建一个或2;
                var ball = new Ball(this.context);
                var x = this.stage.width / 3 * 2 - this.stage.width / 3 / 2 - this.role.w / 2;
                ball.setPosition(x, 0);
                this.ballList.push(ball);
            }
        };
        G.prototype.drop = function () {
            var _this = this;
            this.ballList.forEach(function (ball) {
                ball.drop(_this.v);
            });
        };
        return G;
    }(JY));
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(context) {
            _super.call(this, context, 'ball.png');
            this.setSize(30, 30);
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
    descript.text = '<p class="title">DodgeBall</p>';
    var gameOver = new GameOver('restart');
    var title = new Title('DodgeBall');
    var control = new Control();
    control.rect = [100, 100];
    var game = new G(view, stage, title, descript, gameOver);
    game.files = { image: ['ball.png', 'role.gif'] };
    game.setup();
})();

//# sourceMappingURL=DodgeBall.js.map
