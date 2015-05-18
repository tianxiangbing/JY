/*!
 * 疯狂打字母，版本号：1.0
 * http://www.lovewebgames.com/game/crazySpaceship.html
 * Copyright 2012, 田想兵 
 * Email : yoooyeeey@163.com
 * QQ:55342775
 * Includes JY.js
 * http://www.lovewebgames.com/
 *
 * Date: 2012/9/1
 */
	var WordGame =function(){
	};
	var game =function(){
		this.wordArr = [];
		this.killedArr =[];
		this.level = 1;
		this.speed = 10;
		this.score =0;
		this.life =1;
	};
	game.prototype = new Game;
	g=new game();
	JY.extend(game.prototype,{
		newGame:function(){
			this.wordArr = [];
			this.level = 1;
			this.speed = 8;
			this.score =0;
			this.life =1;
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
		},
		runGame:function(){		
			this.creaetWord();
			this.moveWord();
			this.checkLife();
			this.checkLevel();
		},
		checkLevel:function(){
			b.scoreScreen.innerHTML = "得分："+ this.score;
			if (this.score/this.level>5){
				this.level++;
				this.speed*=1.1;
			}
		},
		checkLife:function(){
			if (this.life<=0){
				b.gameOverScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;width:500px;margin:0 auto;"><h1>您的最后得分是：<strong>'+this.score+'</strong>分</h1><p>点击重新开始游戏</p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
			}
		},
		moveWord:function(){
			var _self= this;
			JY.resolve(function(v,i){
				this.y += _self.speed;
				var rnd =Math.random();
				if (_self.level >2){
					if (rnd <.01){
						this.direction ? this.direction *=-1:this.direction = _self.speed/2;
						//摆动
					}
				}
				if (this.x<=0){
					this.direction =_self.speed;//向右
				}
				if (this.x>=JY.width(b.stage)-this.width){
					this.direction = -1*_self.speed;//向左
				}
				this.x += this.direction;
				this.setPosition(this.x,this.y);
				if (this.y>JY.height(b.stage)){
					b.removeChild( _self.wordArr[i].DOM);
					_self.life --;
					delete _self.wordArr[i];
				}
			},0,this.wordArr.length,this.wordArr);
			JY.resolve(function(v,i){
				this.y -= _self.speed*2;
				if (this.x < JY.width(b.stage)/2){
					this.x-=_self.speed*2;
				}else{
					this.x+=_self.speed*2;
				}
				this.setPosition(this.x,this.y);
				if (this.y<0||this.x<0||this.x>JY.width(b.stage)){
					b.removeChild( _self.killedArr[i].DOM);
					delete _self.killedArr[i];
				}
			},0,_self.killedArr.length,_self.killedArr);
		},
		creaetWord:function(){
			var chance = Math.floor(Math.random()*100);
			if(chance<this.level +5){
				var w = new Sprite(30,30);
				w.direction = 0;//X轴方向
				var x = Math.random()*(JY.width(b.stage)-w.width);
				w.setPosition(x,-30);
				w.data = Math.floor(Math.random()*26)+65;
				w.DOM.innerHTML =  String.fromCharCode(w.data);	
				b.addChild(w.DOM);
				this.wordArr.push(w);
			}			
		},
		checkWord:function(code){
			var _self =this;
			JY.each(this.wordArr,function(v,i){
				if (code===v.data){
					//b.removeChild(this.DOM);
					_self.killedArr.push( _self.wordArr[i]);
					delete _self.wordArr[i];
					_self.score++;
					//b.stopTimer();
					return ;
				}
			});
		},
		killWord:function(target){
			var _self = this;
			JY.each(this.wordArr,function(v,i){
				if (target===v.DOM){
					_self.killedArr.push( _self.wordArr[i]);
					delete _self.wordArr[i];
					_self.score++;
					return ;
				}
			});
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			this.game = g;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:#555;padding:200px;width:200px;margin:0 auto;"><h1>疯狂的字母</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="color:#555;padding:200px;width:300px;margin:0 auto;"><h1>疯狂的字母</h1><p>点击开始游戏</p><p>根据屏幕出现的字母按键获取得分！</p><a>作者：田想兵</a>55342775@qq.com</div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#555;width:100px;float:right;" id="scoreScreen"></div>');
			JY.bind(document,"keydown",function(e){
				g.checkWord(e.keyCode);
			});
			JY.delegate(this.stage,"i",'click',function(e){
				g.killWord(e.target);
			}).delegate(this.stage,"i",'mouseover',function(e){
				g.killWord(e.target);
			});
			//g.newGame();
		}/*,
		setTitle:function(){
			*创建欢迎界面*
			this.titleScreen=JY.convertDOM('<div style="color:#555;padding:200px;width:200px;margin:0 auto;"><h1>疯狂的字母</h1><p>点击开始游戏</p><div>');
			this.addChild(this.titleScreen);
			this.waitTime= 10;
			this.checkState(JYGSTATE.STATE_SYSTEM_WAIT);
			this.nextState=JYGSTATE.STATE_SYSTEM_INSTRUCTIONS;
			g.newGame();
		}*/
	});
	var  b=new WordGame;
	b.init();