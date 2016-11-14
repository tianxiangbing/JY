/// <reference path="iScreen.ts" />
//描述设计
var Discript = (function () {
    function Discript(btntitle) {
        this.btntitle = btntitle;
        console.log(arguments);
    }
    Discript.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "discript";
        this.elem.style.position = 'absolute';
        var btn = document.createElement('button');
        btn.innerText = this.btntitle;
        btn.onclick = callback.bind(this);
        this.elem.appendChild(btn);
        return this.elem;
    };
    Discript.prototype.remove = function () {
        this.elem.remove();
    };
    return Discript;
}());

//# sourceMappingURL=descript.js.map
