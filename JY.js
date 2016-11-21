//sprite
//形状
var SHAPE;
(function (SHAPE) {
    SHAPE[SHAPE["rect"] = 0] = "rect";
    SHAPE[SHAPE["circle"] = 1] = "circle";
})(SHAPE || (SHAPE = {}));
var Sprite = (function () {
    function Sprite(context, url) {
        this.x = 0; //x坐标
        this.y = 0; //y坐标
        this.w = 0; //宽度 
        this.h = 0; //高度
        this.sw = 0; //剪裁的宽
        this.sh = 0; //前裁的高
        this.sx = 0; //剪裁的x
        this.sy = 0; //前裁的y
        this.r = 0; //半径
        this.shape = SHAPE.rect; //默认方形
        this.getImg(url);
        this.context = context;
    }
    Sprite.prototype.setImg = function (url) {
        this.getImg(url);
    };
    Sprite.prototype.getImg = function (url) {
        //地址转换成img对象 
        this.img = new Image();
        this.img.src = url;
        // this.img = document.createElement('img');
        // this.img.src = url;
        // console.log(this.img.readyState)
        // this.img.onreadystatechange=function(){
        //     console.log(222,this.img.readyState)
        // }
        this.img.onload = function () {
            console.log('loaded');
        };
        // this.img = document.createElement('img');
        // this.img.src = url;
    };
    Sprite.prototype.setSize = function (w, h) {
        this.w = w;
        this.h = h;
    };
    Sprite.prototype.setCutSize = function (sw, sh) {
        this.sw = sw;
        this.sh = sh;
    };
    Sprite.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Sprite.prototype.draw = function () {
        this.context.save();
        if (this.sw && this.sh) {
            this.context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
        }
        else {
            //不需要剪切
            this.context.drawImage(this.img, this.x, this.y, this.w, this.h);
        }
        // this.context.drawImage(this.img,10,10);
        this.context.restore();
    };
    return Sprite;
}());
/// <reference path="iScreen.ts" />
//描述设计
var Title = (function () {
    function Title(title) {
        this.title = title;
        console.log(arguments);
    }
    Title.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "title";
        this.elem.style.position = 'absolute';
        this.elem.innerHTML = this.title;
        return this.elem;
    };
    Title.prototype.remove = function () {
        this.elem.remove();
    };
    return Title;
}());
/// <reference path="iScreen.ts" />
//描述设计
var Discript = (function () {
    function Discript(btntitle, text) {
        this.btntitle = btntitle;
        this.text = text;
        console.log(arguments);
    }
    Discript.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        var btn = document.createElement('button');
        btn.className = 'button start';
        btn.innerText = this.btntitle;
        btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    };
    Discript.prototype.remove = function () {
        this.elem.remove();
    };
    return Discript;
}());
/// <reference path="iScreen.ts" />
var GameOver = (function () {
    function GameOver(btntitle) {
        this.btntitle = btntitle;
    }
    GameOver.prototype.create = function (callback, text) {
        if (text === void 0) { text = ''; }
        this.elem = document.createElement('div');
        this.elem.className = 'gameOver';
        this.textElem = document.createElement('div');
        this.textElem.className = 'text';
        this.textElem.innerHTML = text;
        this.elem.appendChild(this.textElem);
        var btn = document.createElement('button');
        btn.className = "button";
        btn.innerText = this.btntitle;
        btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    };
    GameOver.prototype.setText = function (text) {
        if (text === void 0) { text = ''; }
        this.textElem.innerHTML = text;
    };
    GameOver.prototype.remove = function () {
        this.elem.remove();
    };
    return GameOver;
}());
/// <reference path="iScreen.ts" />
//舞台设计
var Stage = (function () {
    function Stage(width, height, style) {
        this.width = width;
        this.height = height;
        this.style = style;
        console.log(arguments);
    }
    Stage.prototype.create = function () {
        this.elem = document.createElement('canvas');
        // this.canvas.style ={width: this.width,height:this.height};
        this.elem.width = this.width;
        this.elem.height = this.height;
        this.elem.style.position = 'absolute';
        return this.elem;
    };
    Stage.prototype.remove = function () {
        this.elem.remove();
    };
    //绑定事件回调
    Stage.prototype.bindEvent = function (callback) {
        this.elem.addEventListener('touchstart', function (event) {
            var epos = event.touches[0];
            callback([epos.pageX, epos.pageY]);
        }, false);
    };
    return Stage;
}());
/// <reference path="iScreen.ts" />
//操作界面
var Control = (function () {
    function Control() {
        this.rect = [160, 160];
        this.moveRect = [50, 50];
        this.elemPosition = [10, 10];
    }
    Control.prototype.create = function () {
        this.elem = document.createElement('div');
        this.elem.className = "control";
        this.elem.style.position = 'absolute';
        this.elem.style.width = this.rect[0] + 'px';
        this.elem.style.height = this.rect[1] + 'px';
        this.elem.style.left = this.elemPosition[0] + '%';
        this.elem.style.bottom = this.elemPosition[1] + '%';
        this.moveElem = document.createElement('div');
        this.moveElem.className = 'move';
        this.moveElem.style.position = 'absolute';
        this.moveElem.style.width = this.moveRect[0] + 'px';
        this.moveElem.style.height = this.moveRect[1] + 'px';
        this.elem.appendChild(this.moveElem);
        this.moveCenter = this.moveRect.map(function (d) { return d / 2; });
        this.elemCenter = this.rect.map(function (d) { return d / 2; });
        this.resetPos();
        this.bindEvent();
        return this.elem;
    };
    Control.prototype.resetPos = function () {
        //重置位置
        console.log(this.moveCenter);
        this.transPosition([0, 0]);
    };
    //传入圆心转换成坐标,
    Control.prototype.transPosition = function (center) {
        var x = (this.elemCenter[0] - this.moveCenter[0]) + center[0];
        var y = (this.elemCenter[1] - this.moveCenter[1]) - center[1];
        this.moveElem.style.left = x + 'px';
        this.moveElem.style.top = y + 'px';
    };
    Control.prototype.bindEvent = function () {
        this.elem.addEventListener('touchstart', function (event) {
            var epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchmove', function (event) {
            var epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchend', function (event) {
            this.resetPos();
        }.bind(this), false);
    };
    // 计算边界值,设置位置
    Control.prototype.setPosition = function (epos) {
        this.position = [this.elem.offsetLeft, this.elem.offsetTop];
        var x = epos.pageX - this.position[0];
        var y = epos.pageY - this.position[1];
        // x= Math.min (x,this.rect[0]-this.moveCenter[0]);
        // x = Math.max(x,this.moveCenter[0])
        var x1 = (x - this.elemCenter[0]); //相对于圆点的位置
        var y1 = -(y - this.elemCenter[1]);
        console.log(x1, y1);
        var ang = Math.atan2(y1, x1);
        // console.log('角度：'+ang)
        var c = Math.sqrt(x1 * x1 + y1 * y1);
        var r = this.elemCenter[0] - this.moveCenter[0]; //最长半径
        if (c > r) {
            // console.log('out', c)
            var x2 = Math.cos(ang) * r;
            var y2 = Math.sin(ang) * r;
            //下面是另一种算法
            // y2=y1*r/c;
            // x2= x1*r/c;
            // console.log('xy:', x1, y1)
            // console.log('x2y2:',x2, y2)
            x1 = x2;
            y1 = y2;
        }
        var toPos = [x1, y1];
        this.transPosition(toPos);
    };
    Control.prototype.remove = function () {
        this.elem.remove();
    };
    return Control;
}());
/// <reference path="iScreen.ts" />
//分数面板
var Score = (function () {
    function Score(text) {
        this.text = text;
        console.log(arguments);
    }
    Score.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "score";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        this.elem.style.right = this.right || '10px';
        this.elem.style.top = this.top || '10px';
        return this.elem;
    };
    Score.prototype.change = function (text) {
        this.text = text;
        this.elem.innerHTML = this.text;
    };
    Score.prototype.remove = function () {
        this.elem.remove();
    };
    return Score;
}());
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
