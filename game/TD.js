/*
*魔兽
*author: 田想兵 
*date:2013/9/17
*email:55342775@qq.com
*web:http://www.lovewebgames.com
*/
(function(win){
	var SelectTab = function(){
		this.target = null;
		this.canvas = null ;//操作的画布
		this.gameboard = null;
		this.userList = [];
	};
	SelectTab.prototype = new Sprite;
	JY.extend(SelectTab.prototype,{
		create:function(userList){
			this.init(userList.length*30,30);
			this.setStyle({border:"1px solid #AAA","borderRadius":"5px",backgroundColor:"#00FF7F",zIndex:3});
			var _self =  this;
			JY.each(userList,function(d,i){
				var item = new POSITION [ d.type];
				item.range= d.range;
				item.parent = _self ;
				item .selectTab = _self;
				item.money = d.money;
				item .attack= d.attack;
				item.Mattack = d.Mattack;
				item.description();
				item.setPosition(i*30);
				_self.userList .push( item);
				_self.addChild(item);
			});
		},
		AddUser:function(user){
			this.parent.userArr.push(user);
			//console.log(this.parent.userArr);
		},
		show:function(d){
			this.target = d;
			this.setPosition(d.x - this.width/2 + d.width/2, d.y - this.height-10);
			this.setStyle({"display":"block"});
			_self = this;
			JY.each(_self.userList,function(d,i){
				d.target = _self.target;
				d.canvas= _self.canvas;
				d.gameboard =_self.gameboard;
			});
		},
		hide:function(){
			this.setStyle({"display":"none"});
		}
	});
	var Upgrade = function(){};
	Upgrade.prototype = new Sprite;
	JY.extend(Upgrade.prototype,{
		create:function(){
			this.init(30,30);
			this.setStyle({border:"1px solid #AAA","borderRadius":"5px",backgroundColor:"#00FF7F"});
			var _self =  this;
			JY.append(_self.DOM,"up");
			_self.gameboard.addChild(this);
			_self.bindEvent();
		}
		,bindEvent:function(){
			var _self =  this;
			JY.bind(this.DOM,"mousedown",function(){
				if (_self.target.level <3){
					_self.target.levelup();
				};
				JY.remove(_self.DOM);
				_self = null;
			});
		},
		show:function(){
			this.setPosition(this.target.x - this.width/2 + this.target.width/2, this.target.y - this.height-10);
			this.setStyle({"display":"block"});
		}
		,hide:function(){
			this.setStyle({"display":"none"});
		}
	});
	var POSITION = {};//命名空间
	POSITION.USER = function (){
		this.type = 0;
		this.speed = 10;
		this.target = null;
		this.level = 1;
		this.gameboard = null;
		this.canvas = null;
		this.user  =null;
	};
	POSITION.USER.inherits(Sprite);
	POSITION.USER.method({
			structure:function(){
			
			},
			move:function(shootArr){
			
			},
			showIcon:function(){
				this.setStyle({background:"blue"});
			},
			description:function(){
				this.init();
				this.width = 30;
				this.height =30;
				//this.range = 100;//攻击范围 
				this.setStyle({width:this.width+"px",height:this.height+"px","cursor":"pointer"});
				var money = new Sprite(30,12);
				JY.append(money.DOM,"$"+this.money);
				money.setStyle({color:"blue","bottom":0,fontWeight:"bold",fontStyle:"normal",fontSize:"12px"});
				this.addChild(money);
				this.showIcon();
				this.bindEvent();
			},
			bindEvent:function(){
				var _self = this;
				JY.hover(this.DOM,function(){
					JY.css(this,{opacity:0.7});
					_self.drawRange();//
				},function(){
					JY.css(this,{opacity:1});
					_self.clearRange();
				});
				JY.bind(this.DOM,"mousedown",function(){
					_self.create(); 
				});
			},
			drawRange:function(){//			
				this.clearRange();
				this.canvas.beginPath();
				this.canvas.strokeStyle="#aaa";
				this.canvas.arc(this.target.x + this.target.width/2,this.target.y + this.target.height/2,this.range,0,Math.PI*2,false);
				this.canvas.stroke();
			},
			clearRange:function(){
				this.canvas.clearRect(0,0,JY.width(this.canvas.canvas),JY.height(this.canvas.canvas));				
			},
			Attack:function(){
				
			},
			_init:function(){
				this.init();
				this.width = 32;
				this.height = 32;
				this.y = 0 ;
				this.setStyle({border:"1px solid blue",width:this.width+"px",height:this.height+"px"});
				this.structure();
			},
			dispose:function(d){
				this.f  = d||this.f ;
			}
	});
	POSITION.archerTower = function (){
		this.type = 1;//箭塔
	};
	POSITION.archerTower.inherits(POSITION.USER);
	POSITION.archerTower.method({
		showIcon:function(){
			this.bgimg = "url(images/TD/archerTower.png) center center no-repeat";
			this.setStyle({background:this.bgimg});
		},
		create:function(){			
			if (g.money < this.money){
				return false;
			};
			g.money -= this.money;
			this.user = new Tower (30,30);
			this.user.bgimg = this.bgimg;
			this.user.attack = this.attack;
			this.user.Mattack = this.Mattack;
			this.user.money = this.money;
			this.user.create(this,this.gameboard);
			this.user.canvas = this.canvas;
			this.selectTab.hide();			
			this.parent.AddUser( this.user);
		}
	});
	var Bullet = function(){
		this.ctx = null;
		this.width=2;
		this.speed = 10;
		this.target = null;
		this.toObj = null;
		this.attack = 100;
		this.Mattack = 10;
		this.life= 1;
	};
	JY.extend (Bullet .prototype,{
		init:function(target, toObj, ctx){
			this.ctx = ctx;
			this.target = target;
			this.x = target.x + target.width/2;
			this.y = target.y + target.height/2;
			this.toObj  = toObj;
			this.ctx.fillStyle ="red";
			this.ctx .beginPath();
			this.ctx .save();
			this.ctx.arc(this.x,this.y , this.width,0,Math.PI*2,false);
			this.ctx.stroke();	
			this.ctx .restore();
		},
		move:function(){
			//this.ctx.clearRect(0,0,640,640);	
			if (!this.toObj || this.life<=0 || this.toObj.del){
				return false;
			};
			var DvalueX = this.toObj.x+ this.toObj.width/2- this.x ;
			var DvalueY =this.toObj.y+ this.toObj.height/2 - this.y ;
			var angle=Math.atan2(DvalueX,DvalueY);//角度
			this.x += Math.floor( Math.sin(angle)*this.speed);	
			this.y += Math.floor(Math.cos(angle)*this.speed);			
			this.ctx .beginPath();			
			this.ctx.arc(this.x,this.y , this.width,0,Math.PI*2,false);
			this.ctx.stroke();
			var tmpX = this.x - this.target.x;
			var tmpY = this.y - this.target.y;
			var cl = Math.sqrt( tmpX * tmpX + tmpY * tmpY );
			if (JY.hits(this, this.toObj) ){
				this.toObj.life = this.toObj.life - Math.max( 0,  this.attack - this.toObj.Def) -Math.max(0, this.Mattack - this.toObj.MDef);
				this.life= 0;
				if (this.toObj.life<=0){
					this.toObj.del  = true;
					b.removeChild(this.toObj);
					g.money += this.toObj.money;
					delete this.toObj;
					g.moveMonsterArr [this.index] = null;
					delete g.moveMonsterArr [this.index];
				}
			}
			
		}
	});
	POSITION.MTower = function(){};
	POSITION.MTower.inherits(POSITION.archerTower);
	POSITION.MTower.method({
		showIcon:function(){
			this.bgimg = "url(images/TD/Mtower.png) center center no-repeat";
			this.setStyle({background:this.bgimg});
		}
	});
	POSITION.MATower = function(){};
	POSITION.MATower.inherits(POSITION.archerTower);
	POSITION.MATower.method({
		showIcon:function(){
			this.bgimg = "url(images/TD/MATower.gif) center center no-repeat";
			this.setStyle({background:this.bgimg});
		}
	});
	//箭塔
	var Tower = function(){
		this.range = 100;
		this.canvas = null;
	};
	Tower.prototype = new Sprite;
	JY.extend(Tower.prototype,{
		fire:function(d,ctx,index){
			//d.setStyle({background:"blue"});
			var bullet  = new Bullet();
			bullet.index= index;
			bullet.attack= this.attack;
			bullet.Mattack  = this.Mattack;			
			bullet.init(this,d,ctx );
			g.bulletArr .push (bullet);
		},
		create:function(obj,gameboard){
			this.init(30,30);
			this.setPosition(obj.target.x,obj.target.y);
			this.level = 1;
			this.range = obj.range;
			this.gameboard = gameboard;
			this.setStyle({background:this.bgimg});
			this.gameboard.addChild(this);
			this.levelInfo= new Sprite(30,12);
			JY.css(this.levelInfo.DOM,{fontSize:"10px",fontStyle:"normal",color:"blue",fontWeight:"bold"});
			this.levelInfo.setPosition(5,18);
			JY.append(this.levelInfo.DOM,"lv."+this.level);
			this.addChild(this.levelInfo);
			JY.remove(obj.target.DOM);
			this.bindUpEvent();
		},
		levelup:function(){
			if (g.money <  this.money*this.level){
				return false;
			};
			g.money -= this.money*this.level;
			this.level++ ;
			this.range *=1.1;
			this.attack *=1.1;
			this.Mattack *=1.1;
			this.levelInfo.DOM.innerHTML='lv.'+this.level;
		}
		,
		bindUpEvent:function(){
			var _self = this;
			JY.bind(_self.DOM,"mousedown",function(){
				var upgrade= new Upgrade();
				upgrade.target = _self;
				upgrade.gameboard = _self.gameboard;
				upgrade.create();
				upgrade.show();
			});
			JY.hover(_self.DOM,function(){
				_self.drawRange();
			},function(){
				_self.clearRange();
			});
		},
		clearRange:function(){
			this.canvas.clearRect(0,0,JY.width(this.canvas.canvas),JY.height(this.canvas.canvas));				
		},
		drawRange:function(){//			
			this.clearRange();
			this.canvas.beginPath();
			this.canvas.strokeStyle="#aaa";
			this.canvas.arc(this.x + this.width/2,this.y + this.height/2,this.range,0,Math.PI*2,false);
			this.canvas.stroke();
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
	//怪物
	var Monster = {
	};
	Monster.base = function(){
		this.index = 0;
		this.speed=10;
		};
	Monster.base.prototype = new Sprite;
	JY.extend(Monster.base.prototype,{
		create:function(){
			this.init(30,30,{background:"url(images/TD/monster.gif) center center no-repeat"});
		}
	});
	Monster.monster1= function(){
	};
	Monster.monster1 .prototype = new Monster.base;
	Monster.monster2= function(){
	};
	Monster.monster2 .prototype = new Monster.base;
	JY.extend(Monster.monster2 .prototype,{
		create:function(){
			this.init(30,30,{background:"url(images/TD/monster2.png) center center no-repeat"});
		}
	});
	Monster.monster3= function(){
	};
	Monster.monster3 .prototype = new Monster.base;
	JY.extend(Monster.monster3 .prototype,{
		create:function(){
			this.init(30,30,{background:"url(images/TD/monster3.png) center center no-repeat"});
		}
	});
	Monster.monster4= function(){
	};
	Monster.monster4 .prototype = new Monster.base;
	JY.extend(Monster.monster4 .prototype,{
		create:function(){
			this.init(30,30,{background:"url(images/TD/monster4.gif) center center no-repeat"});
		}
	});
	Monster.monster5= function(){
	};
	Monster.monster5 .prototype = new Monster.base;
	JY.extend(Monster.monster5 .prototype,{
		create:function(){
			this.init(50,50,{background:"url(images/TD/monster5.png) center center no-repeat"});
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
			this.levelArr = ["level1","level2","level3","level3","level4","level5","level6"];
			this.levelKey = ["!@#","#@!","sa","erq","!@#1","#@!2","sa中","fe3","!sel","iow!","q3","6ff","56w","al3","3d","a3d","3LK","ailk","@#%D","$#$","!^^","SE!","WD","BDA","MC","WC!","EFS","DE"];
			this.levelGrade= [];
			this.levelSpriteArr = [];
			this .currentLevel = 1;
			this.currentLevelArr = [];
			this.pointArr =[] ;
			this.positionList = [];//位置
			this.currentConfig = {};
			win.levelObject = {};
			this.lastPoint = null;
			this.life =10;
			this.lifeScreen= null;
			this.user = null;
			this.money = 100;
			this.moneyScreen = null;//金钱显示
			this.shiArr = [];
			this.speed = 5;
			this.mapCxt = JY.getCtx("path");
			this.monsterCxt = JY.getCtx("monster");
			this.actionCxt = JY.getCtx("action");
			this.monsterArr = [];
			this.monsterbatch=0;//怪物索引
			this.monsterMoveWait = 10;
			this.moveMonsterArr = [];//能移动的怪
			this.userArr = [];
			this.bulletArr =[];//子弹数组
			this.fireCounter = 10;
			this.showLevel();//显示关卡
			JY.soundManage.play("bg",true);
		},
		showLevel:function(){
			this.mapCxt.clearRect(0,0,640,640);
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
				var max = JY.cookie("TDlevel")||1;
				var maxKey = JY.cookie("TDlevelKey") ||"!@#";
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
			this.monsterbatch=0;
			this.userArr  = [];
			this.monsterCxt.clearRect(0,0,640,640);
			this.mapCxt.clearRect(0,0,640,640);
			this.actionCxt.clearRect(0,0,640,640);
			_self .life   = 10;
			//加载地图....
			JY.loadFile("/game/level/TD/level" + d+".js","script",function(){
				_self .drawMap();				
		   });
		   //金钱显示
		   _self.moneyScreen = new Sprite(150,20,{right:"0px",top:0,background:"gray",fontStyle:"normal"});
		   b.addChild(_self.moneyScreen);
		   _self.lifeScreen = new Sprite (202,22 ,{left:"0px",top:0,border:"1px solid red",borderRadius:"5px",backgroundColor:"#FFF"});
		   b.addChild(_self.lifeScreen);
		},
		drawMap:function(){
		//绘制地图
			var _self = this;
			_self.currentLevelArr = win.levelObject["level"+_self.currentLevel].map;
			_self.currentConfig  = win.levelObject["level"+_self.currentLevel].config;
			_self.path = _self.currentLevelArr.path;
			_self.positionArr = _self.currentLevelArr.position;
			_self .money = _self.currentConfig.money;
			_self.mapCxt.save();
			var gradient=_self.mapCxt.createLinearGradient(0,0,640,0);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","rgba(233,233,100,0.5)");
			gradient.addColorStop("1.0","rgba(233,0,100,0.5)");
			// 用渐变进行填充
			_self.mapCxt.strokeStyle=gradient;
			_self.mapCxt.lineWidth=20; 
			_self.mapCxt.lineJoin="round";
			_self.mapCxt.beginPath();  
			JY.each(_self.path ,function(d){				
				_self.mapCxt. moveTo(d[0].start.x,d[0].start.y);
				JY.resolve(function(v,i){
					_self.mapCxt.lineTo(v.end.x,v.end.y);
					_self.mapCxt.stroke();
				},0,d.length,d);
			});
			
			_self.mapCxt.restore();
			JY.each(_self.positionArr , function(d){
				//_self.mapCxt.strokeRect(d.x,d.y,d.w,d.h);
				var pos = new Sprite(d.w,d.h);
				pos.setStyle({backgroundColor:"#efefef",border:"1px dashed #AAA","borderRadius":"5px",cursor:"pointer"});
				pos.setPosition(d.x,d.y);
				b.addChild(pos);
				_self.positionList.push(pos);
			});
			//this.createCrystal();//创建水晶
			this.bindEvent();
			_self.createSelectTab();
			this.createMonster();			
			b.startTimer();
		},
		createMonster:function(){//创建怪物
			var _self = this;
			var monsterArr  = _self.currentConfig.monster;
			JY.each(monsterArr,function(d,i){
				for (; d.num-- ; ){
					var obj = new Monster[d.type];
					obj.create();
					obj.batch = i;//第几批怪
					obj.arrIndex = 0 ;
					JY.extend(obj,d);
					_self.monsterArr.push(obj);
					var startPos = _self.path[d.index][0].start;
					obj.setPosition(startPos.x-15,startPos.y-15);
					b.addChild(obj);
				}
			});
		},
		createCrystal:function(){			
			this.user = new Sprite(16,20,{"border":"none","background":"url(images/movehoop/fire.gif) -3px 0px no-repeat"});
			this.user.setPosition(0,JY.height(b.stage)/2);
			b.addChild(this.user);
		},
		bindEvent:function(){
			var _self = this;
			JY.each(_self.positionList, function(d,i){	
				JY.bind(d.DOM,"mousedown",function(e){
					_self.showSelect(d);
				});
				JY.hover(d.DOM,function(){
					JY.css(this,{backgroundColor:"#F0F8FF",border:"1px solid #AAA"});
				},function(){
					JY.css(this,{backgroundColor:"#efefef",border:"1px dashed #AAA"});				
				});
			});
		},
		createSelectTab:function(){
			this.tab = new SelectTab();
			this.tab.create(this.currentConfig.user);
			this.tab.hide();
			this.tab.gameboard = b;
			this.tab.parent = this;
			b.addChild(this.tab);
		},
		showSelect:function(d){
			this.tab.canvas =JY.getCtx("action");
			this.tab.show(d);
		},
		
		runGame:function(){	
			this.checkLife();
			this.runMonster();
			this.moveBullet();
			this.testHits();
		},
		moveBullet:function(){
			var _self = this;
			/*
			JY.resolve (function(d,i){
				d.move();
			},0, _self.bulletArr.length,_self.bulletArr);
			*/
			_self.monsterCxt.clearRect(0,0,640,640);	
			JY.each(_self.bulletArr,function(d,i){
				if (d.toObj){					
					d.move();
				}else{
					d =null;
					delete _self.bulletArr[i];
				}
			});
		},
		testHits:function(){
			var _self  = this;
			if (_self.fireCounter<0){
				_self.fireCounter =10;
				JY.resolve(function(v,k){
					JY.each(_self.moveMonsterArr,function(d,i){
						var  x= d.x- v.x;
						var y = d.y-v.y;
						var distance = Math.floor( Math .sqrt ( x* x +  y *y));
						if (distance <= v.range){
							v.fire(d,_self.monsterCxt , i);
							return false;
						}
					});
				},0,_self.userArr.length,_self.userArr);
			};
			_self .fireCounter --;
		},
		runMonster:function(){
			var _self = this;
			if (_self.monsterArr.length > 0 && _self.monsterMoveWait <= 0  && _self.monsterArr[0].batch == _self.monsterbatch){
				_self.monsterMoveWait =10;
				_self.moveMonsterArr.push(_self.monsterArr.shift());
			}
			JY.resolve(function(d,i){
				if (d.batch == _self.monsterbatch){					
					var arr = _self.path[ d.index];
					var temp =arr[d.arrIndex];
					if (arr.length == d.arrIndex){
						b.removeChild(d);
						delete d;
						_self.moveMonsterArr[i]="";
						_self .life --;
						return;
					}
					var DvalueX = temp.end.x- temp.start.x ;
					var DvalueY =temp.end.y - temp.start.y ;
					var angle=Math.atan2(DvalueX,DvalueY);//角度
					d.x += Math.sin(angle)*d.speed;	
					d.y += Math.cos(angle)*d.speed;		
					var center= {x:d.x+ d.width/2,y:d.y + d.height/2};
					if ( Math.abs ( center.x - temp.end.x) <= 10  && Math.abs (center.y - temp.end.y)<= 10 ){
						var isgo = false;
						if (temp.start.y > temp .end .y ){
							if ( temp.end.y - center.y  > -5 && temp.end.y - center.y  <= 5){
								isgo = true;
							}
						}else{
							isgo =true;
						};
						if (isgo){
							d.arrIndex++;			
							if (d.arrIndex < arr.length){
								d.x = arr[d.arrIndex].start.x - d.width/2;
								d.y = arr[d.arrIndex].start.y - d.height/2;
							}
						}
					};
					d.setPosition(d.x,d.y);
				}
			},0,_self.moveMonsterArr.length,_self.moveMonsterArr);
			_self.monsterMoveWait--;
			if (_self .moveMonsterArr .join('') == "" && _self .moveMonsterArr .length !==0){
				_self.monsterbatch ++;
				_self.moveMonsterArr = [];
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
		
		checkLife:function(){
		    this.moneyScreen.DOM.innerHTML = '当前金钱：'+this.money + "$";
			this.lifeScreen.DOM.innerHTML = '<i style="width:'+this.life*20+'px;height:20px;margin:1px;background:red;display:block;border-radius:5px;"></i>';
			if (this.life <= 0 ){
				b.clearState();
				this.newGame();
				JY.soundManage.stop("bg",true);
				return false;
			};
			/*
			console.log(this.monsterArr);
			console.log("==========")
			console.log(this.moveMonsterArr);
			*/
			if ( this.monsterArr.length == 0 && this.moveMonsterArr .length == 0 ){
				this.levelup();
			};
		},
		levelup:function(){
			var grade =this.life;
			JY.cookie("TDlevelGrade",  JY.cookie("TDlevelGrade")+"%"+ this.levelGrade[this.currentLevel]+"|"+grade);
			this .currentLevel++ ;
			var max = JY.cookie("TDlevel")||1;
			max = Math.max( this.currentLevel ,max);
			JY.cookie("TDlevel" , max,30);
			JY.cookie("TDlevelKey" , this.levelKey[max] ,30);
			this.startLevel(this .currentLevel);
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
			this.titleScreen=JY.convertDOM('<div style="color:red;font-weight:bold;text-align:center;padding-top:50px;width:100%;margin:0 auto;"><h1 style="color:red;font-weight:bold;">魔兽争霸-塔防-JY游戏</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="margin:0 auto;height:100%;width:100%;position:relative;"><span style="display:block;cursor:pointer;width:275px;height:110px;line-height:100px;font-family: Tahoma,宋体;text-align:center;font-size:28px;font-weight:bolder;color:#FFFFFF;top:200px;left:180px;position:absolute;">Play</span><p style="position:absolute;top:350px;left:180px;color:#0091e0;"><a href="http://www.lovewebgames.com" target="_blank" style="color:#0091e0;">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#FFF;width:200px;float:right;font-weight:bold;position:absolute;z-index:2;right:0;" id="scoreScreen"></div>');
			
			JY.delegate(JY.byId('gameboard'),"a","mousedown",function(e){
				location.href = JY.attr(e.target,"href");
			});
			JY.soundManage.init("/scripts/swfobject.min.js","/scripts/flash/playSound.swf","playSound",function(){
				JY.soundManage.loadSound("/game/sound/zuma/bg.mp3","bg");
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