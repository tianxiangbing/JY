/*!
 * 天空作战，版本号：1.0
 * http://www.lovewebgames.com/game/skyFight.html
 * Copyright 2012, 田想兵 
 * Email : yoooyeeey@163.com
 * QQ:55342775
 * Includes JY.js
 * http://www.lovewebgames.com/
 *
 * Date: 2012/9/4
 */
(function(){
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
			this.monsterArr = [];
			this.level = 1;
			this.speed = 5;
			this.score =0;
			this.life =5;
			this.magic = 100;
			this.timer = +new Date();
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
			this.user = this.createUser();
			this.userSpeed = 5;
			this.monsterSort = 0;	
			JY.css(b.stage,{'background':"url(images/skyBG.jpg) repeat-x"});
			this.backX = 0;
			this.vx =0;
			this.vy =0;
			this.bulletArr =[];		  //弹药
			this.shootSpeed =20;//射击速度
			this.monsterSpeed = 3;//怪物速度
			this.isEnd =false;//最后关卡
			this.monsterBulletArr=[];//怪物子弹
			this.monsterShootSpeed =15;//怪物射击速度;
			b.addChild(b.lifeScreen);
			b.addChild(b.monsterLifeScreen);
			this.shootting=false;
			this.addControl();//添加控制
			this.shootTimer=null;
		},
		addControl:function(){
			var control = JY.convertDOM('<div style="width:130px;height:130px;position:absolute;left:10px;bottom:10px;" id="CONTROL"><div  style="position:absolute;left:45px;top:0;width:40px;height:40px;border:1px solid #DEDEDE;text-align:center;line-height:40px;background:url(images/up.gif) no-repeat center;color:#282828;font-weight:bolder;" rel="87">W</div><div  style="position:absolute;left:45px;bottom:0;width:40px;height:40px;border:1px solid #DEDEDE;text-align:center;line-height:40px;background:url(images/down.gif) no-repeat center;color:#282828;font-weight:bolder;" rel="83">S</div><div  style="position:absolute;left:0;top:45px;width:40px;height:40px;border:1px solid #DEDEDE;text-align:center;line-height:40px;background:url(images/left.gif) no-repeat center;color:#282828;font-weight:bolder;" rel="65">A</div><div  style="position:absolute;right:0;top:45px;width:40px;height:40px;border:1px solid #DEDEDE;text-align:center;line-height:40px;background:url(images/right.gif) no-repeat center;color:#282828;font-weight:bolder;" rel="68">D</div><div  style="position:absolute;left:600px;top:45px;width:40px;height:40px;border:1px solid #DEDEDE;text-align:center;line-height:40px;background:url(images/tjsfire.jpg) no-repeat center;color:blue;font-weight:bolder;font-size:16px;" rel="74">J</div><div style="position:absolute;left:650px;top:45px;width:40px;height:40px;border:1px solid #DEDEDE;text-align:center;line-height:40px;background:url(images/dz.gif) no-repeat center;color:blue;font-weight:bolder;font-size:16px;" rel="75">K</div></div>');
			b.addChild(control);
			this.bindControlEvent();
		},
		bindControlEvent:function(){
			var _self = this;
			JY.query("#CONTROL div").bind("mousedown",function(e){
				var code = JY.attr(this,"rel");
				_self.EventUser(parseInt(code));
			});
			JY.query("#CONTROL div").bind("mouseup",function(e){
				var code = JY.attr(this,"rel");
				_self.EventUpUser(parseInt(code));
			});
		},
		createUser:function(){
		    var w = new Sprite(50,50);
			w.direction = 0;//X轴方向
			var x = w.width;
			var y = (b.stage.height + w.height)/2;
			w.setPosition(x,y);
			JY.addClass(w.DOM,"user");
			b.addChild(w.DOM);
			var _self = this;
			/*JY.bind(b.stage,"mousemove",function(e){
				_self.moveUser(e);
			});*/
			//JY.css(b.stage,{"cursor":"none"});
			w.shoot = function(){
				var bullet = new Sprite(10,10);
				bullet.x = this.x+this.width;
				bullet.y = this.y+this.height/2;
				bullet.data={};
				JY.addClass(this.DOM,"shoot");
				JY.addClass(bullet.DOM,"bullet");
				b.addChild(bullet.DOM);
				bullet.setPosition();
				_self.bulletArr.push(bullet);
			};
			w.shootUp = function(){
				JY.removeClass(this.DOM,"shoot");				
			};
			w.shootDZ = function(){	  
				if (_self.magic<50){
					return false;
				}
				_self.magic-=50;
				var bullet = new Sprite(200,200);
				bullet.x = this.x+this.width/2;
				bullet.y = this.y-bullet.height/2;
				JY.addClass(this.DOM,"shoot");
				JY.addClass(bullet.DOM,"dazao");
				b.addChild(bullet.DOM);
				bullet.setPosition();
				bullet.data={};
				bullet.data.isDZ =true;
				bullet.data.speed = 20;
				_self.bulletArr.push(bullet);
				if (this.shootTimer){
					clearTimeout(this.shootTimer);
				}
				this.shootTimer = setTimeout(function(){
					JY.removeClass(bullet.DOM,"dazao");
				},3000);
			};
			return w;
		},
		EventUser:function(e){	
			var _self= this;
			if (b.currentState !==JYGSTATE.STATE_SYSTEM_GAME_PLAY){
				return;
			} 
			switch(e){
				case 87:{
					//上W
					this.vy = -this.userSpeed;
				}break;
				case 83:{
					//下S
					this.vy = this.userSpeed;
				}break;
				case 65:{
					//左A
					this.vx = -this.userSpeed;
				}break;
				case 68:{
					//右D
					this.vx = this.userSpeed;
				}break;
				case 74:{
					if (!this.shootting){
						this.user.shoot();//射击
						this.shootting=true;
						setTimeout(function(){
							_self.user.shootUp();//射击
						},500);
					}
				}break;
				case 75:{
					this.user.shootDZ();
				}break;				
			};
		},
		EventUpUser:function(e){	
			this.shootting =false;
			if (b.currentState !==JYGSTATE.STATE_SYSTEM_GAME_PLAY){
				return;
			}
			var code =e.keyCode || e;
			switch(code){
				case 87:
				case 83:{
					//下S
					this.vy = 0;
				}break;
				case 65:
				case 68:{
					//右D
					this.vx = 0;
				}break;	
			}
			this.user.shootUp();//射击
		},
		runGame:function(){	
			this.creaetMonster(this.level); //创建怪物
			this.moveMonster();	//移动怪物		
			this.checkLife();  //生命值
			this.checkLevel(); //等级
			this.moveMaps();  //移动地图
			this.moveUser();  //移动角色
			this.moveBullet(); //移动角色子弹
			this.killMonster();	//杀死怪物
			this.moveMonsterBullet(); //移动怪物子弹
		},
		moveUser:function(){
			this.user.x+=this.vx;
			this.user.y+=this.vy;
			this.user.x=Math.min(this.user.x,JY.width(b.stage)-this.user.width);
			this.user.x=Math.max(this.user.x,0);
			this.user.y=Math.min(this.user.y,JY.height(b.stage)-this.user.height);
			this.user.y=Math.max(this.user.y,0);
			this.user.setPosition(this.user.x,this.user.y);
		},
		moveBullet:function(){
			var _self =this;
			JY.each(_self.bulletArr,function(v,i){
				v.x+= _self.shootSpeed;
				v.setPosition();
				if (v.x>b.stage.width){	
					b.removeChild( v.DOM);
					//_self.bulletArr.splice(i,1);
					delete _self.bulletArr[i];
					delete v.DOM;
					delete v;
				}
			});
		},
		killMonster:function(){
			var _self = this;			
			JY.resolve(function(v,i){
				JY.each(_self.monsterArr,function(u,n){
					if (JY.hits(v,u)){				
						u.life--;
						b.monsterLifeScreen.innerHTML="怪物血量："+JY.progressbar (u.life,u.sumLife,200);
						if (u.life<=0){
							b.monsterLifeScreen.innerHTML ='';
							b.removeChild( u.DOM);	
							_self.magic += u.level;
							_self.magic = Math.min(_self.level*100,_self.magic) ;					
							if (u.level===10){
								_self.score+=100;
								b.gameOverScreen=JY.convertDOM('<div style="color:#333;padding:200px 100px;width:500px;margin:0 auto;"><h2 style="color:#333;">恭喜你，你通关了，你真是个天才。你的最后得分：<strong>'+_self.score+'</strong>分</h2><p>点击重新开始游戏</p><div>');
								b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
								JY.css(b.stage,{"cursor":"default"});
							}
							_self.monsterArr.splice(n,1);
							delete u;
							_self.score ++;
						};
						if (!v.data.isDZ ){
							b.removeChild( v.DOM);
							_self.bulletArr.splice(i,1);	 
							delete v;
						}else{
							JY.each(_self.monsterBulletArr,function(w,m){
								if (JY.hits(w,v)){
									b.removeChild(w.DOM);
									_self.monsterBulletArr.splice(m,1);
									delete w;
								}
							});
						}
					}
				});
			},0,this.bulletArr.length,this.bulletArr);
		},
		moveMaps:function(){
			this.backX += this.speed;
			this.backX >=1447 ?this.backX=0:null;
			JY.css(b.stage,{"backgroundPosition":-this.backX+"px 0"});
		},
		checkLevel:function(){
			b.scoreScreen.innerHTML = "得分："+this.score +"分";
			if (this.score/this.level>=10){
				this.level++;
				this.monsterSort ++;
				this.life += this.level;
				this.life = Math.min(this.life,5*this.level)
			};
			b.lifeScreen.innerHTML ="<span>生命：</span>"+JY.progressbar (this.life,5*this.level,100) +"<div class='blue'><span>魔法:</span>"+JY.progressbar(this.magic,this.level*100,100)+"</div><p>等级："+this.level+".lv</p>";
		},
		checkLife:function(){
			if (this.life<=0){
				b.gameOverScreen=JY.convertDOM('<div style="color:#333;padding:200px 100px;width:500px;margin:0 auto;"><h2 style="color:#333;">恭喜你，你挂了。你的最后得分：<strong>'+this.score+'</strong>分</h2><p>点击重新开始游戏</p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
				JY.css(b.stage,{"cursor":"default"});
			}
		},
		moveMonster:function(){
			var _self= this;
			JY.resolve(function(v,i){
				v.x -=v.monsterSpeed;		
				v.setPosition(v.x);
				if (v.x< -v.width){
					b.removeChild( v.DOM);
					delete v.DOM;
					delete v;
					_self.monsterArr.splice(i,1);
				};
				var rnd = Math.floor(Math.random()*500);
				if (v && rnd< v.level+5 && _self.level<=10 &&v.x>=_self.user.x){
					//怪物反击
					var bullet = new Sprite(10,10);
					bullet.x = v.x;
					bullet.y = v.y+v.height/2;
					var DvalueX =_self.user.x+_self.user.width/2 - bullet.x  ;
					var DvalueY = _self.user.y+_self.user.height/2 - bullet.y  ;
					bullet.data ={};
					bullet.data.angle = Math.atan2(DvalueX,DvalueY);
					JY.addClass(bullet.DOM,"bullet2");
					b.addChild(bullet.DOM);
					bullet.setPosition();
					_self.monsterBulletArr.push(bullet);
				}
			},0,this.monsterArr.length,this.monsterArr);
		},
		moveMonsterBullet:function(){
			var _self= this;
			JY.resolve(function(v,i){
				v.x += Math.sin(v.data.angle)*_self.speed;	
				v.y += Math.cos(v.data.angle)*_self.speed;		
				v.setPosition(v.x,v.y);
				if (JY.hits(v,_self.user,5)){
					_self.life --;
					b.removeChild( v.DOM);
					//_self.monsterBulletArr.splice(i,1);
					delete _self.monsterBulletArr[i];
					delete v.DOM;
					delete v;
				}
				if (v.y>b.stage.height || v.y<0|| v.x<0|| v.x>b.stage.width){
					b.removeChild( v.DOM);
					_self.monsterBulletArr.splice(i,1);
					delete v;
				};
			},0,this.monsterBulletArr.length,this.monsterBulletArr);
		},
		creaetMonster:function(level){
			var chance = Math.floor(Math.random()*100);
			if(chance < 3+level/2 ){
				var w = new Sprite(50,52);
				w.life =0;
				w.level=0;
				
				if (this.isEnd){
					w= new Sprite(60,60);
					JY.addClass(w.DOM,"five");
					w.life=5;  
					w.level=5;
					w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
				}
				switch(level){
					case 1:{
						w.life =1;
						w.level=1;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 2:{
						w= new Sprite(60,44);
						JY.addClass(w.DOM,"two");
						w.life=2;  
						w.level=2;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 3:{
						w= new Sprite(60,52);
						JY.addClass(w.DOM,"three");
						w.life=3;  
						w.level=3;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 4:{
						w= new Sprite(60,56);
						w.width = 60;
						w.height=56;
						JY.addClass(w.DOM,"four");
						w.life=4;  
						w.level=4;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 5:{
						w= new Sprite(60,60);
						JY.addClass(w.DOM,"five");
						w.life=5;  
						w.level=5;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 6:{
						w= new Sprite(40,80);
						JY.addClass(w.DOM,"six");
						w.life=6; 
						w.level=6;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 7:{
						w= new Sprite(60,51);
						JY.addClass(w.DOM,"seven");
						w.life=7; 
						w.level=7;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 8:{
						w= new Sprite(60,62);
						JY.addClass(w.DOM,"eight");
						w.life=8; 
						w.level=8;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					case 9:{
						w= new Sprite(80,58);
						JY.addClass(w.DOM,"night");
						w.life=9; 
						w.level=9;
						w.monsterSpeed=this.monsterSpeed * (Math.random()+0.1);
					}break;
					default:{
						if (!this.isEnd){
							w= new Sprite(200,188);
							JY.addClass(w.DOM,"ten");
							this.isEnd=true;
							w.monsterSpeed =0;
							w.life=100; 
							w.level=10;					
						}
					}break;
				}		
				if (w.life ===0){
					return;
				}
				w.sumLife=w.life;
				w.direction = 0;//X轴方向
				var x =b.stage.width - w.width;
				var y = Math.random()*(b.stage.height-w.height);
				w.setPosition(x,y);			
				w.data ={x:this.user.x,y:this.user.y};	
				//敌人和英雄间的角度
				/*
				var DvalueX = w.data.x - w.x;
				var DvalueY = w.data.y- w.y ;
				var len = parseInt( Math.sqrt (DvalueX*DvalueX + DvalueY*DvalueY)) /w.width;//两点间距离
				var angle=Math.atan2(DvalueX,DvalueY);//角度
				w.data.angle = angle;
				w.DOM.innerHTML = w.data;
				*/	
				JY.addClass(w.DOM,"monster");
				b.addChild(w.DOM);
				this.monsterArr.push(w);
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
			this.titleScreen=JY.convertDOM('<div style="color:#333;padding:200px;width:300px;margin:0 auto;"><h1 style="color:#333;font-weight:bold;">兔基斯天空大作战</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="color:#333;padding:200px;width:300px;margin:0 auto;"><h1 style="color:#333;">兔基斯天空大作战</h1><p>点击开始游戏</p><p>WSAD移动角色，J发射攻击,K发大招。</p><a>作者：田想兵</a>55342775@qq.com</div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#333;width:100px;float:right;" id="scoreScreen"></div>');

			this.lifeScreen = JY.convertDOM('<div style="color:#333;width:250px;float:left;" id="lifeScreen"></div>');
			this.monsterLifeScreen = JY.convertDOM('<div style="color:#333;width:200px;float:left;margin-left:50px;" id="monsterLifeScreen"></div>');
			//g.newGame();
			JY.bind(document,"keydown",function(e){
				g.EventUser(e.keyCode);
			}).bind(document,"keyup",JY.proxyFunc(g.EventUpUser,g));
			var loading = JY.convertDOM('<p style="font-size:12px;">资源正在加载中。。。</p>');
			this.addChild(loading);
			var _self = this;
		    JY.loadFile("images/tjs.gif,images/tjs2min.gif,images/tjsfire.jpg,images/kdyg/374-铁哑铃.png,images/kdyg/081-小磁怪.png,images/kdyg/132-百变怪.png,images/kdyg/173-小皮皮.png,images/kdyg/177-天然雀.png,images/kdyg/201-安侬.png,images/kdyg/140-化石盔.png,images/kdyg/191-向日种子.png,images/kdyg/074-小拳石.png,images/kdyg/383-古拉顿.png","image",function(){
				_self.removeChild(loading);
		   });
		}
	});
	var  b=new WordGame;
	b.init();
})();