"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WriteText = /** @class */ (function () {
    function WriteText(context) {
        this.x = 0; //x坐标
        this.y = 0; //y坐标
        this.context = context;
    }
    WriteText.prototype.write = function (text, x, y, style, fillStyle) {
        if (style === void 0) { style = ''; }
        if (fillStyle === void 0) { fillStyle = ''; }
        this.x = x;
        this.y = y;
        this.context.font = style;
        this.context.fillStyle = fillStyle;
        this.context.fillText(text, this.x, this.y);
    };
    return WriteText;
}());
exports.default = WriteText;
