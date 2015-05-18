/*!
 * 太空冒险60秒，版本号：1.0
 * http://www.lovewebgames.com/game/crazySpaceship.html
 * Copyright 2012, 田想兵 
 * Email : yoooyeeey@163.com
 * QQ:55342775
 * Includes JY.js
 * http://www.lovewebgames.com/
 *
 * Date: 2012/9/3
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
			this.timer = +new Date();
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
			this.user = this.createUser();
			this.userSpeed = 30;
			this.goldSort = [5,10,50,100,-1];		
		},
		createUser:function(){
		    var w = new Sprite(15,15);
			w.direction = 0;//X轴方向
			var x = (JY.width(b.stage)-w.width)/2;
			var y =  JY.height(b.stage)- w.height;
			w.setPosition(x,y);
			w.DOM.innerHTML = w.data;	
			JY.addClass(w.DOM,"user");
			b.addChild(w.DOM);
			var _self = this;
			JY.bind(b.stage,"mousemove",function(e){
				_self.moveUser(e);
			});
			JY.css(b.stage,{"cursor":"none"});
			return w;
		},
		moveUser:function(e){	  
			var x  = e.clientX - JY.offset(b.stage).x +  document.documentElement.scrollLeft;
			var y  = e.clientY - JY.offset(b.stage).y + document.documentElement.scrollTop;
			this.user.setPosition(x,y);
		},
		runGame:function(){		
			this.creaetWord();
			this.moveWord();
			this.checkLife();
			this.checkLevel();
		},
		checkLevel:function(){
			this.score = Math.floor(( +new Date() - this.timer)/1000);
			b.scoreScreen.innerHTML = "时间："+this.score +"s";
			if (this.score/this.level>=5){
				this.level++;
				this.speed*=1.1;
			}
		},
		checkLife:function(){
			if (this.life<=0){
				b.gameOverScreen=JY.convertDOM('<div style="color:yellow;padding:200px 100px;width:500px;margin:0 auto;"><h2 style="color:yellow;">作为一个男人，你最后只坚持了<strong>'+this.score+'</strong>秒</h2><p>点击重新开始游戏</p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
				JY.css(b.stage,{"cursor":"default"});
			}
		},
		moveWord:function(){
			var _self= this;
			JY.resolve(function(v,i){
				v.x += Math.sin(v.data.angle)*_self.speed;	
				v.y += Math.cos(v.data.angle)*_self.speed;		
				v.setPosition(v.x,v.y);
				if (JY.hits(v,_self.user)){
					_self.life --;
				}
				if (v.y>b.stage.height || v.y<0|| v.x<0|| v.x>b.stage.width){
					b.removeChild( v.DOM);
					delete v;
					delete _self.goldArr[i]
				};
			},0,this.goldArr.length,this.goldArr);
		},
		creaetWord:function(){
			var chance = Math.floor(Math.random()*100);
			if(chance<this.level*10)
				{
				var w = new Sprite(5,5);
				w.direction = 0;//X轴方向
				var x = Math.random()*(b.stage.width-w.width);
				var yrnd = Math.floor(Math.random()*3);
				var y =w.height;
				switch(yrnd){
					case 1:{
						y = b.stage.height-w.height;
					}break;
					case 2:{
						y=Math.random()*(b.stage.height-w.height);
						x=w.width;
					}break;
					case 3:{
						y=Math.random()*(b.stage.height-w.height);
						x=b.stage.width - w.width;
					}break;
				}
				w.setPosition(x,y);			
				w.data ={x:this.user.x,y:this.user.y};	
				//敌人和英雄间的角度
				var DvalueX = w.data.x - w.x;
				var DvalueY = w.data.y- w.y ;
				//var len = parseInt( Math.sqrt (DvalueX*DvalueX + DvalueY*DvalueY)) /w.width;//两点间距离
				var angle=Math.atan2(DvalueX,DvalueY);//角度
				w.data.angle = angle;
				w.DOM.innerHTML = w.data;	
				JY.addClass(w.DOM,"enemy");
				b.addChild(w.DOM);
				this.goldArr.push(w);
			}			
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			this.game = g;
			this.frequency=30;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:yellow;padding:200px;width:300px;margin:0 auto;"><h1 style="color:yellow;">太空惊险60秒</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="color:#efefef;padding:200px;width:300px;margin:0 auto;"><h1 style="color:yellow;">太空惊险60秒</h1><p>点击开始游戏</p><p>鼠标移动角色躲避敌人</p><a>作者：田想兵</a>55342775@qq.com</div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#efefef;width:100px;float:right;" id="scoreScreen"></div>');
			//g.newGame();
		}
	});
	var  b=new WordGame;
	b.init();