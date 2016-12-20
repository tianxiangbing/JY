var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../src/index.ts" />
/// <reference path="names.ts" />
(function () {
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(context, w, h, name) {
            _super.call(this, context, 'head.png');
            this.name = "游客" + (new Date().getTime()).toString().substr(-5);
            this.setSize(w, h);
            this.shape = SHAPE.circle;
            this.name = name || this.name;
        }
        Ball.prototype.draw = function (angle) {
            _super.prototype.draw.call(this, angle);
            var text = new WriteText(this.context);
            text.write(this.name, this.x, this.y + this.r);
        };
        Ball.prototype.drop = function (v) {
            this.setPosition(this.x, this.y + v);
        };
        Ball.prototype.eat = function () {
            var _this = this;
            this.setImg('eat.png');
            setTimeout(function () { return _this.setImg('head.png'); }, 300);
        };
        return Ball;
    }(Sprite));
    //机器人
    var Robot = (function (_super) {
        __extends(Robot, _super);
        function Robot(context) {
            _super.call(this, context, 10, 10);
            this.context = context;
            this.score = 0;
            this.angle = 0;
            this.v = .5;
            this.vx = this.v;
            this.vy = this.v;
            this.score = 20 + Math.floor(Math.random() * 30);
            this.w = this.score;
            this.h = this.score;
            var index = Math.random() * names.length - 1;
            this.name = names[index];
            names.splice(index, 1);
            this.trans();
        }
        //随机更换方向
        Robot.prototype.trans = function () {
            this.angle = Math.atan2(-1 + Math.random() * 2, -1 + Math.random() * 2);
            return this.angle;
        };
        Robot.prototype.move = function (stage) {
            var angle = 0;
            if (Math.random() * 1000 < 3) {
                this.trans();
            }
            angle = -this.angle;
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
        };
        Robot.prototype.draw = function () {
            _super.prototype.draw.call(this, this.angle);
        };
        return Robot;
    }(Ball));
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
            this.score = 20;
            this.zdList = [];
            this.robotList = [];
        }
        G.prototype.newGame = function () {
            this.init();
            this.createRole();
            //创建5个炸弹
            // this.createZd();
            this.createRobot();
            _super.prototype.newGame.call(this);
        };
        G.prototype.init = function () {
            this.ballList = [];
            this.zdList = [];
            this.robotList = [];
        };
        G.prototype.createRobot = function () {
            for (var i = this.robotList.length; i < 5; i++) {
                var robot = new Robot(this.context);
                robot.x = Math.random() * this.stage.width;
                robot.y = Math.random() * this.stage.height;
                robot.r = robot.h / 2;
                this.robotList.push(robot);
            }
        };
        G.prototype.createRole = function () {
            // this.role = new Sprite(this.context, 'head.png');
            this.role = new Ball(this.context, this.roleSize, this.roleSize);
            this.role.x = this.stage.width / 2;
            this.role.y = this.stage.height / 2;
            this.role.r = this.role.h / 2;
        };
        G.prototype.running = function () {
            // console.log(this.controlStage.getAngle())
            _super.prototype.running.call(this);
            this.move();
            this.role.draw(this.angle);
            this.createBallList(); //创建小点点
            this.drawBallList();
            //吃小点
            this.checkHits();
            this.drawZdList();
            //robot
            this.drawRobot();
            this.createRobot();
        };
        G.prototype.drawZdList = function () {
            this.zdList.forEach(function (item) {
                item.draw();
            });
        };
        G.prototype.drawRobot = function () {
            var _this = this;
            this.robotList.forEach(function (item) {
                item.move(_this.stage);
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
                    _this.role.eat();
                }
                _this.robotList.forEach(function (item, j) {
                    if (_this.hits(item, ball)) {
                        item.score++;
                        item.w += 1;
                        item.h += 1;
                        item.setSize();
                        // delete this.ballList[i];
                        _this.ballList.splice(i, 1);
                        item.eat();
                    }
                    if (_this.hits(item, _this.role)) {
                        if (item.score > _this.score) {
                            _this.over();
                        }
                        else if (item.score < _this.score) {
                            _this.score += item.score;
                            _this.robotList.splice(j, 1);
                        }
                    }
                });
            });
            this.robotList.forEach(function (item, i) {
                _this.robotList.forEach(function (obj, j) {
                    if (i != j && _this.hits(item, obj) && item.score != obj.score) {
                        if (item.score > obj.score) {
                            item.score += obj.score;
                            _this.robotList.splice(j, 1);
                        }
                        else {
                            obj.score += item.score;
                            _this.robotList.splice(i, 1);
                        }
                    }
                });
            });
            this.zdList.forEach(function (ball) {
                if (_this.hits(_this.role, ball)) {
                    _this.over();
                }
                _this.robotList.forEach(function (item, i) {
                    if (_this.hits(item, ball)) {
                        _this.robotList.splice(i, 1);
                    }
                });
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
    setTimeout(function () {
        var view = document.getElementById('view');
        var w = view.offsetWidth;
        var h = view.offsetHeight;
        var stage = new Stage(w, h);
        var descript = new Discript('start');
        descript.text = '<p class="title">大头吃小头</p>';
        var gameOver = new GameOver('restart');
        var title = new Title('大头吃小头');
        var control = new Control();
        control.rect = [100, 100];
        var game = new G(view, stage, title, descript, gameOver, control);
        game.files = { image: ['head.png', 'zd.png'] };
        game.setup();
    }, 1000);
})();

//# sourceMappingURL=headofoperations.js.map
