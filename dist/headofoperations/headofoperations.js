var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../src/index.ts" />
(function () {
    var G = (function (_super) {
        __extends(G, _super);
        function G() {
            _super.apply(this, arguments);
            this.roleSize = 20;
            this.v = .5; //速度 
            this.av = 0; //加速度
            this.vx = this.v;
            this.vy = this.v;
            this.ballList = [];
            this.score = 0;
            this.zdList = [];
        }
        G.prototype.newGame = function () {
            this.init();
            this.createRole();
            //创建5个炸弹
            this.createZd();
            _super.prototype.newGame.call(this);
        };
        G.prototype.init = function () {
            this.ballList = [];
            this.zdList = [];
        };
        G.prototype.createRole = function () {
            this.role = new Sprite(this.context, 'head.png');
            this.role.shape = SHAPE.circle;
            this.role.setSize(this.roleSize, this.roleSize);
            this.role.x = this.stage.width / 2;
            this.role.y = this.stage.height / 2;
            this.role.r = this.role.h / 2;
        };
        G.prototype.running = function () {
            console.log(this.controlStage.getAngle());
            _super.prototype.running.call(this);
            this.move();
            this.role.draw();
            this.createBallList(); //创建小点点
            this.drawBallList();
            //吃小点
            this.checkHits();
            this.drawZdList();
        };
        G.prototype.drawZdList = function () {
            this.zdList.forEach(function (item) {
                item.draw();
            });
        };
        G.prototype.createZd = function () {
            for (var i = 0; i < 4; i++) {
                var zd = new Sprite(this.context, 'zd.png');
                this.zdList.push(zd);
                zd.setSize(20, 20);
                var keyx = this.stage.width / 4;
                var keyy = this.stage.height / 4;
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
                console.log(zd.x, zd.y);
            }
        };
        G.prototype.checkHits = function () {
            var _this = this;
            this.ballList.forEach(function (ball, i) {
                if (_this.hits(_this.role, ball)) {
                    _this.score++;
                    _this.role.w += 1;
                    _this.role.h += 1;
                    _this.role.setSize();
                    // delete this.ballList[i];
                    _this.ballList.splice(i, 1);
                }
            });
            this.zdList.forEach(function (ball) {
                if (_this.hits(_this.role, ball)) {
                    _this.over();
                }
            });
        };
        G.prototype.drawBallList = function () {
            this.ballList.forEach(function (item) {
                item.draw();
            });
        };
        G.prototype.createBallList = function () {
            var count = 100 - this.ballList.length;
            for (var i = 0; i < count; i++) {
                var ball = new Sprite(this.context, 'head.png');
                this.ballList.push(ball);
                ball.setSize(6, 6);
                ball.x = Math.random() * this.stage.width;
                ball.y = Math.random() * this.stage.height;
                ball.shape = SHAPE.circle;
            }
        };
        G.prototype.move = function () {
            var angle = this.controlStage.getAngle();
            if (angle != 0) {
                this.vx = Math.cos(angle) * this.v;
                this.vy = Math.sin(angle) * this.v;
            }
            this.role.x = this.vx + this.role.x;
            this.role.y = this.role.y - this.vy;
            this.role.x = Math.max(0, this.role.x);
            this.role.x = Math.min(this.role.x, this.stage.width - this.role.w);
            this.role.y = Math.max(0, this.role.y);
            this.role.y = Math.min(this.role.y, this.stage.height - this.role.h);
        };
        G.prototype.gameOver = function () {
            _super.prototype.gameOver.call(this);
            this.gameOverStage.setText('得分：' + this.score);
        };
        G.prototype.loading = function () {
            console.log('loading...');
            _super.prototype.loading.call(this);
        };
        return G;
    }(JY));
    var view = document.getElementById('view');
    var w = view.offsetWidth;
    var h = view.offsetHeight;
    var stage = new Stage(w, h);
    var descript = new Discript('start');
    descript.text = '<p class="title">头头大作战</p>';
    var gameOver = new GameOver('restart');
    var title = new Title('头头大作战');
    var control = new Control();
    control.rect = [100, 100];
    var game = new G(view, stage, title, descript, gameOver, control);
    game.files = { image: ['head.png', 'zd.png'] };
    game.setup();
})();

//# sourceMappingURL=headofoperations.js.map
