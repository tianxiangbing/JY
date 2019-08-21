"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//描述设计
var Descript = /** @class */ (function () {
    function Descript(btntitle, text) {
        this.btntitle = btntitle;
        this.text = text;
        console.log(arguments);
    }
    Descript.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        var btn = document.createElement('button');
        btn.className = 'button start';
        btn.innerText = this.btntitle;
        // btn.onclick = callback.bind(this);
        btn.addEventListener('touchstart', function (event) {
            callback.call(this);
        }.bind(this), false);
        btn.addEventListener('click', function (event) {
            callback.call(this);
        }.bind(this), false);
        this.elem.appendChild(btn);
        return this.elem;
    };
    Descript.prototype.remove = function () {
        this.elem.parentNode.removeChild(this.elem);
    };
    return Descript;
}());
exports.default = Descript;
