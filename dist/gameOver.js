/// <reference path="iScreen.ts" />
var GameOver = (function () {
    function GameOver(btntitle) {
        this.btntitle = btntitle;
    }
    GameOver.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        var btn = document.createElement('button');
        btn.className = "button gameOver";
        btn.innerText = this.btntitle;
        btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    };
    GameOver.prototype.remove = function () {
        this.elem.remove();
    };
    return GameOver;
}());

//# sourceMappingURL=gameOver.js.map
