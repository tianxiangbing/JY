/// <reference path="sprite.ts" />
/// <reference path="title.ts" />
/// <reference path="descript.ts" />
/// <reference path="gameOver.ts" />
/// <reference path="stage.ts" />
/// <reference path="control.ts" />
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
class JY {
    private func: Function = new Function;
    private timer: any;
    private currentState: STATE;
    protected interval: number = 10;
    protected context;
    files: any;
    constructor(public view: any, public stage: Stage, public titleStage: Title, public descriptStage: Discript, public gameOverStage?: GameOver, public controlStage?: Control) {
        console.log(this.view)
    }
    setup() {
        this.currentState = STATE.loading;
        this.setState(STATE.loading);
        document.addEventListener('touchmove', function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                window.event.returnValue == false;
            }
        });
    }
    createStage() {
        console.log(this.stage)
        let canvas = this.stage.create();
        this.context = canvas.getContext('2d');
        this.view.appendChild(canvas);
    }
    run() {
        console.log('run')
        //this.func();
        this.descriptStage.remove();
        this.createStage();//创建舞台
        this.controlStage && this.createControl();
        this.setState(STATE.newGame);
    }
    createControl() {
        this.view.appendChild(this.controlStage.create());
    }
    //加载
    loading() {
        this.loadFile(function () {
            this.setState(STATE.title)
        }.bind(this));
    }
    loadFile(callback: Function) {
        let _this = this;
        let obj = {};
        for (let v in _this.files) {
            obj[v]={};
            obj[v].count = 0;
            let type = v;
            console.log(_this.files[v])
            for (let i = 0, l = _this.files[v].length; i < l; i++) {
                let item = _this.files[v][i];
                if (type == 'image') {
                    let img = new Image();
                    img.onload = function () {
                        obj[v].count++;
                        console.log(item + ' loaded');
                        if (_this.checkLoaded(obj)) {
                            callback.call(_this);
                        }
                    }
                    img.src = item;
                }
            }
        }
    }
    checkLoaded(obj) {
        for(var v in obj ){
            if(obj[v].count != this.files[v].length){
                return false;
            }
        }
        return true;
    }
    //标题
    title() {
        console.log('title')
        let titleStage = this.titleStage.create(function () {
            this.run();
        }.bind(this));
        this.view.appendChild(titleStage);
        setTimeout(function () {
            this.setState(STATE.descript)
        }.bind(this), 1000);
    }
    //说明
    descript() {
        console.log('descript');
        this.titleStage.remove();
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
        this.controlStage && this.controlStage.remove();
        this.stopTimer();
        let gameOver = this.gameOverStage.create(function () {
            gameOver.remove();
            this.setState(STATE.descript);
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
        // console.log('running...')
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