var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="game.ts" />
var G = (function (_super) {
    __extends(G, _super);
    function G() {
        _super.apply(this, arguments);
        this.count = 1;
    }
    G.prototype.newGame = function () {
        _super.prototype.newGame.call(this);
    };
    G.prototype.running = function () {
        this.count++;
        if (this.count > 10) {
            this.over();
            return;
        }
        console.log(this.count);
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
}(Game));
var stage = new Stage(1000, 1000);
var game = new G(document.getElementById('view'), stage);
game.run();

//# sourceMappingURL=DodgeBall.js.map
