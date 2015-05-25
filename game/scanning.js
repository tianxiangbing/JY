/*
 *扫雷
 *author: 田想兵
 *date:2015/5/21
 *email:55342775@qq.com
 *web:http://www.lovewebgames.com
 */
;
(function(JY) {
	var MoleGame = function() {};
	var game = function() {};
	game.prototype = new Game;
	g = new game();
	JY.extend(game.prototype, {
		newGame: function() {
			this.now = +new Date();
			this.blockList = [];
			this.life = 3;
			this.level = 1;
			this.timer = 0;
			this.x = 10;
			this.y = 15;
			this.open = -1;
			this.scoreTool;
			this.drawToolbar();
			this.drawMap();
			this.scaning();
			JY.addClass(b.stage, 'start');
			this.bindEvent();
		},
		bindEvent: function() {
			var _this = this;
			JY.off(b.stage, 'touchstart', 'i.block');
			JY.on(b.stage, 'touchstart', 'i.block', function(e){
				_this.select.call(this,e,_this)
			});
			JY.off(b.stage, 'mousedown', 'i.block');
			JY.on(b.stage, 'mousedown', 'i.block', function(e){
				_this.select.call(this,e,_this)
			});
		},
		select: function(e,_this) {
			var o = this.data;
			var row = this.position.x;
			var cell = this.position.y;
			if (o.type == "boom") {
				JY.addClass(o.DOM, 'boom');
				setTimeout(function() {
					_this.life--;
				}, 200);
			} else {
				delete _this.blockList[row][cell];
				if (o.type == 0) {
					o.remove();
					_this.fuckOther(row, cell);
				} else {
					JY.text(o.DOM, o.type);
					JY.addClass(o.DOM, 'open');
				}
			}
			_this.checkLevel();
		},
		fuckOther: function(i, j) {
			var _this = this;
			var row = this.blockList[i];
			var o = row[j];
			var l = this.blockList.length;
			var len = row.length;
			//这里看它的周边
			//如果不是最左边的
			if (j !== 0) {
				//有左
				var left = row[j - 1];
				if (left && left.type == 0) {
					left.remove();
					delete _this.blockList[i][j - 1];
					_this.fuckOther(i, j - 1);
				};
			}
			if (j !== len - 1) {
				//有右边
				var right = row[j + 1];
				if (right && right.type == 0) {
					right.remove();
					delete _this.blockList[i][j + 1];
					_this.fuckOther(i, j + 1);
				};
			}
			if (i !== 0) {
				//有上
				var top = this.blockList[i - 1][j];
				if (top && top.type == 0) {
					top.remove();
					delete _this.blockList[i - 1][j];
					_this.fuckOther(i - 1, j);
				};
			}
			if (i !== l - 1) {
				//有下
				var bottom = this.blockList[i + 1][j];
				if (bottom && bottom.type == 0) {
					bottom.remove();
					delete _this.blockList[i + 1][j];
					_this.fuckOther(i + 1, j);
				};
			}
		},
		scaning: function() {
			for (var i = 0, l = this.blockList.length; i < l; i++) {
				var row = this.blockList[i];
				for (var j = 0, len = row.length; j < len; j++) {
					var item = row[j];
					//这里看它的周边
					//如果它本身是个雷，就算了吧
					if (item.type == "boom") {
						continue;
					}
					var count = 0; //到底有多少雷在身边？
					//如果不是最左边的
					if (j !== 0) {
						//有左
						var left = row[j - 1];
						if (left.type == "boom") count++;
						if (i !== 0) {
							//有左上
							var leftTop = this.blockList[i - 1][j - 1];
							if (leftTop.type == "boom") count++;
						}
						if (i !== l - 1) {
							//有左下
							var leftBottom = this.blockList[i + 1][j - 1];
							if (leftBottom.type == "boom") count++;
						}
					}
					if (j !== len - 1) {
						//有右边
						var right = row[j + 1];
						if (right.type == "boom") count++;
						if (i !== 0) {
							//有右上
							var rightTop = this.blockList[i - 1][j + 1];
							if (rightTop.type == "boom") count++;
						}
						if (i !== l - 1) {
							//有右下
							var rightBottom = this.blockList[i + 1][j + 1];
							if (rightBottom.type == "boom") count++;
						}
					}
					if (i !== 0) {
						//有上
						var top = this.blockList[i - 1][j];
						if (top.type == "boom") count++;
					}
					if (i !== l - 1) {
						//有下
						var bottom = this.blockList[i + 1][j];
						if (bottom.type == "boom") count++;
					}
					item.type = count;
				}
			}
		},
		coutTimer: function() {
			var t = +new Date();
			var n = t - this.now;
			this.timer = n / 1000;
			JY.text(this.scoreTool.DOM, '时间：' + this.timer + ' s');
		},
		drawToolbar: function() {
			this.scoreTool = new Sprite(140, 30);
			this.scoreTool.setPosition(b.stage.width / 2 - 70, b.stage.height - 30);
			JY.text(this.scoreTool.DOM, '时间:0');
			b.addChild(this.scoreTool);
		},
		drawMap: function() {
			this.blockList = [];
			var w = Math.floor(b.stage.width / this.x);
			var h = w;
			var _this = this;
			for (var k = 0; k < this.y; k++) {
				var arr = [];
				for (var i = 0; i < this.x; i++) {
					var block = new Sprite(w, h);
					JY.addClass(block.DOM, 'block');
					block.setPosition(i * w, k * h);
					var rnd = Math.random() * 1000;
					block.type = 0;
					block.DOM.data = block;
					block.DOM.position = {
						x: k,
						y: i
					};
					if (rnd < this.level * 150) {
						block.type = "boom";
						//JY.addClass(block.DOM,'boom');
					}
					b.addChild(block);
					arr.push(block);
				}
				this.blockList.push(arr);
			}
		},
		runGame: function() {
			this.coutTimer();
			this.checkLife();
		},
		checkLevel: function() {
			var isover = true;
			JY.each(this.blockList, function(v, i) {
				JY.each(v, function(u, k) {
					if (u && u.type !== "boom") {
						isover = false;
					}
				});
			});
			if (isover) {
				this.level++; //升级;
				b.clearState(); //清空界面，定时器
				var _this = this;
				_this.levelup();
			}
		},
		levelup: function() {
			this.drawToolbar();
			this.drawMap();
			this.scaning();
			b.startTimer();
		},
		checkLife: function() {
			if (this.life <= 0) {
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
				var top = b.stage.height / 3;
				var left = 50;
				b.gameOverScreen = JY.convertDOM('<div style="color:#555;width:300px;margin:0 auto;position:absolute;top:' + top + 'px;left:' + left + 'px;"><h1>游戏结束!</h1><p>在本次游戏中您共通关' + (this.level - 1) + '关,总耗时' + this.timer + '秒,截图炫耀吧!</p><p>点击重新开始游戏</p></div>');
			}
			JY.html(b.scoreScreen, "生命值:" + this.life);
		}
	});
	MoleGame.prototype = new JYG(JY.byId("gameboard"));
	JY.extend(MoleGame.prototype, {
		init: function() {
			this.game = g;
			this.frequency = 30;
			this.waitTime = 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			if (b.stage.width > 768) {
				b.stage.width = 768;
				JY.width(b.stage, 768);
			}
			/**创建欢迎界面**/
			var top = this.stage.height / 3;
			var left = 50;
			this.titleScreen = JY.convertDOM('<div style="color:#555;width:300px;margin:0 auto;position:absolute;top:' + top + 'px;left:' + left + 'px;"><h1>扫雷</h1></div>');
			this.InstructionsScreen = JY.convertDOM('<div style="color:#555;width:300px;margin:0 auto;position:absolute;top:' + top + 'px;left:' + left + 'px;"><h1>扫雷</h1><p>点击开始游戏</p>作者：田想兵55342775@qq.com</div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#555;width:100px;position:absolute;bottom:10px;right:0;" id="scoreScreen"></div>');
			var height = b.stage.width * 1.5;
			JY.height(b.stage, height);
		}
	});
	var b = new MoleGame;
	b.init();
})(JY);