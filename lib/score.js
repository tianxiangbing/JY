"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Score = /** @class */ (function () {
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
        this.elem.parentNode.removeChild(this.elem);
    };
    return Score;
}());
exports.default = Score;
