/// <reference path="iScreen.ts" />
//描述设计
var Discript = (function () {
    function Discript(btntitle, text) {
        this.btntitle = btntitle;
        this.text = text;
        console.log(arguments);
    }
    Discript.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.innerHTML = this.text || '';
        this.elem.style.position = 'absolute';
        var btn = document.createElement('button');
        btn.className = 'button start';
        btn.innerText = this.btntitle;
        btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    };
    Discript.prototype.remove = function () {
        this.elem.parentNode.removeChild(this.elem);
    };
    return Discript;
}());

//# sourceMappingURL=descript.js.map
