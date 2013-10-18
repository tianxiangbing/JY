	var WordGame =function(){
	};
	var game =function(){
	};
	game.prototype = new Game;
	g=new game();

	JY.extend(game.prototype,{
		newGame:function(){
			this.monsterArr =[];
			this.level = 1;
			this.jumpSpeed = 25;
			this.monsterSpeed = 10;
			this.mapSpeed=10;
			this.score =0;
			this.life =1;
			this.user = null;
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
			this.counter =0 ;
			this.animateUserFor =0;
			this.animateNum = 0; //行走动画数
			this.waiter = 0;
			this.createUser();
			this.BindEvent();
			this.isJump = 0;
			this.monsterType = [FixedMonster,MoveMonster];
			this.by =0 ;
			this.shootArr =[];
			this.userState =0 ;
			this.shootCount={type:"",count:0};
			this.shootScreen =null;
			this.wdScreen  = null;
			this.createShootScreen();
			this.wdTimer =0;
			this.wdState= 0;//无敌状态
			this.userRunSpeed=3;//动画速度
		},
		createShootScreen:function(){
			this.shootScreen=JY.convertDOM('<div style="position:absolute;bottom:0;left:10px;height:30px;"></div>');
			b.addChild(this.shootScreen);
			this.wdScreen=JY.convertDOM('<div style="position:absolute;bottom:50%;left:40%;background-Color:#98Ed66;padding:10px;border-radius:3px;border:1px solid #989898;display:none;">无敌时间</div>');
			b.addChild(this.wdScreen);
			
		},
		formatShoot:function(){
			var str ='';
			for (var i =0,l=this.shootCount.count;i<l ;i++ )
			{
				if (this.shootCount.type=="red")
				{
					str+= '<img src="images/run/fixshoot.png" width="30px"/>';
				}
				if (this.shootCount.type=="blue")
				{
					str+= '<img src="images/run/moveshoot.png" width="30px"/>';
				}
			}
			this.shootScreen.innerHTML=str;			
			JY.css(this.shootScreen,{display:"block"});		
			if (this.shootCount.count==3)
			{
				if (this.shootCount.type=="red")
				{
					//console.info('无敌开始');
					this.monsterSpeed *= 2;
					this.mapSpeed *= 2;
					this.userRunSpeed=2;
					JY.css(this.wdScreen,{display:"block"});
					this.wdState =1;//无敌跳跃状态
					this.wdTimer = 200;
					this.user.setStyle({opacity:.8,"filter":"alpha(opacity=60)"});
				}
			}
		},
		runGame:function(){		
			this.moveBack();
			this.checkLife();
			this.checkLevel();
			this.createMonster();
			//this.MoveMonster();
			this.moveUser();
			this.playUser();
			this.testShoot();
		},
		testShoot:function(){			
			var _self = this;
			JY.resolve(function(v,i){
				this.x += this.svx;
				this.y += this.svy;
				this.setPosition(this.x,this.y);
				if (JY.hits(this,_self.user) ){
					if(_self.userState != 0){
						_self.score+=100;
						if (this.data==_self.shootCount.type&&_self.shootCount.count<3){
							_self.shootCount.count++;
							_self.formatShoot();
						}else if (this.data!==_self.shootCount.type){
							_self.shootCount.type = this.data;
							_self.shootCount.count = 1;
							_self.formatShoot();
						}
					}else if (_self.wdState==0)
					{
						_self.life--;
					}else{
						_self.score+=100;
					}
					b.removeChild(v);
					delete _self.shootArr[i];
				}

				if (this.x < 0||this.x > JY.width(b.stage) || this.y <0 || this.y >  JY.height(b.stage) ){
					b.removeChild(v);
					delete _self.shootArr[i];
				}
			},0,_self.shootArr.length,_self.shootArr);
		},
		MoveMonster:function(){
			var _self = this;
			JY.resolve(function(v,i){
				v.move(_self.shootArr).dispose(function(){
					b.removeChild(_self.monsterArr[i]);
					delete _self.monsterArr[i];
				});
				if (JY.hits(_self.user,this))	{
					if (this.type == 1)
					{
						//fix
						if (  _self.wdState ==0)
						{
							_self.life--;
						}else{
							_self.score +=300;
						}
					}
					if (this.type == 2)
					{
						if (_self.userState!=0||_self.wdState ==1)
						{
							_self.score +=300;
						}else{
							_self.life --;
						}
					}
					b.removeChild(_self.monsterArr[i]);
					delete _self.monsterArr[i];
				}
			},0,_self.monsterArr.length,_self.monsterArr);
		},
		moveBack:function(){
			 JY.css(JY.parent(b.stage),{backgroundPosition:"0 "+this.by+"px"});
			 this.by += this.mapSpeed;
			 if( this.by>JY.height(b.stage)){
				 this.by=0;
			 };
			 this.MoveMonster();
		},
		createMonster:function(){			
			var chance = Math.floor(Math.random()*100);
			if(this.counter +this.level*10> 50+chance){
				var monster ;
				var rnd = Math.floor(Math.random()*100);
				if (rnd >30){
					monster = new this.monsterType[0]();
				}else{					
					monster = new this.monsterType[1]();
				}
				monster.vx = this.mapSpeed;
				monster.vy = this.monsterSpeed;
				monster.range ={x:{min:0,max:JY.width(b.stage)-monster.width},y:{min:0,max:JY.height(b.stage)}};
				monster.game = b;
				monster._init();
				b.addChild(monster);
				this.monsterArr.push(monster);
				this.counter=0;
			}
			this.counter++;
		},
		createUser:function(){		
			this.user = new Sprite(71,60,{"border":"none","background":"url(images/run/run.png) no-repeat"});
			this.user.init();
			b.addChild(this.user);
			this.user.setPosition(0,JY.height(b.stage)-this.user.height);
		},
		moveUser:function(){
			if (this.isJump){
				this.mapSpeed=8;
				if (this.animateUserFor==1){
					var x = this.user.x + this.jumpSpeed ;
					this.user.setPosition(x);
				}else{
					var x = this.user.x - this.jumpSpeed ;
					this.user.setPosition(x);
				}
				if (this.user.x <=0 || this.user.x >= JY.width(b.stage)-this.user.width){
					this.isJump = false;
					this.mapSpeed =6;
					this.userState =0 ;
					this.user.setStyle({"background":"url(images/run/run.png) no-repeat"});
				}
			}else if (this.user.y > JY.width(b.stage)*2/3){
					var y = this.user.y - this.mapSpeed ;
					this.user.setPosition(null,y);
			}
			if (this.wdState){
				if (this.wdTimer>0)	{
					this.wdTimer -- ;
				}else{
					//console.log('无敌结束');
					this.monsterSpeed /= 3;
					this.mapSpeed /= 3;
					this.userRunSpeed=3;
					JY.css(this.wdScreen,{display:"none"});
					JY.css(this.shootScreen,{display:"none"});					
					this.wdState =0;
					this.user.setStyle({opacity:1,"filter":"alpha(opacity=100)"});
					this.shootCount={type:"",count:0};
				}
			}
		},
		playUser:function(){	
			if (this.waiter%this.userRunSpeed==0 && this.isJump == 0){
				var x = -this.animateUserFor*71;
				var y = -this.animateNum*100-15;
				JY.css(this.user.DOM,{backgroundPosition:x+"px "+y+"px"});
				if (this.animateNum>2){
					this.animateNum=0;
				}
				this.animateNum ++;
			}
			this.waiter++;
		},
		BindEvent:function(){
			JY.bind(document,"keydown",JY.proxyFunc(this.listenEvent,this));
			//JY.bind(b.stage,"click",JY.proxyFunc(this.listenEvent,this));
			JY.bind(b.stage,"mousedown",JY.proxyFunc(this.listenEvent,this));
		},
		listenEvent:function(e){
			if (this.isJump==0){
				this.jump();
			}
		},
		disposeEvent:function(){
			JY.unbind(document,"keydown",JY.proxyFunc(this.listenEvent,this));
			JY.unbind(b.stage,"click",JY.proxyFunc(this.listenEvent,this));
			JY.unbind(b.stage,"mousedown",JY.proxyFunc(this.listenEvent,this));
		},
		jump:function(){
			this.isJump=1;
			this.userState==0?this.userState = 1:null;
			this.user.setStyle({"background":"url(images/run/jump.png) 0 0 no-repeat"});
			if(this.animateUserFor	===0){
				this.animateUserFor=1;
				JY.css(this.user.DOM,{backgroundPosition:"0 -67px"});
			}else{
				this.animateUserFor=0;
				JY.css(this.user.DOM,{backgroundPosition:"0 0px"});
			}
		},
		checkLevel:function(){
			b.scoreScreen.innerHTML = "得分："+ this.score;
			if (this.score/this.level>1000){
				this.level++;
				this.mapSpeed++;
				this.monsterSpeed++;
			}
		},
		checkLife:function(){
			if (this.life<=0){
				b.gameOverScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;width:500px;margin:0 auto;"><h1>您的得分是：<strong>'+this.score+'</strong> 分</h1><p>点击重新开始游戏</p><p>更多游戏请<a href="http://www.lovewebgames.com">点击这里</a></p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
				this.disposeEvent();
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
			this.titleScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;margin:0 auto;"><h1>极速奔跑跳跃</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;width:300px;margin:0 auto;"><h1>极速奔跑跳跃</h1><p>点击开始游戏</p><p>按键英雄跳跃<a href="http://www.lovewebgames.com" target="_blank">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#555;width:100px;float:right;" id="scoreScreen"></div>');
			
			var loading = JY.convertDOM('<p style="font-size:12px;">资源正在加载中。。。</p>');
			this.addChild(loading);
			var _self = this;
			JY.loadFile("images/run/fixMonster.png,images/run/fixshoot.png,images/run/jump.png,images/run/moveMonster.png,images/run/moveshoot.png,images/run/run.png","image",function(){
				_self.removeChild(loading);
		   });
			//g.newGame();
		}
	});
	var  b=new WordGame;
	JY.loadFile ("Monster.js","script",function(){
		b.init();
	});
if (location.host !=="www.lovewebgames.com"&&location.hostname !=="localhost" && location.host !="jsjy.cloudfoundry.com"){
	location.href="http://www.lovewebgames.com";
}