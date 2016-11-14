/// <reference path="sprite.ts" />
/// <reference path="descript.ts" />
/// <reference path="gameOver.ts" />
/// <reference path="stage.ts" />
//游戏主框架
enum STATE {
    loading,
    title,
    descript,
    newGame,
    running,
    pause,
    levelUp,
    die,
    gameOver
}
class Game {
    private func: Function = new Function;
    private timer: any;
    private currentState: STATE;
    protected interval: number = 20;
    constructor(public view: any, public stage: Stage, public descriptStage: Discript,public gameOverStage?:GameOver) {
        console.log(this.view)
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
    }
    createStage() {
        console.log(this.stage)
        this.view.appendChild(this.stage.create());
    }
    run() {
        console.log('run')
        //this.func();
        this.descriptStage.remove();
        this.createStage();//创建舞台
        this.setState(STATE.newGame);
    }
    //加载
    loading() {
        this.setState(STATE.title)
    }
    //标题
    title() {
        console.log('title')
        this.setState(STATE.descript)
    }
    //说明
    descript() {
        console.log('descript');
        let desc = this.descriptStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(desc);
    }
    //新的开始
    protected newGame() {
        //游戏开始，清空场景
        //打开计时器
        this.setState(STATE.running);
        this.startTimer();
    }
    //结束 
    protected over() {
        this.setState(STATE.gameOver);
    }
    //暂停
    protected pause() {
        this.stopTimer();
    }
    //暂停后的继续
    protected play() {
        this.startTimer();
    }
    //游戏结束
    protected gameOver() {
        //游戏结束
        //清空场景，显示结果
        console.log('gameOver');
        this.stage.remove();
        this.stopTimer();
        let gameOver = this.gameOverStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(gameOver);
    }
    //停止刷新
    stopTimer() {
        clearInterval(this.timer);
    }
    //刷新帧
    startTimer() {
        let _this = this;
        this.timer = setInterval(function () {
            _this.func.bind(_this)();
        }, this.interval)
    }
    //游戏中的
    running() {
        console.log('running...')
    }
    //检查状态
    checkState() {
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
    }
    setState(state?: STATE) {
        this.currentState = state;
        this.checkState();
        this.func();
    }
}