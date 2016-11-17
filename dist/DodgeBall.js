var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="index.ts" />
var G = (function (_super) {
    __extends(G, _super);
    function G() {
        _super.apply(this, arguments);
        this.count = 1;
    }
    G.prototype.newGame = function () {
        this.count = 1;
        _super.prototype.newGame.call(this);
        this.createRole();
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
        this.role = new Sprite(this.context, 'ball.png');
        this.role.setSize(this.stage.width / 3, this.stage.width / 3);
        this.role.setPosition(this.stage.width / 3, this.stage.height - this.role.h);
    };
    return G;
}(JY));
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
game.files = { image: ['ball.png', 'boll.jpg'] };
game.setup();

//# sourceMappingURL=DodgeBall.js.map
