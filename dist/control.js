/// <reference path="iScreen.ts" />
//操作界面
var Control = (function () {
    function Control() {
        this.rect = [160, 160];
        this.moveRect = [50, 50];
        this.elemPosition = [80, 80];
    }
    Control.prototype.create = function () {
        this.elem = document.createElement('div');
        this.elem.className = "control";
        this.elem.style.position = 'absolute';
        this.elem.style.width = this.rect[0] + 'px';
        this.elem.style.height = this.rect[1] + 'px';
        this.elem.style.left = this.elemPosition[0] + 'px';
        this.elem.style.bottom = this.elemPosition[1] + 'px';
        this.moveElem = document.createElement('div');
        this.moveElem.className = 'move';
        this.moveElem.style.position = 'absolute';
        this.moveElem.style.width = this.moveRect[0] + 'px';
        this.moveElem.style.height = this.moveRect[1] + 'px';
        this.elem.appendChild(this.moveElem);
        this.moveCenter = this.moveRect.map(function (d, i) { return d / 2; });
        this.elemCenter = this.rect.map(function (d, i) { return d / 2; });
        this.resetPos();
        this.bindEvent();
        return this.elem;
    };
    Control.prototype.resetPos = function () {
        //重置位置
        console.log(this.moveCenter);
        this.transPosition(this.elemCenter);
    };
    //传入圆心转换成坐标,
    Control.prototype.transPosition = function (center) {
        var x = (center[0] - this.moveCenter[0]);
        var y = (center[1] - this.moveCenter[1]);
        this.moveElem.style.left = x + 'px';
        this.moveElem.style.top = y + 'px';
    };
    Control.prototype.bindEvent = function () {
        this.elem.addEventListener('touchstart', function (event) {
            var epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchmove', function (event) {
            var epos = event.touches[0] || event;
            this.setPosition(epos);
        }.bind(this), false);
        this.elem.addEventListener('touchend', function (event) {
            this.resetPos();
        }.bind(this), false);
    };
    // 计算边界值,设置位置
    Control.prototype.setPosition = function (epos) {
        this.position = this.position || [this.elem.offsetLeft, this.elem.offsetTop];
        var x = epos.pageX - this.position[0];
        var y = epos.pageY - this.position[1];
        // x= Math.min (x,this.rect[0]-this.moveCenter[0]);
        // x = Math.max(x,this.moveCenter[0])
        var toPos = [x, y];
        this.transPosition(toPos);
    };
    Control.prototype.remove = function () {
        this.elem.remove();
    };
    return Control;
}());

//# sourceMappingURL=control.js.map
