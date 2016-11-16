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
    };
    G.prototype.running = function () {
        this.count++;
        if (this.count > 10000) {
            this.over();
            return;
        }
        // console.log(this.count)
        _super.prototype.running.call(this);
    };
    G.prototype.gameOver = function () {
        _super.prototype.gameOver.call(this);
    };
    G.prototype.loading = function () {
        console.log('loading...');
        _super.prototype.loading.call(this);
    };
    return G;
}(JY));
var stage = new Stage(1000, 1000);
var descript = new Discript('start');
var gameOver = new GameOver('restart');
var title = new Title('躲避球');
var control = new Control();
control.rect = [100, 100];
var game = new G(document.getElementById('view'), stage, title, descript, gameOver, control);

//# sourceMappingURL=DodgeBall.js.map
