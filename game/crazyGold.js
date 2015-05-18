/*!
 * 疯狂接金币，版本号：1.0
 * http://www.lovewebgames.com/game/crazySpaceship.html
 * Copyright 2012, 田想兵 
 * Email : yoooyeeey@163.com
 * QQ:55342775
 * Includes JY.js
 * http://www.lovewebgames.com/
 *
 * Date: 2012/9/2
 */
	var WordGame =function(){
	};
	var game =function(){
		this.goldArr = [];
		this.level = 1;
		this.speed = 10;
		this.score =0;
		this.life =1;
	};
	game.prototype = new Game;
	g=new game();
	JY.extend(game.prototype,{
		newGame:function(){
			this.goldArr = [];
			this.level = 1;
			this.speed = 10;
			this.score =0;
			this.life =1;
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
			this.user = this.createUser();
			this.userSpeed = 30;
			this.goldSort = [5,10,50,100,-1];
		},
		createUser:function(){
		    var w = new Sprite(155,125);
			w.direction = 0;//X轴方向
			var x = (JY.width(b.stage)-w.width)/2;
			var y =  JY.height(b.stage)- w.height;
			w.setPosition(x,y);
			w.DOM.innerHTML = "";	
			JY.addClass(w.DOM,"user");
			b.addChild(w.DOM);
			return w;
		},
		moveUser:function(code){
			switch(code){
				case 39:{
					//向右
					this.user.x +=this.userSpeed;		
					this.user.x=Math.min(this.user.x,JY.width(b.stage)-this.user.width);
					this.user.setPosition(this.user.x,this.user.y);
				}break;
				case 37:{
					//左	  
					this.user.x -=this.userSpeed;		   
					this.user.x=Math.max(this.user.x,0);
					this.user.setPosition(this.user.x,this.user.y);
				}break;
			}
		},
		runGame:function(){		
			this.creaetWord();
			this.moveWord();
			this.killWord();
			this.checkLife();
			this.checkLevel();
		},
		checkLevel:function(){
			b.scoreScreen.innerHTML = "得分："+ this.score;
			if (this.score/this.level>100*this.level){
				this.level++;
				this.speed*=1.1;
			}
		},
		checkLife:function(){
			if (this.life<=0){
				b.gameOverScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;width:500px;margin:0 auto;"><h2>疯狂的接金币最后得分是：<strong>'+this.score+'</strong>分</h2><p>点击重新开始游戏</p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
			}
		},
		moveWord:function(){
			var _self= this;
			JY.resolve(function(v,i){
				v.y += _self.speed;				
				v.setPosition(v.x,v.y);
				if (v.y>JY.height(b.stage)){
					b.removeChild( v.DOM);
					delete v;
				}
			},0,this.goldArr.length,this.goldArr);
		},
		creaetWord:function(){
			var chance = Math.floor(Math.random()*100);
			if(chance<this.level +10){
				var w = new Sprite(30,30);
				w.direction = 0;//X轴方向
				var x = Math.random()*(JY.width(b.stage)-w.width);
				w.setPosition(x,-30);
				w.data = this.goldSort [Math.floor(Math.random()*5)];
				w.DOM.innerHTML = w.data;	
				w.data ===-1 ? JY.addClass(w.DOM,"zd"):JY.addClass(w.DOM,"gold");
				b.addChild(w.DOM);
				this.goldArr.push(w);
			}			
		},
		killWord:function(){
			var _self = this;
			JY.each(this.goldArr,function(v,i){
				if (_self.user.x<=v.x && _self.user.x+_self.user.width>=v.x && v.y>= _self.user.y && v.y<=_self.user.y+v.height){
					if (v.data==-1){
						_self.life--;
						return;
					}
					_self.score += v.data;
					b.removeChild(this.DOM);
					delete _self.goldArr[i]; 
					return ;
				}
			});
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			this.game = g;
			this.frequency=50;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:#555;padding:200px;width:300px;margin:0 auto;"><h1>疯狂的接金币</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="color:#555;padding:200px;width:300px;margin:0 auto;"><h1>疯狂的接金币</h1><p>点击开始游戏</p><p>方向键左右移动角色接金获取得分</p><a>作者：田想兵</a>55342775@qq.com</div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#555;width:100px;float:right;" id="scoreScreen"></div>');
			JY.bind(document,"keydown",function(e){
				g.moveUser(e.keyCode);
			});
			JY.delegate(this.stage,"i",'click',function(e){
				g.killWord(e.target);
			}).delegate(this.stage,"i",'mouseover',function(e){
				g.killWord(e.target);
			});
			//g.newGame();
		}
	});
	var  b=new WordGame;
	b.init();