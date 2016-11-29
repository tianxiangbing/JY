var WriteText = (function () {
    function WriteText(context) {
        this.x = 0; //x坐标
        this.y = 0; //y坐标
        this.context = context;
    }
    WriteText.prototype.write = function (text, x, y, style) {
        if (style === void 0) { style = ''; }
        this.x = x;
        this.y = y;
        this.context.font = style;
        this.context.fillText(text, this.x, this.y);
    };
    return WriteText;
}());

//# sourceMappingURL=writeText.js.map
