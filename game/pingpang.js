/*
*
*author: 田想兵 
*date:2014/2/24
*email:55342775@qq.com
*web:http://www.lovewebgames.com
*/
(function(win){
	var Hoop = function(){};
	Hoop.prototype = new Sprite;
	JY.extend(Hoop.prototype,{
		create:function(){
			this.init(5,5,{"backgroundColor":"#FFFFFF"});
		}
	});
	var Level = function(){};
	Level.prototype = new Sprite;
	JY.extend(Level.prototype,{
		create:function(html){
			this.init(50,50,{"backgroundColor":"#FFFFFF","borderRadius":"5px","fontStyle":"normal","fontSize":"16px","fontWeight":"bold","fontFamily":"微软雅黑",color:"#4d4d4d","lineHeight":"50px","textAlign":"center","cursor":"pointer"});
			this.DOM.innerHTML = html;
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
			this .currentLevel = 1;
			this.dragPos = {};//鼠标与圆环的差值
			this.life =1;
			this.user = null;
			this.scoreA = 0;
			this.scoreB = 0;
			this.cuser = null;//机器人
			this.cuserv = 2;//机器人速度
			this.speed = 5;
			this.gameBoard = null;
			this.canvas = JY.getCtx ("drawBall");
			this.x = JY.width(b.stage)/2;
			this.y = JY.height(b.stage);
			this.oldPos ={x:0,y:0};
			this.ball = null;
			this.ballv = {x:10,y:1};
			this.ballPos = {x:20,y :200};
			this.v = {x : 0 ,y :0 };
			this.path = { s:0, e:0 };
			this.ax = .05;
			this.errorMsg = ['小子，今儿是怎么了？出门儿吃错药了？还是忘吃药了？','小学生水平，小学今天放学这么早？','你的牙如同天上的繁星，色泽鲜艳，相距甚远。','你是不是三鹿喝多了？','看看你的排名，就知道你班有多少人。','你活着浪费空气，死了浪费土地，半死不活浪费RMB。'];
			this.okMsg = ['你这么屌，你家里人知道吗','你真是太棒了','再接再厉','你NB得让人无话可说'];
			this.init();
			this.bindEvent();
			JY.soundManage.play("bg",true);
		},
		init:function(){
			this.draw();//
			this.ballMove();
			this.gameBoard = new Sprite(b.stage.width,b.stage.height);
			b.addChild(this.gameBoard);
		},
		bindEvent:function(){
			var _self = this;
			JY.bind(this.gameBoard.DOM,"mousemove",function(e){
				var pos = {x:	event. offsetX,y:event.offsetY};
				pos.x = Math.min(pos.x, b.stage.width-_self .user.width);
				pos.x = Math.max(pos.x,_self .user.width/2+ _self.x);
				pos.y = Math.min(pos.y, b.stage.height-_self .user.height/2);
				pos.y = Math.max(pos.y,_self.user.height/2);
				_self.v = { x : _self.oldPos.x - pos.x , y :_self.oldPos.y - pos.y };
				_self.path = { s:{x:_self.oldPos.x ,y:_self.oldPos.y } , e:{x: pos.x ,y: pos.y} };
				if ( _self.v.x == 0 && _self.v.y ==0 ){
					return false;
				};
				_self.oldPos = {x :pos.x,y:pos.y};
				_self .user.setPosition( pos.x -_self.user.width/2 , pos.y - _self.user.height/2 );
				_self.testHits();
			});
		},
		draw:function(){
			//b.clearState();//清空界面，定时器
			this.user = new Sprite(10,50,{backgroundColor:"#ededed",border:"1px solid #CCC",zIndex:"-1"});
			this.user.setPosition(JY.width(b.stage) - 30, this.y/2 - this.user.height/2);
			b.addChild(this.user);	

			this.cuser = new Sprite(10,50,{backgroundColor:"#ededed",border:"1px solid #CCC",zIndex:"-1"});
			this.cuser.setPosition(30, this.y/2 - this.cuser.height/2);
			b.addChild(this.cuser);	

		},
		ballMove:function(){
			//中间线
			this.canvas.clearRect(0,0,JY.width(this.canvas.canvas),JY.height(this.canvas.canvas));	
			this.canvas.beginPath();
			this.canvas.lineWidth = 1;
			this.canvas .strokeStyle="#333";
			this.canvas. moveTo(this.x, 0);
			this.canvas.lineTo(this.x , this.y);
			this.canvas.stroke();
			//球
			this.ball = new Sprite5();
			var img = new Image();
			img.src= "images/pingpang/ball.png";
			this.ball.init(this.canvas,img,{x:0,y:0},{x:24,y:24});
			this.ballPos .x+=this.ballv.x;
			this.ballPos .y+=this.ballv.y; 
			this.ballv.x = Math.min(this.ballv.x,20 );
			this.ax = Math.abs(this.ballv.x*.003);
			if (this.ballv.x < 0 ){
				this.ballv.x += this.ax;
				this.ballv.x = Math.max(this.ballv.x,-20);
			}else{
				this.ballv.x = Math.min(this.ballv.x,20);
				this.ballv.x -= this.ax;
			};
			if ( this.ballPos.y >= this.y - this.ball.size.y || this.ballPos.y <=0 ){
				this.ballv.y *=-1;
			}
			/*
			if (this.ballPos. x <=0 ||  this.ballPos.x >JY.width(b.stage) - this.ball.size.x){
				this.ballv.x *=-1;
			}
			*/
			if (this.ballPos. x <=0){
				this.currentLevel++ ;
				this.levelup(true);
				this.scoreB++;
			}
			if ( this.ballPos.x >JY.width(b.stage)){
				this .currentLevel++ ;
				this.levelup();
				this.scoreA++;
			}
			this.writeLevel();
			this.ball.setPosition(this.ballPos.x,this.ballPos.y);

		},
		
		getEventPosition:function(event){	
			//var parent = JY.parent(this.user.DOM);
			var parent =b.stage;
			var po = JY.offset(parent);
			var x =0,y=0;
			x  = event.clientX -po.x +  document.documentElement.scrollLeft;
			y  = event.clientY -po.y + document.documentElement.scrollTop;
			return {x:x,y:y};
		},
		moveUser:function(event){
			var _self = this;
			if (!_self.moveEnabled ){
				return;
			}
			var pos = this .getEventPosition(event);
			var y = pos.y - this.dragPos.y;
			var x = pos.x -this.dragPos.x;
			if (Math.abs(x - this.user.x)>=1 || Math.abs(y - this.user.y)>=1){
				if (x <0){
					x = 0;
				}else
				if (x > JY.width(b.stage)- _self.user.width ){
					x = JY.width(b.stage)- _self.user.width;
				};
				if (y < 0){
					y = 0 ;
				}else
				if (y > JY.height(b.stage)- _self.user.height){
					y = JY.height(b.stage)- _self.user.height;
				};
				this.user.setPosition(x,y);
			}
		},
		runGame:function(){	
			this.checkLife();
			this.ballMove();
			this.testHits();
			this.predict();
			this.checkStage();
		},
		predict:function(){
			var targety = this.ball.y ;
			//2014/3/4
			if (this.ball.y >this.cuser.y ){
				if ( this.ball.y >this.cuser.y+ this.cuser.height/2){
					this.cuser.y += this.cuserv;
				}
			}else if(this.ball.y <this.cuser.y -this.cuser.height/2 ){
				this.cuser.y -= this.cuserv;
			}
			this.cuser.setPosition();
		},
		testHits:function(){
			if (JY.hits( this.user,{width:this.ball.size.x,height:this.ball.size.y,x:this.ball.x,y:this.ball.y}) && this.ballv.x > 0 ){
				this.ballv.x *= -1 ;
				this.ballv.x -= Math.abs(this.v.x);
				var tmp = this.path.s.y - this.path.e.y;
				this.ballv.y = -tmp;
				/*
				if (tmp > 0 ){
					if (this.ballv.y< 0){
						this.ballv.y += tmp;
					} else{
						this.ballv.y -= tmp;
					}
				};
				*/
				//this.levelup();
			}else if(this.path.s.x !==0 && this.path.s !==0){
				var Ax = this.ball.x - this.path.s.x;
				var Ay = this.ball.y - this.path.s.y;
				var Bx = this.ball.x- this.path.e.x;
				var By = this.ball.y- this.path.e.y; 
				//console.log(this.path.s.x,this.path.e.x,this.ball.x);
				//if (this.ball.x > this.user.x){
					//debugger;
				//}
				if (JY.hits({width:Math.abs( this.path.s.x - this.path.e.x) ,height:this.user.height,x:Math.min(this.path.s.x,this.path.e.x), y :this.path.s.y},{width: this.ball.size.x,height:this.ball.size.y,x:this.ball.x,y:this.ball.y},5) && this.ballv.x > 0 ){
					this.ballv.x *= -1 ;
					this.ballv.x -= this.v.x;
					//this.levelup();
				}
			};
			if ( this.ballv.x < 0 ){
				if ( JY.hits( this.cuser,{width:this.ball.size.x,height:this.ball.size.y,x:this.ball.x,y:this.ball.y}) ){
					this.ballv.x *= -1 ;
				}
			}
		},
		checkStage:function(){
			if (JY.height(b.stage)!==b.stage.height){
				JY.height(b.stage,b.stage.height);
			};
			if (JY.width(b.stage)!==b.stage.width){
				JY.width(b.stage,b.stage.width);
			};
		},
		shiAnimate:function(){			
			var _self= this;
			JY.resolve(function(v,i){
				v.y += _self.speed;				
				v.setPosition(v.x,v.y);
				if (v.y>JY.height(b.stage)){
					b.removeChild( v.DOM);
					delete v;
				}
			},0,this.shiArr.length,this.shiArr);
		},
		checkLife:function(){
			if (this.scoreA >=11 || this.scoreB>=11 ){
				b.gameOverScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;width:500px;margin:0 auto;"><h1>您的最后得分是：<strong>'+this.scoreA+' : '+this.scoreB+'</strong>分</h1><p>点击重新开始游戏</p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
			}
		},
		newLevel:function(bool){		
			/*写分数*/			
			this.isFire = false;
			this.x = JY.width(b.stage)/2;
			this.y = JY.height(b.stage);
			this.oldPos ={x:0,y:0};
			this.ballv = {x:10,y:1};
			this.ballPos = {x:0,y :200};
			
			var _self = this;
			if (bool ){
				//你这么屌，你家里人知道吗
				this.writeScore(this.okMsg[Math.floor( this.okMsg.length*Math.random())],{x:200,y:300},22);
			}else{
				//小学生水平，小学今天放学这么早？
				this.writeScore(this.errorMsg[Math.floor( this.errorMsg.length*Math.random())],{x:100,y:300},22);
			}
			setTimeout(function(){
				b.clearState();//清空界面，定时器
				b.startTimer();
				_self.init();
				_self.bindEvent();
			},1200);
		},
		writeLevel:function(){
			this.writeScore(this.scoreA,{x:100,y:b.stage.height/3});
			this.writeScore(this.scoreB,{x:b.stage.width-100,y:b.stage.height/3});
		},
		writeScore:function(text,pos,size){
			var scoreBoard = new CanvasText(pos,this.canvas);
			var size =size ||48;
			scoreBoard.family('Georgia')
						 .size(size+'px')
						 .weight('800')
						 .color('red')
						.append(text.toString());
			scoreBoard.render();
		},
		levelup:function(bool){
			if (this.isFire || this .currentLevel ==1){
				return;
			};			
			b.clearState();//清空界面，定时器
			this.cuserv +=2;
			//this.cuserv = Math.min(this.cuserv , 10);
			var max = JY.cookie("level")||1;
			max = Math.max( this.currentLevel ,max);
			JY.cookie("level" , max,30);
			this.isFire = true;
			this.newLevel(bool);
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			var _this = this;
			this.frequency =15;
			this.game = g;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:red;font-weight:bold;text-align:center;padding-top:50px;width:100%;margin:0 auto;"><h1 style="color:red;font-weight:bold;">乒乓球-JY游戏</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="margin:0 auto;height:100%;width:100%;position:relative;"><span style="display:block;cursor:pointer;width:100%;height:110px;line-height:100px;font-family: Tahoma,宋体;text-align:center;font-size:28px;font-weight:bolder;color:#FFFFFF;top:100px;position:absolute;">Play</span><p style="position:absolute;top:350px;text-align:center;width:100%;color:#0091e0;"><a href="http://www.lovewebgames.com" target="_blank" style="color:#0091e0;">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#FFF;width:200px;float:right;font-weight:bold;position:absolute;z-index:2;right:0;" id="scoreScreen"></div>');
			
			JY.delegate(JY.byId('gameboard'),"a","mousedown",function(e){
				location.href = JY.attr(e.target,"href");
			});
			JY.soundManage.init("/scripts/swfobject.min.js","/scripts/flash/playSound.swf","playSound",function(){
				JY.soundManage.loadSound("sound/zuma/bg.mp3","bg");
			});
			JY.bind(document,"keydown",function(e){
				g.bindEvent(e.keyCode);
			});
			var loading = JY.convertDOM('<p style="font-size:12px;">资源正在加载中。。。</p>');
			this.addChild(loading);
			var _self = this;
			JY.loadFile("/scripts/JY.cookie.js","script",function(){
				_self.removeChild(loading);
		   });
		}
	});
	var  b=new WordGame;
	b.init();	
	if (location.host !=="www.lovewebgames.com"&&location.hostname !=="localhost"){
		location.href="http://www.lovewebgames.com";
	};
})(window);