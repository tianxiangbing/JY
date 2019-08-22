(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./example/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./example/index.js":
/*!**************************!*\
  !*** ./example/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var G = function (_JY) {
    _inherits(G, _JY);

    function G() {
        var _ref;

        _classCallCheck(this, G);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = G.__proto__ || Object.getPrototypeOf(G)).call.apply(_ref, [this].concat(args)));

        _this.interval = 20;
        _this.count = 1;
        _this.role;
        _this.v = 2; //速度 
        _this.ballList = []; //球的集合
        _this.score = 0;
        _this.scoreScreen;
        return _this;
    }

    _createClass(G, [{
        key: 'newGame',
        value: function newGame() {
            this.count = 1;
            this.v = 2;
            this.score = 0;
            this.ballList = [];
            //init
            this.createRole();
            _get(G.prototype.__proto__ || Object.getPrototypeOf(G.prototype), 'newGame', this).call(this);
            this.control();
        }
    }, {
        key: 'running',
        value: function running() {
            _get(G.prototype.__proto__ || Object.getPrototypeOf(G.prototype), 'running', this).call(this);
            this.count++;
            // console.log(this.count)
            this.role.draw();
            this.ballList.forEach(function (ball) {
                ball.draw();
            });
            this.createBoll();
            this.scoreScreen.change('您已行驶 ' + this.score + ' 米');
            this.drop();
            this.checkHits();
        }
    }, {
        key: 'checkHits',
        value: function checkHits() {
            var _this2 = this;

            this.ballList.forEach(function (ball) {
                if (_this2.hits(_this2.role, ball)) {
                    _this2.over();
                }
            });
        }
    }, {
        key: 'gameOver',
        value: function gameOver() {
            _get(G.prototype.__proto__ || Object.getPrototypeOf(G.prototype), 'gameOver', this).call(this);
            this.gameOverStage.setText('得分：' + this.score);
        }
    }, {
        key: 'loading',
        value: function loading() {
            console.log('loading...');
            _get(G.prototype.__proto__ || Object.getPrototypeOf(G.prototype), 'loading', this).call(this);
        }
        //创建英雄

    }, {
        key: 'createRole',
        value: function createRole() {
            this.role = new Sprite(this.context, 'car.png');
            var rect = this.stage.width / 3 - 10;
            this.role.setSize(rect, rect);
            var x = this.stage.width / 2 - this.role.w / 2;
            // this.role.setPosition(this.stage.width/3,this.stage.height - this.role.h);
            this.jump(1, this.role);
        }
        //控制器

    }, {
        key: 'control',
        value: function control() {
            this.stage.bindEvent(function (epos) {
                var w = this.stage.width;
                var h = this.stage.height;
                var col = Math.ceil(epos[0] / (w / 3)); //分三栏，判断点击是哪一栏
                this.jump(col, this.role);
            }.bind(this));
        }
        //跳啊

    }, {
        key: 'jump',
        value: function jump(col, obj) {
            var x = this.stage.width / 3 * col - this.stage.width / 3 / 2 - this.role.w / 2;
            obj.setPosition(x, this.stage.height / 2 + this.role.h);
        }
        //设置球的初始位置

    }, {
        key: 'setBallInitPosition',
        value: function setBallInitPosition(ball, col) {
            var x = this.stage.width / 3 * col - this.stage.width / 3 / 2 - ball.w / 2;
            ball.setPosition(x, 0);
        }
    }, {
        key: 'createBoll',
        value: function createBoll() {
            //创建小球
            if (this.count % 100 == 0) {
                this.v = Math.min(this.v + .3, 5);
                this.score++;
                //10帧创建
                var colPos = [1, 2, 3]; //三列中的某一列
                var rnd = Math.ceil(Math.random() * 2); //创建一个或2;
                var i = 0;
                while (true) {
                    var ball = new Ball(this.context, this.stage.width / 3 - 10, this.stage.width / 4);
                    var col = Math.floor(Math.random() * colPos.length);
                    this.setBallInitPosition(ball, colPos[col]);
                    this.ballList.push(ball);
                    colPos.splice(col, 1);
                    i++;
                    if (i >= rnd) {
                        break;
                    }
                }
            }
        }
    }, {
        key: 'drop',
        value: function drop() {
            var _this3 = this;

            this.ballList.forEach(function (ball, index) {
                ball.drop(_this3.v);
                if (ball.x > _this3.stage.height) {
                    _this3.ballList.splice(index, 1);
                }
            });
        }
    }]);

    return G;
}(JY);

var Ball = function (_Sprite) {
    _inherits(Ball, _Sprite);

    function Ball(context, w, h) {
        _classCallCheck(this, Ball);

        var _this4 = _possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, context, 'car1.png'));

        _this4.setSize(w, h);
        return _this4;
    }

    _createClass(Ball, [{
        key: 'drop',
        value: function drop(v) {
            this.setPosition(this.x, this.y + v);
        }
    }]);

    return Ball;
}(Sprite);

var view = document.getElementById('root');
var height = 200;
var width = 200;
var stage = new Stage(width, height);
var descript = new Descript('welcome');
descript.text = "hello world. descript";
var gameOver = new GameOver('restart');
var title = new Title('碰撞汽车');
var control = new Control();
control.rect = [100, 100];
var game = new G(view, stage, title, descript, gameOver);
game.files = { image: ['car1.png', 'car2.png', 'car.png'] };
game.setup();

/***/ })

/******/ });
});
//# sourceMappingURL=test.js.map