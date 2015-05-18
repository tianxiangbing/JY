/*
*魔兽
*author: 田想兵 
*date:2013/9/17
*email:55342775@qq.com
*web:http://www.lovewebgames.com
*/
(function(win){	
	var WordGame =function(){
	};
	var game =function(){
	};
	game.prototype = new Game;
	g=new game();
	JY.extend(game.prototype,{
		newGame:function(){
			this.ropeArr = [];
			this.level = 1;
			this.speed = 0.8;
			this.userSpeed = 10 ;
			this.gravity = .2;//重力
			this.map = JY.getCtx("map");
			this.score =0;
			this.life =1;
			this.power = 10 ;//力量
			this.resistance = 5;//阻力
			this.currentLine = null;//当前绳索
			this.way = 1;//当前运动方向
			this.len = 0;
			this.angel = 90 ;
			this.RightTopPoint = 60;
			this.LeftTopPoint = 120;
			this.drawMap();
			this.createUser();
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
			this.Event();
		},
		runGame:function(){		
			if (this.currentLine){
				if (this.way ==1 ){
					this.map.clearRect(this.currentLine.s- this.currentLine.l/ 2 -5 ,0,this.currentLine.l +10 ,this.currentLine.l+5);
					if (this.angel <this.RightTopPoint ){	
						this.RightTopPoint +=this.resistance					
						this.way = -1;
					}else{
						this.angel =this.angel - this.speed ;
					};
					if (this.RightTopPoint >90){
						this.angel = 90;
					};
					var a = Math.PI * this.angel/180;
					this.map.beginPath();
					this.map.moveTo(this.currentLine.s,0);
					var x  = this.currentLine.s + Math.cos(a ) * this.currentLine.l;
					var y  =  Math.sin(a ) * this.currentLine.l;
					this.map.lineTo(x,y );
					this.user.setPosition(x- this.user.width/2,y- this.user.height );
					this.user.setStyle({background:"url(images/Tarzan/user.png) no-repeat"});
					this.map.closePath();
					this.map.stroke();
				}else{			
					this.map.clearRect(this.currentLine.s- this.currentLine.l/ 2 -5 ,0,this.currentLine.l +10 ,this.currentLine.l+5);
					if (this.angel >this.LeftTopPoint){
						this.way =1;
						this.LeftTopPoint-=this.resistance;
					};
					this.angel =this.angel +  this.speed ;			
					if (this.LeftTopPoint <90){
						this.angel = 90;
					};
					var a = Math.PI * this.angel/180;
					this.map.beginPath();
					this.map.moveTo(this.currentLine.s,0);
					var x  = this.currentLine.s + Math.cos(a ) * this.currentLine.l;
					var y  =  Math.sin(a ) * this.currentLine.l;
					this.map.lineTo(x,y );
					this.user.setPosition(x- this.user.width/2,y- this.user.height );
					this.user.setStyle({background:"url(images/Tarzan/user2.png) no-repeat"});
					this.map.closePath();
					this.map.stroke();
				}
			};
			if (this.vx >1 ){
				this.user.x += this.vx *this.way;
				this.vy += this.gravity;
				this.user.y += this.vy ;
				this.user.setPosition();
			};
			this.checkHits();
		},
		checkHits:function(){
			var _self = this;
			for (var i =  0 ; i < 5 ; i ++ ){
				var  v = _self.ropeArr[i];
				if (v == _self.currentLine){
					continue;
				};
				if (Math.abs(_self.user.x - v.s)<20 && Math .abs (_self.user.y - v.l )<20){
					_self.currentLine = v;
					return false;
				}
			}
		},
		drawMap:function(){
			for (var i = 100; i-- ; ){
				var first = this.ropeArr.slice(-1)[0] ||{s:0} ;
				var point = Math.floor(Math.random() * 150) + 150 + first.s;
				var length = Math .floor (Math.random()*300)+100;
				var obj = {s:point,l:length};
				!this.ropeArr.length ? obj.s = 5:null;
				this.ropeArr.push(obj);
				this.drawLine(obj);
			}
		},
		createUser:function(){
			this.user = new Sprite(24,24);
			this.user.setStyle({background:"url(images/Tarzan/user.png) no-repeat"});
			b.addChild(this.user);
			this.user.setPosition( this.ropeArr[0].s - this.user.width, this.ropeArr[0].l- this.user.height );
			this.currentLine = this.ropeArr[2];
			this.len = this.currentLine .l;
			this.ox  = this.currentLine .s;
		},
		Event:function(){
			var _self = this;
			JY.bind(b.stage,"mousedown", JY .proxyFunc (this.jump,_self));
			JY.bind(b.stage,"keydown",JY .proxyFunc (this.jump,_self));
		},
		jump:function(){
			this.vy =  - this.userSpeed * (this.user.x- this.ox)/this.len ;
			var tmp =Math.sqrt ( this.len* this.len - (this.user.x- this.ox)*(this.user.x- this.ox));
			this.vx =  this.userSpeed * (tmp)/this.len ;
			this.currentLine = null;
			return false;
		},
		drawLine:function(obj){
			this.map.moveTo(obj.s,0);
			this.map.strokeStyle = "#00fc00";
			this.map.lineWidth = 2;
			this.map.lineCap="round";
			this.map.lineTo(obj.s,obj.l);
			this.map.stroke();
		},
		checkLife:function(){
			if (this.life<=0){
				b.gameOverScreen=JY.convertDOM('<div style="color:#555;padding:200px 100px;width:500px;margin:0 auto;"><h1>您的最后得分是：<strong>'+this.score+'</strong>分</h1><p>点击重新开始游戏</p><div>');
				b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
			}
		}
	});
	WordGame.prototype = new JYG (JY.byId("gameboard"));
	JY.extend(WordGame.prototype,{
		init : function(){
			this.game = g;
			this.frequency =25;
			this.waitTime= 5;
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
			this.startTimer();
			/**创建欢迎界面**/
			this.titleScreen=JY.convertDOM('<div style="color:red;font-weight:bold;text-align:center;padding-top:50px;width:100%;margin:0 auto;"><h1 style="color:red;font-weight:bold;">人猿泰山-JY游戏</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="margin:0 auto;height:100%;width:640px;margin:0 auto;position:relative;"><span style="display:block;cursor:pointer;width:275px;height:110px;line-height:100px;font-family: Tahoma,宋体;text-align:center;font-size:28px;font-weight:bolder;color:#FFFFFF;top:200px;left:180px;position:absolute;">Play</span><p style="position:absolute;top:350px;left:180px;color:#0091e0;"><a href="http://www.lovewebgames.com" target="_blank" style="color:#0091e0;">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#555;width:100px;float:right;" id="scoreScreen"></div>');			
			//g.newGame();
		}
	});
	var  b=new WordGame;
	b.init();
	if (location.host !=="www.lovewebgames.com"&&location.hostname !=="localhost"){
		//location.href="http://www.lovewebgames.com";
	};
})(window);