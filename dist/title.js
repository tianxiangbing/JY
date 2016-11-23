/// <reference path="iScreen.ts" />
//描述设计
var Title = (function () {
    function Title(title) {
        this.title = title;
        console.log(arguments);
    }
    Title.prototype.create = function (callback) {
        this.elem = document.createElement('div');
        this.elem.className = "title";
        this.elem.style.position = 'absolute';
        this.elem.innerHTML = this.title;
        return this.elem;
    };
    Title.prototype.remove = function () {
        this.elem.parentNode.removeChild(this.elem);
    };
    return Title;
}());

//# sourceMappingURL=title.js.map
