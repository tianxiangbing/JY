/// <reference path="sprite.ts" />
/// <reference path="stage.ts" />
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
var Game = (function () {
    function Game(view, stage) {
        this.view = view;
        this.stage = stage;
        this.func = new Function;
        this.interval = 20;
        console.log(this.view);
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
    }
    Game.prototype.createStage = function () {
        console.log(this.stage);
        this.view.appendChild(this.stage.create());
    };
    Game.prototype.run = function () {
        console.log('run');
        //this.func();
        this.createStage(); //创建舞台
        this.setState(STATE.newGame);
    };
    //加载
    Game.prototype.loading = function () {
        this.setState(STATE.title);
    };
    //标题
    Game.prototype.title = function () {
        console.log('title');
    };
    //说明
    Game.prototype.descript = function () {
        console.log('descript');
        this.setState(STATE.descript);
    };
    //新的开始
    Game.prototype.newGame = function () {
        //游戏开始，清空场景
        //打开计时器
        this.setState(STATE.running);
        this.startTimer();
    };
    //结束 
    Game.prototype.over = function () {
        this.setState(STATE.gameOver);
    };
    //暂停
    Game.prototype.pause = function () {
        this.stopTimer();
    };
    //暂停后的继续
    Game.prototype.play = function () {
        this.startTimer();
    };
    //游戏结束
    Game.prototype.gameOver = function () {
        //游戏结束
        //清空场景，显示结果
        console.log('gameOver');
        this.stopTimer();
    };
    //停止刷新
    Game.prototype.stopTimer = function () {
        clearInterval(this.timer);
    };
    //刷新帧
    Game.prototype.startTimer = function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.func.bind(_this)();
        }, this.interval);
    };
    //游戏中的
    Game.prototype.running = function () {
        console.log('running...');
    };
    //检查状态
    Game.prototype.checkState = function () {
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
    Game.prototype.setState = function (state) {
        this.currentState = state;
        this.checkState();
        this.func();
    };
    return Game;
}());

//# sourceMappingURL=game.js.map
