/// <reference path="iScreen.ts" />
//舞台设计
var Stage = (function () {
    function Stage(width, height, style) {
        this.width = width;
        this.height = height;
        this.style = style;
        console.log(arguments);
    }
    Stage.prototype.create = function () {
        this.elem = document.createElement('canvas');
        // this.canvas.style ={width: this.width,height:this.height};
        this.elem.width = this.width;
        this.elem.height = this.height;
        this.elem.style.position = 'absolute';
        return this.elem;
    };
    Stage.prototype.remove = function () {
        this.elem.remove();
    };
    return Stage;
}());

//# sourceMappingURL=stage.js.map
