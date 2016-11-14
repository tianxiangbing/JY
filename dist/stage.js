//舞台设计
var Stage = (function () {
    function Stage(width, height, style) {
        this.width = width;
        this.height = height;
        this.style = style;
        console.log(arguments);
    }
    Stage.prototype.create = function () {
        this.canvas = document.createElement('canvas');
        // this.canvas.style ={width: this.width,height:this.height};
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = 'absolute';
        return this.canvas;
    };
    return Stage;
}());

//# sourceMappingURL=stage.js.map
