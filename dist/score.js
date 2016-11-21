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

//# sourceMappingURL=score.js.map
