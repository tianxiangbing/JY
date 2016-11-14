/// <reference path="iScreen.ts" />
var GameOver = (function () {
    function GameOver() {
    }
    GameOver.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        return this.elem;
    };
    GameOver.prototype.remove = function () {
    };
    return GameOver;
}());

//# sourceMappingURL=gameOver.js.map
