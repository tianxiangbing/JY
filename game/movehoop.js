/*
*
*author: 田想兵 
*date:2013/9/12
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
			this.levelArr = ["level1","level2","level3","level3","level4","level5","level6","level7","level8","level9","level10","level11","level12","level13","level14","level15","level16","level17","level18","level19","level20"];
			this.levelKey = ["!@#","#@!","sa","erq","!@#1","#@!2","sa中","fe3","!sel","iow!","q3","6ff","56w","al3","3d","a3d","3LK","ailk","@#%D","$#$","!^^","SE!","WD","BDA","MC","WC!","EFS","DE"];
			this.levelSpriteArr = [];
			this .currentLevel = 1;
			this.currentLevelArr = [];
			this.pointArr =[] ;
			this.currentConfig = {};
			this.dragPos = {};//鼠标与圆环的差值
			win.levelObject = {};
			this.moveEnabled = false;
			this.lastPoint = null;
			this.life =1;
			this.isFire = false;
			this.user = null;
			this.shiArr = [];
			this.speed = 5;
			this.showLevel();//显示关卡
			JY.soundManage.play("bg",true);
		},
		showLevel:function(){
			b.clearState();//清空界面，定时器
			var _self = this;
			JY.each(this.levelArr,function(d,i){
				var level = new Level ();
				level.create(i +1);
				level.data = i+1;
				b.addChild(level);
				var x = i %8*(level.width +10)+100;
				var y = parseInt( i /8 ) * (level.height+10)+100;
				level.setPosition(x,y );
				_self.levelSpriteArr .push (level);
				var max = JY.cookie("level")||1;
				var maxKey = JY.cookie("levelKey") ||"!@#";
				if (_self.levelKey[max] !== maxKey ){
					max = 1;
				};
				if (i+1 > max){
					level.setStyle({backgroundColor:"gray"});
					level.lock= true;
				}
			});
			this.selectLevel();//选择关卡
		},
		selectLevel:function(){
			var _self = this;
			JY.each(_self.levelSpriteArr,function(d,i){
				//JY.unbind(d.DOM,"mousedown");
				(function(d){
					JY.bind(d.DOM,"mousedown",function(e){
						if (!d.lock){
							_self.startLevel(d.data);
						}
					});
				})(d);
			});
		},
		startLevel:function(d){
			b.clearState();//清空界面，定时器
			var _self = this;
			this.currentLevel = d;
			this.speed = Math.min(this.currentLevel+3,15);
			//加载地图....
			JY.loadFile("/game/level/movehoop/level" + d+".js","script",function(){
				_self .drawMap();
				_self.user.setPosition(0,JY.height(b.stage)/2);
				_self.moveEnabled =false;
		   });
		},
		drawMap:function(){
		//绘制地图
			var _self = this;
			this.currentLevelArr = win.levelObject["level"+this.currentLevel].arr;
			this.currentConfig  = win.levelObject["level"+this.currentLevel].config;
			//console.log(JY.extend({position:"absolute",fontSize:"1px"},this.currentConfig))
			JY.draw.setStyle(JY.extend({position:"absolute",fontSize:"1px",background:"url(images/movehoop/rope.png) no-repeat"},this.currentConfig));
			JY.each(this.currentLevelArr ,function(d){					
				JY.resolve(function(v,i){				
					_self.pointArr.push(JY.draw.point(b.stage,v.x,v.y));					
				},0,d.length,d);
			});
			this.lastPoint = _self.pointArr[_self.pointArr.length- 1 ];
			JY.css(this.lastPoint,{"background":"#000"});
			this.createHoop();//创建铁环
		},
		createHoop:function(){			
			this.user = new Sprite(16,20,{"border":"none","background":"url(images/movehoop/fire.gif) -3px 0px no-repeat"});
			this.user.setPosition(0,JY.height(b.stage)/2);
			b.addChild(this.user);
			this.bindEvent();
			b.startTimer();
		},
		bindEvent:function(){
			var _self = this;
			/*
			JY.mouseDrag("gameboard",JY.proxyFunc(_self.moveUser,_self),function(){

			});
			*/
			JY.bind(_self.user.DOM , 'mousedown',function(event){
				var ePos  = _self.getEventPosition(event);
				_self .dragPos ={x : ePos.x - _self.user.x ,y : ePos.y - _self.user.y};
				_self.moveEnabled =true;
				JY.bind(document,"mousemove",JY.proxyFunc(_self.moveUser,_self));
			}).bind(document ,"mouseup",function(){				
				_self.moveEnabled =false;
				JY .unbind(document ,"mousemove");
			})
		},
		getEventPosition:function(event){	
			//var parent = JY.parent(this.user.DOM);
			var parent =b.stage;
			var po = JY.offset(parent);
			var x =0,y=0;
			x  = event.clientX -po.x +  document.documentElement.scrollLeft;
			y  = event.clientY -po.y + document.documentElement.scrollTop;
			return {x:x,y:y}
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
				this.testHits();
			}
			/*drag something
			if (JY.mouseDrag.event == JY.mouseDrag.prevEvent || !JY.mouseDrag.prevEvent){
				return;
			}
			var parent = JY.parent(this.user.DOM);
			var po = JY.offset(parent);
			var x =0,y=0;
			x  = JY.mouseDrag.event.clientX -po.x +  document.documentElement.scrollLeft;
			y  = JY.mouseDrag.event.clientY -po.y + document.documentElement.scrollTop;
			
			this.dragX = this.dragX || x -this.user.x;
			this.dragY = this.dragY ||  y - this.user.y;
			y = y - this.dragY;
			x =x -this.dragX;
			this.user.setPosition(x,y);
			*/
		},
		runGame:function(){	
			this.checkLife();
			this.fireRope();
			this.createShi();
			this.shiAnimate();
			this.checkShiHit();
			this.checkStage();
		},
		checkStage:function(){
			if (JY.height(b.stage)!==b.stage.height){
				JY.height(b.stage,b.stage.height);
			};
			if (JY.width(b.stage)!==b.stage.width){
				JY.width(b.stage,b.stage.width);
			};
		},
		checkShiHit:function(){
			if (this.isFire){
				return;
			};
			var _self = this;
			JY.resolve(function(v,i){		
				if (JY.hits(v,_self.user) ){
					_self.life-- ;
				};
			} , 0 , _self.shiArr.length , _self.shiArr );
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
		createShi:function(){
			var chance = Math.floor(Math.random()*250);
			if(chance<Math.min(this.currentLevel,5)){
				var w = new Sprite(24,24);
				var x = this.user.x;
				w.setPosition(x,-24);
				//w.data = this.goldSort [Math.floor(Math.random()*5)];
				w.setStyle({background:"url(images/movehoop/shi.png) no-repeat"});
				b.addChild(w);
				this.shiArr.push(w);
			}			
		},
		fireRope:function(){
			if (this.isFire){
				var tmp = this.pointArr.slice(-5);
				var _self = this;
				JY.each(tmp,function(d,i){
					JY.css(d,{"background":"#000"});
					_self.pointArr.pop();
				});
				if (this.pointArr.length ===0 ){
					this.isFire =false;
					this.shiArr = [];
					this.shiArr.length = 0;
					if (this.levelArr.length ==this.currentLevel){
						this.createFlower();
						alert("你撸管的小手挺稳的，希望你撸出一个新的春天，菊花收好！游戏已经通关，是否重玩一次？");
						this.startLevel(1);
						return ;
					}
					this.startLevel(this .currentLevel);
				}		
			}
		},
		createFlower:function(){
			for (var i = 0 ;i<100 ; i++ ){
				var w = new Sprite(23,23);
				var x = Math.random()* b.stage.width;
				var y = Math.random()* b.stage.height;
				w.setPosition(x,y);
				//w.data = this.goldSort [Math.floor(Math.random()*5)];
				w.setStyle({background:"url(images/movehoop/flower.png) no-repeat"});
				b.addChild(w);
			}
		},
		checkLife:function(){
			if (this.life <= 0 ){
				alert("游戏结束,手残人士，请再接再厉吧!");
				b.clearState();
				this.newGame();
				JY.soundManage.stop("bg",true);
			}
		},
		testHits:function(){			
			var isHit = false;
			var _self= this;				
			JY.resolve(function(v,i){		
				if (JY.hits(_self.user,_self.lastPoint)){
					_self.levelup();
					return false;
				}
				if (JY.hits(v,_self.user,1) ){
					_self.life-- ;
				};
			} , 0 , _self.pointArr.length , _self.pointArr );
		},
		levelup:function(){
			//this.pointArr =[] ;
			this.moveEnabled = false;
			this .currentLevel++ ;
			var max = JY.cookie("level")||1;
			max = Math.max( this.currentLevel ,max);
			JY.cookie("level" , max,30);
			JY.cookie("levelKey" , this.levelKey[max] ,30);
			this.isFire = true;
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			var _this = this;
			this.frequency =50;
			this.game = g;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:red;font-weight:bold;text-align:center;padding-top:50px;width:100%;margin:0 auto;"><h1 style="color:red;font-weight:bold;">点燃火绳-JY游戏</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="margin:0 auto;height:100%;width:100%;position:relative;"><span style="display:block;cursor:pointer;width:275px;height:110px;line-height:100px;font-family: Tahoma,宋体;text-align:center;font-size:28px;font-weight:bolder;color:#FFFFFF;top:200px;left:180px;position:absolute;">Play</span><p style="position:absolute;top:350px;left:180px;color:#0091e0;"><a href="http://www.lovewebgames.com" target="_blank" style="color:#0091e0;">作者：田想兵55342775@qq.com</a></p></div>');
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