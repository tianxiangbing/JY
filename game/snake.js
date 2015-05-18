/*
*吞食蛇
*author: 田想兵 
*date:2013/5/29
*email:55342775@qq.com
*web:http://www.lovewebgames.com
*/
	var Snake = function(){};
	Snake.prototype = new Sprite;
	JY.extend(Snake.prototype,{
		create:function(){
			this.init(5,5,{"backgroundColor":"#FFFFFF"});
		}
	});
	var WordGame =function(){
	};
	var game =function(){
	};
	game.prototype = new Game;
	g=new game();
	JY.extend(game.prototype,{
		newGame:function(){
			this.snakeArr =[];
			this.life = 1;
			this.speed = 5;
			this.vx = 0 ;
			this.vy =0;
			this.score= 0;
			this.monster = null;
			this.tmpArr = [];
			this.createSnake();
			JY.soundManage.play("bg",true);
		},
		runGame:function(){	
			this.createMonster();
			this.run();
			this.testHits();
			this.checkLife();
		},
		testHits:function(){
			var _this = this;
			JY.resolve(function(v,i){
				if (i >1){
					if (JY.hits(v,_this.snakeArr[0])){
						_this.life -- ;
					}
				}
			},0,_this.snakeArr.length,_this.snakeArr);
		},
		checkLife:function(){
			if (this.life<=0){
				this.speed = 0 ;	
				var _this =this;
				setTimeout(function(){
					b.gameOverScreen=JY.convertDOM('<div style="color:#FFFFFF;padding:0px 0px;width:400px;margin:0 auto;"><h2 style="color:#FFFFFF;">恭喜你，你挂了。你的最后得分：<strong>'+_this.score+'</strong>分</h2><p>刷新页面重新开始游戏</p><div>');
					b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
				},3000);
			}
		},
		createSnake:function(){
			this.speed = 5 ;
			var u= new Snake();
			u.create();
			u.setPosition(Math.floor( (JY.width(b.stage)-u.width)/2),Math.floor( (JY.height(b.stage)-u.height)/2));
			b.addChild(u);
			this.snakeArr.push(u);
			var v= new Snake();
			v.create();
			v.setPosition(Math.floor( (JY.width(b.stage)-v.width)/2)- v.width,Math.floor( (JY.height(b.stage)-v.height)/2));
			b.addChild(v);
			this.snakeArr.push(v);
		},
		createMonster:function(){
			if (!this.monster){
				this.monster = new Sprite();
				this.monster.init(5,5,{"backgroundColor":"#FFFFFF"});
				var x = Math.floor( Math.random()*JY.width(b.stage) );
				var y = Math.floor( Math.random()*JY.height(b.stage) );
				this.monster.setPosition(x,y);
				b.addChild(this.monster);
			}
		},
		run:function(){
			if (this.speed==0){
				return;
			}
			if (!this.vx && !this.vy){
				this.vx = this.speed;
			}
			var _this = this;
			var v = _this.snakeArr[0];
			_this.tmpArr.length =0 ;
			_this.tmpArr.push({ox:v.x,oy:v.y});
			v.setPosition(_this.vx+v.x,_this.vy+v.y);
			JY.each(_this.snakeArr,function(v,i){
				if (i!==0){
					_this.tmpArr.push({ox:v.x,oy:v.y});
					var old = _this.tmpArr[i-1];
					v.setPosition(old.ox,old.oy);
				}
			});
			if (JY.hits(v,_this.monster,-1)){
				var u= new Snake();
				u.create();
				var tx = _this.snakeArr[ _this.snakeArr.length -1].x;
				var ty =  _this.snakeArr[ _this.snakeArr.length -1].y;
				u.setPosition(tx,ty);
				b.addChild(u);
				_this.snakeArr.push(u);
				b.removeChild(_this.monster);
				delete _this.monster;
				_this.score ++;
				b.scoreScreen .innerHTML = _this.score;
				JY.soundManage.play("shit",false);
			}
			if (v.x>=JY.width(b.stage)){
				v.x  = JY.width(v.DOM);
			}
			if (v.x<= -JY.width(v.DOM) ){
				v.x = JY.width(b.stage)-JY.width(v.DOM);
			}
			if (v.y>=JY.height(b.stage) +JY.height(v.DOM)){
				v.y  = JY.height(v.DOM);
			}
			if (v.y<= -JY.height(v.DOM) ){
				v.y = JY.height(b.stage)-JY.height(v.DOM);
			}
		},
		bindEvent:function(code){
			var _this = this;
			var v = _this.snakeArr[0];
			var u = _this.snakeArr[1];
			switch(code){
				case 38:
					//向上
				case 87:{
					//上W
					if (!u||v.x!==u.x){
						_this.vx=0;
						_this.vy = -1* _this.speed;
					}
				}break;
				case 40:
					//下  
				case 83:{
					//下S
					if (!u||v.x!==u.x){
						_this.vx=0;
						_this.vy = 1* _this.speed;
					}
				}break;
				case 37:
					//左	  
				case 65:{
					//左A
					if (!u||v.y!==u.y){
						_this.vy=0;
						_this.vx = -1* _this.speed;
					}
				}break;
				case 39:
					//向右
				case 68:{
					//右D
					if (!u||v.y!==u.y){
						_this.vy=0;
						_this.vx = 1* _this.speed;
					}
				}break;
			}
			return true;
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			var _this = this;
			JY.bind("tabSpeed","click",function(e){
				_this.clearState();
				_this.frequency =50;
				_this.game = g;
				_this.waitTime= 5;
				_this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
				_this.startTimer();
			});
			this.frequency =80;
			this.game = g;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:red;font-weight:bold;text-align:center;padding-top:50px;width:100%;margin:0 auto;"><h1 style="color:red;font-weight:bold;">吞食蛇永恒激情版-JY游戏</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="margin:0 auto;height:100%;width:100%;position:relative;"><span style="display:block;cursor:pointer;width:275px;height:110px;line-height:100px;font-family: Tahoma,宋体;text-align:center;font-size:28px;font-weight:bolder;color:#FFFFFF;top:50px;left:20px;position:absolute;">Play</span><p style="position:absolute;top:150px;left:80px;"><a href="http://www.lovewebgames.com" target="_blank" style="color:#fff797;">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#FFF;width:200px;float:right;font-weight:bold;position:absolute;z-index:2;right:0;" id="scoreScreen"></div>');
			
			JY.delegate(JY.byId('gameboard'),"a","mousedown",function(e){
				location.href = JY.attr(e.target,"href");
			});
			JY.soundManage.init("/scripts/swfobject.min.js","/scripts/flash/playSound.swf","playSound",function(){
				JY.soundManage.loadSound("sound/zuma/bg.mp3","bg");
				JY.soundManage.loadSound("sound/zuma/shit.mp3","shit");
			});
			JY.bind(document,"keydown",function(e){
				g.bindEvent(e.keyCode);
			});
		}
	});
	var  b=new WordGame;
	b.init();
	
if (location.host !=="www.lovewebgames.com"&&location.hostname !=="localhost" && location.host !="jsjy.cloudfoundry.com"){
	location.href="http://www.lovewebgames.com";
}