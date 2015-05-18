/*
*地下一百层-是男人就下到一百层
*author: 田想兵 
*date:2012.11
*email:55342775@qq.com
*web:http://www.lovewebgames.com
*/
	var WordGame =function(){
	};
	var game =function(){
	};
	game.prototype = new Game;
	g=new game();
	JY.extend(game.prototype,{
		newGame:function(){
			this.floorArr =[];
			this.level = 1;
			this.speed = 5;
			this.userSpeed = 12;
			this.vx = 0;
			this.ax = 1.2;
			this.score =0;
			this.life =5;
			this.user = new Sprite();
			this.userSpeedY = 8;
			this.ay = 1.05;
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
			this.counter =0 ;
			this.createUser();
			this.animateUserFor =0;
			this.animateNum = 0; //行走动画数
			this.wd =0;//无敌时间
			this.jump =0 ;
			this.jumpy=.9;
			this.by = 0;
		},
		runGame:function(){		
			this.checkLife();
			this.checkLevel();
			this.createFloor(0);
			this.createFloor(1);
			this.createFloor(2);
			this.moveFloor();
			this.fallUser();
			this.counter++;
			this.playUser();
			this.moveRole();
			//this.moveBack();
		},
		createUser:function(){
			var floor = new Sprite(160,16,{"background":"url(images/dungeon/floor.png) "});
			JY.addClass(floor.DOM,"floor");
			var left = JY.width(b.stage)/3;
			floor.setPosition(left,JY.height(b.stage)-floor.height);
			this.floorArr .push(floor);
			b.addChild(floor);
			this.user = new Sprite(40,55,{"border":"none","background":"url(images/dungeon/role.png) no-repeat"});
			this.user.setPosition(floor.x+floor.width/2-this.user.width/2,JY.height(b.stage)-this.user.height-floor.height);
			b.addChild(this.user);
			this.user.data = floor;
			floor.data= this.user;
		},
		wdUser:function(){	
			var _self = this;
			_self.life--;
			_self.wd=15;
			_self.user.setStyle({"opacity":0.5,"filter":"alpha(opacity=50)"});
		},
		moveFloor:function(){
			var _self= this;
			JY.resolve(function(v,i){
				this.y -= _self.speed;
				if (this.data){
					if (this.type==1){
						this.data.setPosition(null,this.y-this.data.height+10);
						if (_self.wd<=0){
							_self.wdUser();
						}
					}else{
						this.data.setPosition(null,this.y-this.data.height+5);
					}
					if (this.type ==2||this.type ==3)
					{
						_self.jump = 33;
						_self.user.data=null;
						this.data =null;
					}
				}else{
					//if (JY.hits(v,{width:_self.user.width,height:30,x:_self.user.x,y:_self.user.y+_self.user.height-30},2)){	
					if (JY.hits(v,_self.user)){
						console.log("接上1");
						_self.user.data= v;
						v.data = _self.user;
						_self.userSpeedY =8;
						if (v.type==1 &&!_self.wd){
							_self.wdUser();
						}
					}
				}
				this.setPosition(this.x,this.y);
				if (this.y<-this.height){
					b.removeChild( _self.floorArr[i].DOM);
					delete _self.floorArr[i];
				}
				if (_self.user.y<-_self.user.height){
					_self.life--;
				}
			},0,_self.floorArr.length,_self.floorArr);
		},
		fallUser:function(){
			if (!this.user.data){
				this.userSpeedY *=this.ay;
				this.user.setPosition(null,this.user.y+this.userSpeedY);
				if (this.user.y>JY.height(b.stage)){
					this.life=0;
				}
			}
		},
		createFloor:function(column){
			var chance = Math.floor(Math.random()*100);
			if(chance > 60 && this.counter+this.level>20){
				var floor ={};
				var floorType = Math.floor(Math.random()*100)%10;
				switch(floorType){
					case 1:{
						//地刺						
						floor= new Sprite(160,30,{"background":"url(images/dungeon/bad.png) no-repeat"});
					}break;
					case 2:
					case 3:{
						//弹簧床		
						floor= new Sprite(160,30,{"background":"url(images/dungeon/jump2.png) no-repeat"});
					}break;
					default:{
						//正常
						floor= new Sprite(160,16,{"background":"url(images/dungeon/floor.png) no-repeat"});
					}break;
				}
				floor.type = floorType;
				JY.addClass(floor.DOM,"floor");
				var left = column*200;
				floor.setPosition(left,JY.height(b.stage));
				this.floorArr .push(floor);
				b.addChild(floor);
				this.counter=0;
				this.score++;
			}
		},
		checkUserFloor:function(x){
			if (this.user.data){
				if (this.user.data && x>this.user.data.x+this.user.data.width){
					this.user.data.data=null;
					this.user.data =null;
					console.log("掉落1")
				}
				if (this.user.data && x<this.user.data.x-this.user.width){
					this.user.data.data=null;
					this.user.data =null;
					console.log("掉落2")
				}
			}
		},
		moveBack:function(){
			 JY.css(b.stage,{backgroundPosition:"0 "+this.by+"px"});
			 this.by -= this.speed;
			 if( this.by>600){
				 this.by=0;
			 }
		},
		playUser:function(){			
			if (this.animateUserFor ){
				var x = -this.animateNum*40;
				var y = -this.animateUserFor*55;
				this.user.setStyle({backgroundPosition:x+"px "+y+"px"});
				this.animateNum ++;
				if (this.animateNum>4){
					//stop;
					this.user.setStyle({backgroundPosition:"0px 0px"});
					this.animateNum=0;
					this.animateUserFor=null;
				}
			}
			if(this.wd>0){
				this.wd--;
				if (this.wd<=0){
					this.user.setStyle({opacity:1,"filter":"alpha(opacity=100)"});
				}
			}
		},
		moveRole:function(){
			if (this.vx!=0){
				this.vx *=this.ax;
				this.user.x +=this.vx ;		   
				this.user.x=Math.max(this.user.x,0);
				this.user.x=Math.min(this.user.x,this.user.x,JY.width(b.stage)-this.user.width);
				this.user.setPosition(this.user.x);				
				this.vx<0?this.animateUserFor =1:this.animateUserFor =2;
				this.checkUserFloor(this.user.x);
			}
			if (this.jump >0)
			{
				this.jump *=this.jumpy;
				this.user.y -= this.jump;
				this.user.setPosition(null,this.user.y);
			}
		},
		EventUpUser:function(e){
			e = e.keyCode;
			if (e==37||e == 65){
				this.vx <0? this.vx=0 :null;
			}
			if ( e==39||e == 68){
				this.vx >0? this.vx=0 :null;
			}
			if (e == 38){
				console.log("x:"+this.user.x);
				console.log("fx:"+this.data)
			}
		},
		moveUser:function(e){
			if (e==37||e == 65 ){
				//左
				this.vx = -10;	
			}
			if (e==39||e == 68 ){
				//右				
				this.vx = 10;
			}
		},
		checkLevel:function(){
			b.scoreScreen.innerHTML = "生命："+this.life+" 得分："+ this.score;
			if (this.score/this.level>5){
				this.level++;
				this.speed++;
			}
		},
		checkLife:function(){
			if (this.life<=0){
				var _this  = this;
				var maxScore = parseInt(JY.cookie("dungeonScore")) || 0;
				maxScore = Math.max(maxScore,this.score);
				JY.cookie("dungeonScore",maxScore,30);
				b.gameOverScreen=JY.convertDOM('<div style="color:#EEE;padding:200px 200px;width:500px;margin:0 auto;"><h1>您最后下到了地狱 <strong>'+this.score+'</strong> 层</h1><p>最厉害的一次你下到了<b>'+maxScore+'</b>层</p><p>点击重新开始游戏</p><p>更多游戏请<a href="http://www.lovewebgames.com">点击这里</a></p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
			}
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			this.frequency =50;
			this.game = g;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:#eee;padding:200px 100px;width:300px;margin:0 auto;"><h1>地下一百层-是男人就下到一百层</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="color:#eee;padding:200px;width:300px;margin:0 auto;"><h1>地下一百层-是男人就下到一百层</h1><p>点击开始游戏</p><p>方向键左右移动英雄<a href="http://www.lovewebgames.com" target="_blank">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#eee;width:150px;float:right;" id="scoreScreen"></div>');
			JY.bind(document,"keydown",function(e){
				g.moveUser(e.keyCode);
			}).bind(document,"keyup",JY.proxyFunc(g.EventUpUser,g));
			JY.delegate(JY.byId('gameboard'),"a","mousedown",function(e){
				location.href = JY.attr(e.target,"href");
			});
			var loading = JY.convertDOM('<p style="font-size:12px;">资源正在加载中。。。</p>');
			this.addChild(loading);
			var _self = this;
		    JY.loadFile("images/dungeon/floor.png,images/dungeon/bad.png,images/dungeon/jump2.png,images/dungeon/role.png","image",function(){
				_self.removeChild(loading);
		   });
			JY.loadFile("/scripts/JY.cookie.js","script");
			/*
			JY.loadFile("../swfobject.js","script",function(){
				JY.loadFile("../playSound.swf","swf",function(){
					alert("a")
				},"playSound");
			});
			*/
			JY.soundManage.init("/scripts/swfobject.min.js","/scripts/flash/playSound.swf","playSound",function(){
				JY.soundManage.loadSound("sound/dungeon/bg.mp3","bg").done(function(){
					JY.soundManage.play("bg");
				});
			});
		}
	});
	var  b=new WordGame;
	b.init();

if (location.host !=="www.lovewebgames.com"&&location.host !=="localhost"){
	//location.href="http://www.lovewebgames.com"
}
JY.hits({x:200,y:309,width:160,height:16},{x:137,y:305,width:40,height:55});