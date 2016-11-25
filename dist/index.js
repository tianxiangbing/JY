/// <reference path="sprite.ts" />
/// <reference path="title.ts" />
/// <reference path="descript.ts" />
/// <reference path="gameOver.ts" />
/// <reference path="stage.ts" />
/// <reference path="control.ts" />
/// <reference path="score.ts" />
//游戏主框架
var STATE;
(function (STATE) {
    STATE[STATE["loading"] = 0] = "loading";
    STATE[STATE["title"] = 1] = "title";
    STATE[STATE["descript"] = 2] = "descript";
    STATE[STATE["newGame"] = 3] = "newGame";
    STATE[STATE["running"] = 4] = "running";
    STATE[STATE["pause"] = 5] = "pause";
    STATE[STATE["levelUp"] = 6] = "levelUp";
    STATE[STATE["die"] = 7] = "die";
    STATE[STATE["gameOver"] = 8] = "gameOver";
})(STATE || (STATE = {}));
var JY = (function () {
    function JY(view, stage, titleStage, descriptStage, gameOverStage, controlStage) {
        this.view = view;
        this.stage = stage;
        this.titleStage = titleStage;
        this.descriptStage = descriptStage;
        this.gameOverStage = gameOverStage;
        this.controlStage = controlStage;
        this.func = new Function;
        this.interval = 10;
        console.log(this.view);
    }
    JY.prototype.setup = function () {
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
        document.addEventListener('touchmove', function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                window.event.returnValue == false;
            }
        });
    };
    JY.prototype.createStage = function () {
        console.log(this.stage);
        var canvas = this.stage.create();
        this.context = canvas.getContext('2d');
        this.view.appendChild(canvas);
    };
    JY.prototype.run = function () {
        console.log('run');
        //this.func();
        this.descriptStage.remove();
        this.createStage(); //创建舞台
        this.controlStage && this.createControl();
        this.setState(STATE.newGame);
    };
    //分数面板
    JY.prototype.scoreInit = function () {
        this.scoreScreen = new Score('--');
        this.view.appendChild(this.scoreScreen.create());
    };
    JY.prototype.createControl = function () {
        this.view.appendChild(this.controlStage.create());
    };
    //加载
    JY.prototype.loading = function () {
        this.loadFile(function () {
            this.setState(STATE.title);
        }.bind(this));
    };
    JY.prototype.loadFile = function (callback) {
        var _this = this;
        var obj = {};
        if (_this.files.length > 0) {
            var _loop_1 = function(v) {
                obj[v] = {};
                obj[v].count = 0;
                var type = v;
                console.log(_this.files[v]);
                var _loop_2 = function(i, l) {
                    var item = _this.files[v][i];
                    if (type == 'image') {
                        var img = new Image();
                        img.onload = function () {
                            obj[v].count++;
                            console.log(item + ' loaded');
                            if (_this.checkLoaded(obj)) {
                                callback.call(_this);
                            }
                        };
                        img.src = item;
                    }
                };
                for (var i = 0, l = _this.files[v].length; i < l; i++) {
                    _loop_2(i, l);
                }
            };
            for (var v in _this.files) {
                _loop_1(v);
            }
        }
        else {
            callback.call(_this);
        }
    };
    JY.prototype.checkLoaded = function (obj) {
        for (var v in obj) {
            if (obj[v].count != this.files[v].length) {
                return false;
            }
        }
        return true;
    };
    //标题
    JY.prototype.title = function () {
        console.log('title');
        var titleStage = this.titleStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(titleStage);
        setTimeout(function () {
            this.titleStage.remove();
            this.setState(STATE.descript);
        }.bind(this), 1000);
    };
    //说明
    JY.prototype.descript = function () {
        console.log('descript');
        var desc = this.descriptStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(desc);
    };
    //新的开始
    JY.prototype.newGame = function () {
        //游戏开始，清空场景
        //打开计时器
        this.scoreInit();
        this.setState(STATE.running);
        this.startTimer();
    };
    //结束 
    JY.prototype.over = function () {
        this.setState(STATE.gameOver);
    };
    //暂停
    JY.prototype.pause = function () {
        this.stopTimer();
    };
    //暂停后的继续
    JY.prototype.play = function () {
        this.startTimer();
    };
    //游戏结束
    JY.prototype.gameOver = function () {
        //游戏结束
        //清空场景，显示结果
        console.log('gameOver');
        this.scoreScreen.remove();
        this.stage.remove();
        this.controlStage && this.controlStage.remove();
        this.stopTimer();
        var gameOver = this.gameOverStage.create(function () {
            this.gameOverStage.remove();
            this.setState(STATE.descript);
        }.bind(this));
        this.view.appendChild(gameOver);
    };
    //停止刷新
    JY.prototype.stopTimer = function () {
        clearInterval(this.timer);
    };
    //刷新帧
    JY.prototype.startTimer = function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.func.bind(_this)();
        }, this.interval);
    };
    //游戏中的
    JY.prototype.running = function () {
        // console.log('running...')
    };
    //检查状态
    JY.prototype.checkState = function () {
        switch (this.currentState) {
            case STATE.loading:
                this.func = this.loading;
                break;
            case STATE.title:
                this.func = this.title;
                break;
            case STATE.descript:
                this.func = this.descript;
                break;
            case STATE.newGame:
                this.func = this.newGame;
                break;
            case STATE.running:
                this.func = this.running;
                break;
            case STATE.gameOver:
                this.func = this.gameOver;
            default:
                break;
        }
    };
    JY.prototype.setState = function (state) {
        this.currentState = state;
        this.checkState();
        this.func();
    };
    //碰撞检测
    JY.prototype.hits = function (oA, oB) {
        var bx = false, by = false;
        if (oA.shape == SHAPE.rect) {
            var bw = oB.w;
            var aw = oA.w;
            var bh = oB.h;
            var ah = oA.h;
            if (oA.x > oB.x) {
                bx = oA.x - oB.x < bw;
            }
            else if (oA.x < oB.x) {
                bx = oB.x - oA.x < aw;
            }
            else {
                bx = true;
            }
            ;
            if (oA.y > oB.y) {
                by = oA.y - oB.y < bh;
            }
            else if (oA.y < oB.y) {
                by = oB.y - oA.y < ah;
            }
            else {
                by = true;
            }
            ;
            return (bx && by);
        }
        else if (oA.shape == SHAPE.circle) {
            var r2 = oA.r + oB.r;
            bx = Math.abs(oA.x - oB.x) < r2;
            by = Math.abs(oA.y - oB.y) < r2;
            return (bx && by);
        }
    };
    return JY;
}());

//# sourceMappingURL=index.js.map
