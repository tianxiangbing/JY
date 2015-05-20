/*
 *打地鼠
 *author: 田想兵
 *date:2015/5/18
 *email:55342775@qq.com
 *web:http://www.lovewebgames.com
 */
(function(JY) {
	var MoleGame = function() {};
	var game = function() {};
	game.prototype = new Game;
	g = new game();
	JY.extend(game.prototype, {
		newGame: function() {
			//console.log('new');
			this.level = 1;
			this.life = 5;
			this.v = 15;
			//this.holeArr = [];
			this.hitsArr = [];
			this.scoreType = [1, 2, 5, -5];
			this.killArr = [0, 0, 0, 0];
			this.T = null;
			this.score = 0;
			this.wait = 20;
			this.drawToolbar();
			this.drawMap();
			this.bindEvent();
		},
		runGame: function() {
			this.creaetMole();
			this.checkLife();
			this.animateMole();
			this.createT();
			this.kill();
			this.checkScore();
			this.getScore();
			this.checkLevel();
		},
		checkLevel: function() {
			this.level = Math.floor(this.score / 10);
			this.wait = Math.max(this.wait - this.level, 0);
		},
		bindEvent: function() {
			var _this = this;
			JY.unbind(b.stage, 'touchend');
			JY.bind(b.stage, 'touchend', function(e) {
				//console.log(e.changedTouches[0]);
				var touch = e.changedTouches[0];
				var pos = {
					x: touch.pageX - _this.T.width / 4,
					y: touch.pageY - _this.T.height / 2
				};
				_this.T.setPosition(pos.x, pos.y);
				_this.T.data = 3;
				JY.addClass(_this.T.DOM, 'zoomIn animated');
				return false;
			});
			JY.unbind(b.stage, 'touchmove');
			JY.bind(b.stage, 'touchmove', function(e) {
				var touch = e.changedTouches[0];
				var pos = {
					x: touch.pageX - _this.T.width / 4,
					y: touch.pageY - _this.T.height / 2
				};
				_this.T.setPosition(pos.x, pos.y);
				return false;
			});
		},
		getScore: function() {
			var _this = this;
			JY.resolve(function(v, i) {
				var toObj = _this.scoreTool;
				var fromObj = v;
				var speed = _this.v;
				var DvalueX = toObj.x + toObj.width / 2 - fromObj.x;
				var DvalueY = toObj.y + toObj.height / 2 - fromObj.y;
				var angle = Math.atan2(DvalueX, DvalueY); //角度
				fromObj.x += Math.floor(Math.sin(angle) * speed);
				fromObj.y += Math.floor(Math.cos(angle) * speed);
				var cat = fromObj.data;
				cat.width = cat.width * .95;
				cat.height = cat.height * .95;
				JY.width(fromObj.DOM, cat.width);
				JY.height(fromObj.DOM, cat.height);
				JY.width(cat.DOM, cat.width);
				JY.height(cat.DOM, cat.height);
				var o = (JY.css(cat.DOM, 'opacity') || 1) * .98;
				cat.setStyle({
					'opacity': o
				});
				fromObj.setPosition();
				if (JY.hits(fromObj, toObj)) {
					cat.remove();
					delete cat;
					fromObj.remove();
					delete fromObj;
					delete _this.hitsArr[i];
				}
			}, 0, this.hitsArr.length, this.hitsArr);
		},
		kill: function() {
			if (this.T.data) {
				this.T.data--;
				if (this.T.data == 0) {
					JY.removeClass(this.T.DOM, 'zoomIn').removeClass(this.T.DOM, 'animated');
				}
				var _this = this;
				JY.resolve(function(v, i) {
					var c = v.data;
					if (c) {
						var cat = c.data;
						if (cat) {
							if (JY.hits(c, {
									x: _this.T.x,
									y: _this.T.y,
									width: _this.T.width / 2,
									height: _this.T.height
								})) {
								_this.hitsArr.push(c);
								_this.score += cat.score;
								_this.killArr[cat.type] ++;
								v.data = null;
								delete _this.pullArr[i];
							}
						}
					}
				}, 0, this.pullArr.length, this.pullArr);
			}
		},
		checkScore: function() {
			JY.text(this.scoreTool.DOM, '得分:' + this.score);
		},
		createT: function() {
			//创建锤子
			if (!this.T) {
				this.T = new Sprite(this.holeW, this.holeW / 2);
				JY.addClass(this.T.DOM, 'T');
				this.T.setPosition(b.stage.width / 3, b.stage.height / 3);
				b.addChild(this.T);
			}
		},
		drawMap: function() {
			var w = b.stage.width / 3;
			var h = b.stage.height / 4;
			this.holeW = w;
			this.holeH = h;
			this.pullArr = [];
			for (var i = 0, l = 12; i < l; i++) {
				var obj = {};
				obj.x = (i % 3) * w;
				var rows = Math.floor(i / 3);
				obj.y = rows * h + 20;
				var sprite = new Sprite(w * .8, w * .8);
				sprite.setPosition(obj.x, obj.y)
				JY.addClass(sprite.DOM, 'hole');
				b.addChild(sprite);
				this.pullArr.push(sprite);
			}
			//console.log(pullArr)
		},
		drawToolbar: function() {
			var tool = new Sprite(b.stage.width, 20);
			this.scoreTool = new Sprite(100, 20);
			JY.text(this.scoreTool.DOM, '得分:0');
			this.lifeTool = new Sprite(b.stage.width - 110, 20);
			this.lifeTool.setPosition(110, 0);
			tool.addChild(this.lifeTool);
			tool.addChild(this.scoreTool);
			b.addChild(tool);
		},
		creaetMole: function() {
			var chance = Math.floor(Math.random() * 100);
			if (chance < this.level + 10) {
				var h = this.holeW / 2 * 1.333;
				var size = this.pullArr.length;
				var i = Math.floor(Math.random() * size);
				var hole = this.pullArr[i];
				if (hole && !hole.data) {
					var c = new Sprite(this.holeW / 2, 0);
					var w = new Sprite(this.holeW / 2, h);
					var x = Math.random() * (JY.width(b.stage) - w.width);
					c.time = 0;
					c.wait = this.wait;
					c.for = 0;
					hole.data = c;
					c.setPosition(hole.x + (this.holeW - hole.width) / 2, hole.y + hole.height / 2);
					//w.setPosition(x,-30);
					var t = Math.ceil(Math.random() * 4);
					w.score = this.scoreType[Math.ceil(Math.random() * 4) - 1];
					w.type = t - 1;
					JY.addClass(w.DOM, 'c-' + t);
					c.data = w;
					c.addChild(w);
					b.addChild(c);
					//this.holeArr.push(c);
				}
			}
		},
		animateMole: function() {
			var _this = this;
			JY.resolve(function(v, i) {
				if (v.data) {
					var c = v.data;
					var cat = c.data;
					var time = c.time;
					var step = cat.height / 15;
					if (c.time < 10 && c.for == 0) {
						var h = step * c.time;
						JY.height(c.DOM, h);
						c.height = h;
						c.setPosition(c.x, c.y - step * .7);
						c.time++;
					}
					if (c.time == 10 && c.wait) {
						c.wait--;
						JY.addClass(c.DOM, 'hehe');
					}
					if (!c.wait && (c.time == 10 || c.for == 1)) {
						c.for = 1;
						var h = step * c.time;
						JY.height(c.DOM, h);
						c.height = h;
						c.setPosition(c.x, c.y + step * .7);
						c.time--;
					}
					if (c.time <= 0) {
						if (cat.score > 0) {
							_this.life -= 1;
						}
						cat.remove();
						c.remove();
						c = null;
						cat = null;
						v.data = null;
					}
				}
			}, 0, this.pullArr.length, this.pullArr);
		},
		checkLife: function() {
			if (this.life <= 0) {
				b.gameOverScreen = JY.convertDOM('<div style="padding:50% 0px;width:300px;margin:0 auto; position:relative;" class="gameover"><div style="position:absolute;background:url(images/Whac-A-Mole/cat.png) no-repeat center center ;background-size:200px;opacity:0.2;position:absolute;top:20%;left:0;width:100%;height:300px;"></div><h1>游戏结束鸟!</h1><p>您在本次游戏中共打了' + this.score + '分</p><p><i class="c-1"></i> x ' + this.killArr[0] + '<i class="c-2"></i> x ' + this.killArr[1] + '<i class="c-3"></i> x ' + this.killArr[2] + '<i class="c-4"></i> x ' + this.killArr[3] + '</p><p>猛击之后重新来过！</p></div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
			}
		},
	});
	MoleGame.prototype = new JYG(JY.byId("gameboard"));
	JY.extend(MoleGame.prototype, {
		init: function() {
			this.game = g;
			this.frequency = 50;
			this.waitTime = 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen = JY.convertDOM('<div style="color:#555;padding:50% 0px;width:300px;margin:0 auto;position:relative;"><h1>打卡乐猫</h1><div style="position:absolute;background:url(images/Whac-A-Mole/cat.png) no-repeat center center ;background-size:200px;opacity:0.2;position:absolute;top:20%;left:0;width:100%;height:300px;"></div></div>');
			this.InstructionsScreen = JY.convertDOM('<div style="padding:50% 0px;width:300px;margin:0 auto; position:relative;"><div style="position:absolute;background:url(images/Whac-A-Mole/cat.png) no-repeat center center ;background-size:200px;opacity:0.2;position:absolute;top:20%;left:0;width:100%;height:300px;"></div><h1>打卡乐猫</h1><p>点击开始游戏</p><a>作者：田想兵</a>55342775@qq.com</div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#555;width:100px;float:right;" id="scoreScreen"></div>');
		}
	});
	var b = new MoleGame;
	b.init();
})(JY);