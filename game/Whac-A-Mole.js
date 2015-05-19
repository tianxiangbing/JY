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
			console.log('new');
			this.level = 1;
			this.life = 3;
			this.holeArr = [];
			this.drawToolbar();
			this.drawMap();
		},
		runGame: function() {
			this.creaetMole();
			this.checkLife();
			this.animateMole();
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
			JY.toText(this.scoreTool.DOM, '得分:0');
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
				if (!hole.data) {
					var c = new Sprite(this.holeW / 2, 0);
					var w = new Sprite(this.holeW / 2, h);
					var x = Math.random() * (JY.width(b.stage) - w.width);
					c.time = 0;
					c.for = 0;
					hole.data = c;
					c.setPosition(hole.x + (this.holeW - hole.width) / 2, hole.y + hole.height / 2);
					//w.setPosition(x,-30);
					JY.addClass(w.DOM, 'c-' + Math.ceil(Math.random() * 4));
					c.data = w;
					c.addChild(w);
					b.addChild(c);
					this.holeArr.push(c);
				}
			}
		},
		animateMole: function() {
			JY.resolve(function(v, i) {
				if (v.data) {
					var c = v.data;
					var cat = c.data;
					var time = c.time;
					var step = cat.height / 10;
					if (c.time < 10 && c.for == 0) {
						var h = step * c.time;
						JY.height(c.DOM, h);
						c.setPosition(c.x, c.y - step);
						c.time++;
					}
					if (c.time == 10 || c.for == 1) {
						c.for = 1;
						var h = step * c.time;
						JY.height(c.DOM, h);
						c.setPosition(c.x, c.y + step);
						c.time--;
					}
					if (c.time <= 0) {
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
				b.gameOverScreen = JY.convertDOM('<div style="color:#555;padding:200px 100px;width:500px;margin:0 auto;"><h2>敲打卡乐猫的最后得分是：<strong>' + this.score + '</strong>分</h2><p>点击重新开始游戏</p><div>');
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