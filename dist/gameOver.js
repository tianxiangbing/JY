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
        btn.addEventListener('touchstart', function (event) {
            callback.call(this);
        }.bind(this), false);
        // btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    };
    GameOver.prototype.setText = function (text) {
        if (text === void 0) { text = ''; }
        this.textElem.innerHTML = text;
    };
    GameOver.prototype.remove = function () {
        this.elem.parentNode.removeChild(this.elem);
    };
    return GameOver;
}());

//# sourceMappingURL=gameOver.js.map
