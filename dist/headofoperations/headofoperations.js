var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../src/index.ts" />
(function () {
    var G = (function (_super) {
        __extends(G, _super);
        function G() {
            _super.apply(this, arguments);
        }
        G.prototype.newGame = function () {
            this.createRole();
            _super.prototype.newGame.call(this);
        };
        G.prototype.createRole = function () {
            this.role = new Sprite(this.context, 'head.png');
            this.role.shape = SHAPE.circle;
            this.role.setSize(this.roleSize, this.roleSize);
            this.role.x = this.stage.width / 2;
            this.role.y = this.stage.height / 2;
        };
        G.prototype.running = function () {
            console.log(this.controlStage.getAngle());
            _super.prototype.running.call(this);
            this.role.draw();
        };
        G.prototype.gameOver = function () {
            _super.prototype.gameOver.call(this);
            this.gameOverStage.setText('得分：');
        };
        G.prototype.loading = function () {
            console.log('loading...');
            _super.prototype.loading.call(this);
        };
        return G;
    }(JY));
    var view = document.getElementById('view');
    var w = view.offsetWidth;
    var h = view.offsetHeight;
    var stage = new Stage(w, h);
    var descript = new Discript('start');
    descript.text = '<p class="title">头头大作战</p>';
    var gameOver = new GameOver('restart');
    var title = new Title('头头大作战');
    var control = new Control();
    control.rect = [100, 100];
    var game = new G(view, stage, title, descript, gameOver, control);
    game.files = { image: ['head.png'] };
    game.setup();
})();

//# sourceMappingURL=headofoperations.js.map
