/*
*糖果粉碎
*author: 田想兵 
*date:2012.11
*email:55342775@qq.com
*web:http://www.lovewebgames.com
*/
	var ZM = function(){
		this.type;
		this.posX ; 
		this.posY ;
	};
	ZM.prototype = new Sprite;
	JY.extend(ZM.prototype,{
		init:function(){
			new Sprite().init.call(this);
			this.width = 90;
			this.height = 90;
			this.setStyle({width:this.width+"px",height:this.height+"px",border:"0px solid #ccc"});
			this.setStyle({"background":"url(images/crushcandy/candy.png) no-repeat center center","cursor":"pointer"});
			switch(this.type){
				case 0:{
					this.setStyle({"backgroundPosition":"-318px -510px"});
					//this.hoverStyle = {"backgroundPosition":"-563px -150px"};
				}break;
				case 1:{
					this.setStyle({"backgroundPosition":"-229px -232px"});
				}break;
				case 2:{
					this.setStyle({"backgroundPosition":"-580px -905px"});
				}break;
				case 3:{
					this.setStyle({"backgroundPosition":"-105px -618px"});
				}break;
				case 4:{
					this.setStyle({"backgroundPosition":"-530px -440px"});
				}break;
				case 5:{
					this.setStyle({"backgroundPosition":"-184px -910px"});
				}break;
			};
			
			this.x = this.posX *90;
			this.y = this.posY*90;
			this.setPosition();
			return this;
		},
		select:function(){
			this.setStyle ({"borderColor":"#000",opacity:.6,"filter":"alpha(opacity=60)"});
			//JY.soundManage.play("select");
			return this;
		},
		reset:function(){
			this.setStyle({"borderColor":"#ccc",opacity:1,"filter":"alpha(opacity=100)"});
			return this;
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
			this.zumaArr=[];
			this.score = 0;
			this.life = 1000;
			this.level = 1;
			this.xMax = 12;
			this.yMax = 12;
			this.select = null;
			this.speed = 15;
			this.step = 90;
			this.typeCount = 6;
			this.exchangeArr = [];
			this.deleteArr=[];
			this.initZuma();
			this.setBg();
			this.selectObj1 = null;
			this.selectObj2 = null;
			this.resetPositionArr = [];
			JY.soundManage.play("bg",true);
		},
		setBg:function(){
			var rnd = parseInt(Math.random()*5);
			JY.css(b.stage,{"backgroundImage":"images/"+rnd+".jpg"});
		},
		runGame:function(){	
			this.exchangeAnimate();
			this.checkLife();
			this.checkLevel();
			this.life -- ;
			this.resetPosition();
		},
		initZuma:function(){
			for (var i=0; i<this.xMax ;i++ ){
				this.zumaArr[i]=[];
				for (var j=0; j<this.yMax  ;j++ ){
					var zm = new ZM();
					zm.posX = i ;
					zm.posY = j ;
					zm.type = Math.floor(Math.random()*this.typeCount);
					JY.innerHTML = zm.type;
					zm.init();
					b.addChild(zm);
					this.bindEvent(zm);
					this.zumaArr[i][j]=zm;
				}
			}
			this.testZuma();
		},
		bindEvent:function(zm){
			var self = this;
			JY.bind(zm.DOM,"click",function(){
				if (!self.select){
					self.select = zm.select();
					self.selectObj1  = zm;
				}else{
					if ((Math.abs( self.select.posX-zm.posX)==1 || Math.abs( self.select.posY-zm.posY)==1)&&(self.select.posX==zm.posX || self.select.posY==zm.posY) ){
						zm.select();
						self.selectObj2  = zm;
						zm.fo = {x:self.select.x,y:self.select.y,posX:self.select.posX,posY:self.select.posY};
						self.select.fo = {x:zm.x,y:zm.y,posX:zm.posX,posY:zm.posY};
						self.exchangeArr.push({a:zm,b:self.select});
						delete self.select;
					}else{
						self.select.reset();
						self.select= zm.select();
					}
				}				
			})
		},
		exchange:function(a,b){		
			var _self = this;
			var xf = 0;
			b.x = b.posX * _self.step;
			b.y = b.posY * _self.step;
			a.posX = b.posX;
			a.posX = b.posX;
			if (a.x-b.x<0){
				xf=1;
			}else if (a.x-b.x>0){
				xf=-1;
			}
			var yf = 0; 				
			if (a.y-b.y<0){
				yf=1;
			}else if (a.y-b.y>0){
				yf=-1;
			}
			a.x +=_self.speed*xf;
			a.y +=_self.speed*yf;
			if (xf===1){
				if (a.x >= b.x ){
					a.x = b.x;
					a.setPosition();
					_self.zumaArr[a.posX][a.posY]=a;
					return true;
				}
				a.setPosition();
			}
			if (xf===-1){
				if (a.x <= b.x ){
					a.x = b.x;
					a.setPosition();
					_self.zumaArr[a.posX][a.posY]=a;
					return true;
				}
				a.setPosition();
			}
			//
			if (yf===1){
				if (a.y >= b.y ){
					a.y = b.y;
					a.setPosition();
					a.posY = b.posY;
					_self.zumaArr[a.posX][a.posY]=a;
					return true;
				}
				a.setPosition();
			}
			if (yf===-1){
				if (a.y <= b.y ){
					a.y = b.y;
					a.setPosition();
					a.posY = b.posY;
					_self.zumaArr[a.posX][a.posY]=a;
					return true;
				}
				a.setPosition();
			}
			return false;
		},
		exchangeAnimate:function(){
			var _self =this;
			var tempArr = [];
			for (var i =0,l = _self.exchangeArr.length;i<l;i++){
				if (_self.exchangeArr[i] != undefined){
					tempArr.push(_self.exchangeArr[i]);
				}
			}
			_self.exchangeArr = tempArr;
			if (_self.exchangeArr.length==0){
				return false;
			}
			JY.resolve(function(v,i){		
				var a = v.a;
				var b = v.b;
				if(a&&_self.exchange(a,a.fo)){
					a.reset();
					delete v.a;
				}
				if(b&&_self.exchange(b,b.fo)){
					b.reset();
					delete v.b;
				}
				if (!v.a && !v.b){					
					_self.testZuma();
					delete _self.exchangeArr[i];
				}
			},0,_self.exchangeArr.length,_self.exchangeArr);
		},
		test:function(curItem){
			var successArr = [curItem];
			//X轴
			for (var i=curItem.posX+1,l=this.zumaArr[curItem.posX].length; i<l ;i++ ){		
				var Item = this.zumaArr[i][curItem.posY];
				if (Item&&curItem.type == Item.type && curItem != Item && !Item.isChecked){
					successArr.push(Item);
				}else{
					break;
				}
			}
			this.check(successArr);
			successArr=  [curItem];
			for (var i=curItem.posX-1; i>=0 ;i-- ){		
				var Item = this.zumaArr[i][curItem.posY];
				if (Item&&curItem.type == Item.type && curItem != Item && !Item.isChecked){
					successArr.push(Item);
				}else{
					break;
				}
			}
			
			//Y轴
			this.check(successArr);
			successArr=  [curItem];
			for (var i=curItem.posY+1,l=this.zumaArr.length; i<l ;i++ ){		
				var Item = this.zumaArr[curItem.posX][i];
				if (Item&&curItem.type == Item.type && curItem != Item && !Item.isChecked){
					successArr.push(Item);
				}else{
					break;
				}
			}
			this.check(successArr);
			successArr=  [curItem];
			for (var i=curItem.posY-1 ; i>=0 ;i-- ){		
				var Item = this.zumaArr[curItem.posX][i];
				if (Item&&curItem.type == Item.type && curItem != Item && !Item.isChecked){
					successArr.push(Item);
				}else{
					break;
				}
			}
			this.check(successArr);				
		},
		deleteCheck:function(){
			var _self =this;
			if (this.deleteArr.length>=3){
				for (var i=0,l=this.deleteArr.length; i<l ;i++ ){
					var item = this.deleteArr[i];
					item.isChecked =true;
					b.removeChild(this.deleteArr[i]);
					delete this.zumaArr[item.posX][item.posY];
					delete this.deleteArr[i];
				}
				var s=this.deleteArr.length + parseInt(this.deleteArr.length/2);
				this.score += s;
				this.life+=s;
				this.deleteArr=[];
				setTimeout(function(){
					_self.createNew.call(_self);
				},500);				
				JY.soundManage.play("shit",false);
				_self.selectObj1 = null;
			}else{
				if (_self.selectObj1 && _self.selectObj2){
					_self.selectObj1.fo = {x:_self.selectObj2.x,y:_self.selectObj2.y,posX:_self.selectObj2.posX,posY:_self.selectObj2.posY};
					_self.selectObj2.fo = {x:_self.selectObj1.x,y:_self.selectObj1.y,posX:_self.selectObj1.posX,posY:_self.selectObj1.posY};
					_self.resetPositionArr.push({a:_self.selectObj1,b:_self.selectObj2});
				}
			}
		},
		resetPosition:function(){
			var _self =this;
			var tempArr = [];
			for (var i =0,l = _self.resetPositionArr.length;i<l;i++){
				if (_self.resetPositionArr[i] != undefined){
					tempArr.push(_self.resetPositionArr[i]);
				}
			}
			_self.resetPositionArr = tempArr;
			if (_self.resetPositionArr.length==0){
				return false;
			}
			JY.resolve(function(v,i){		
				var a = v.a;
				var b = v.b;
				if(a&&_self.exchange(a,a.fo)){
					a.reset();
					delete v.a;
				}
				if(b&&_self.exchange(b,b.fo)){
					b.reset();
					delete v.b;
				}
				if (!v.a && !v.b){	
					delete _self.resetPositionArr[i];
				}
			},0,_self.resetPositionArr.length,_self.resetPositionArr);
		},
		createNew:function(){
			for (var i=0,l=this.zumaArr.length; i<l ;i++ ){
				var arr = this.zumaArr[i];
				for (var k=0,le=arr.length; k<le ;k++ ){
					var curItem = arr[k]; //当前要比较的项
					if (!curItem){
						var zm = new ZM();
						zm.posX = i ;
						zm.posY = k ;
						zm.type = Math.floor(Math.random()*5);
						JY.innerHTML = zm.type;
						zm.init();
						b.addChild(zm);
						this.bindEvent(zm);
						this.zumaArr[i][k]=zm;
					}
				}
			}
			this.testZuma();
		},
		check:function(successArr){
			if (successArr.length>=3){
				/*for (var i=0,l=successArr.length; i<l ;i++ ){
					successArr[i].isChecked =true;
					b.removeChild(successArr[i]);
					delete successArr[i];
				}*/
				this.deleteArr=this.deleteArr.concat(successArr);
			}else{
			}
			successArr=[];
		},
		testZuma:function(){
			for (var i=0,l=this.zumaArr.length; i<l ;i++ ){
				var arr = this.zumaArr[i];
				for (var k=0,le=arr.length; k<le ;k++ ){
					var curItem = arr[k]; //当前要比较的项
					if (curItem&&!curItem.isChecked){
						this.test(curItem);
					}
				}
			}
			this.deleteCheck();
			//this.test( this.zumaArr[0][0]);
		},
		checkLevel:function(){
			b.scoreScreen.innerHTML = "时间："+this.life+" 得分："+ this.score;
			if (this.score/this.level>100){
				this.setBg();
				this.typeCount++;
				this.lifeTimer++;
			}
		},
		checkLife:function(){
			if (this.life<=0){
				
				var _this  = this;
				var maxScore = parseInt(JY.cookie("dungeonScore")) || 0;
				maxScore = Math.max(maxScore,this.score);
				JY.cookie("dungeonScore",maxScore,30);
				b.gameOverScreen=JY.convertDOM('<div style="color:blue;width:100%;height:100%;position:relative;color:#FFFFFF;background:url(images/crushcandy/main_menu.png) no-repeat;margin:0 auto;"><div style="position:absolute;top:350px;left:280px;"><h1>您的最后得分是 <strong>'+this.score+'</strong> 分</h1><p>历史最高得分是:<b>'+maxScore+'</b>分</p><p>继续加油吧,点击重新开始游戏</p><p>更多游戏请<a href="http://www.lovewebgames.com">点击这里</a></p></div><div>');
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
			this.titleScreen=JY.convertDOM('<div style="color:red;font-weight:bold;text-align:center;padding-top:50px;width:100%;margin:0 auto;"><img src="images/crushcandy/loading_logo.png"/><h1 style="color:red;font-weight:bold;">糖果粉碎-JY游戏</h1></div>');
			this.InstructionsScreen=JY.convertDOM('<div style="margin:0 auto;background:url(images/crushcandy/main_menu.png) no-repeat;height:100%;width:100%;position:relative;"><span style="display:block;cursor:pointer;width:275px;height:110px;background:url(images/crushcandy/level_menu.png) -341px -434px no-repeat;line-height:100px;font-family: Tahoma,宋体;text-align:center;font-size:28px;font-weight:bolder;color:#FFFFFF;top:350px;left:280px;position:absolute;">Play</span><p style="position:absolute;top:450px;left:280px;"><a href="http://www.lovewebgames.com" target="_blank" style="color:#fff797;">作者：田想兵55342775@qq.com</a></p></div>');
			this.scoreScreen = JY.convertDOM('<div style="color:#FFF;width:200px;float:right;font-weight:bold;position:absolute;z-index:2;right:0;" id="scoreScreen"></div>');
			
			JY.delegate(JY.byId('gameboard'),"a","mousedown",function(e){
				location.href = JY.attr(e.target,"href");
			});
			var loading = JY.convertDOM('<p style="font-size:12px;color:#EEE;">资源正在加载中。。。</p>');
			this.addChild(loading);
			var _self = this;
		    JY.loadFile("images/crushcandy/candy.png,images/crushcandy/main_menu.png,images/crushcandy/loading_logo.png","image",function(){
				_self.removeChild(loading);
		    });
			JY.loadFile("../scripts/JY.cookie.js","script",function(){});
			
			JY.soundManage.init("/scripts/swfobject.min.js","/scripts/flash/playSound.swf","playSound",function(){
				JY.soundManage.loadSound("sound/zuma/bg.mp3","bg");
				JY.soundManage.loadSound("sound/zuma/shit.mp3","shit");
			});
		}
	});
	var  b=new WordGame;
	b.init();
	
if (location.host !=="www.lovewebgames.com"&&location.host !=="localhost" && location.host !="jsjy.cloudfoundry.com"){
	location.href="http://www.lovewebgames.com";
}