/// <reference path="sprite.ts" />
/// <reference path="title.ts" />
/// <reference path="descript.ts" />
/// <reference path="gameOver.ts" />
/// <reference path="stage.ts" />
/// <reference path="control.ts" />
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
        this.interval = 20;
        console.log(this.view);
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
    }
    JY.prototype.createStage = function () {
        console.log(this.stage);
        this.view.appendChild(this.stage.create());
    };
    JY.prototype.run = function () {
        console.log('run');
        //this.func();
        this.descriptStage.remove();
        this.createStage(); //创建舞台
        this.controlStage && this.createControl();
        this.setState(STATE.newGame);
    };
    JY.prototype.createControl = function () {
        this.view.appendChild(this.controlStage.create());
    };
    //加载
    JY.prototype.loading = function () {
        this.setState(STATE.title);
    };
    //标题
    JY.prototype.title = function () {
        console.log('title');
        var titleStage = this.titleStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(titleStage);
        setTimeout(function () {
            this.setState(STATE.descript);
        }.bind(this), 1000);
    };
    //说明
    JY.prototype.descript = function () {
        console.log('descript');
        this.titleStage.remove();
        var desc = this.descriptStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(desc);
    };
    //新的开始
    JY.prototype.newGame = function () {
        //游戏开始，清空场景
        //打开计时器
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
        this.stage.remove();
        this.controlStage && this.controlStage.remove();
        this.stopTimer();
        var gameOver = this.gameOverStage.create(function () {
            gameOver.remove();
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
    return JY;
}());

//# sourceMappingURL=index.js.map
