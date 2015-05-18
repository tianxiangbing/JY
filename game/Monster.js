
	var Monster = function (){
		this.type = 0;
		this.speed = 10;
		this.game = null;
		this.direction = 0;
		this.shootSpeed = 12;
		this.shootCounter =0;
	};
	Monster.inherits(Sprite);
	Monster.method({
			move:function(shootArr){
				this.setPosition(this.vx+this.x,this.y+this.vy/1.5);
				if (this.x < this.range.x.min||this.x > this.range.x.max-this.width ){
					this.vx*=-1;
				}				
				if(this.y < this.range.y.min || this.y >  this.range.y.max){
					//this.vy*=-1;
					this.f ?this.f .call(this):null;
				};
				
				this.Attack(shootArr);
				return this;
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
	var FixedMonster = function(){
		this.type = 1;		
	};
	FixedMonster.inherits(Monster);
	FixedMonster.method({
		move:function(shootArr){
			this.setPosition(null,this.y+this.vy);
			if(this.y < this.range.y.min || this.y >  this.range.y.max){
				this.f ?this.f .call(this):null;
			};
			this.Attack(shootArr);
			return this;
		},
		structure:function(){
			var rnd = Math.random()*100;
			this.x = 0;
			if (rnd>60){
				this.x = this.range.x.max - this.width;
				this.direction= 1;
			}
			this.setPosition(this.x);
			this.setStyle({border:"0 none","background":'url(images/run/fixMonster.png) no-repeat'});
		},
		Attack:function(shootArr){			
			//var rnd = Math.floor(Math.random()*500);
			if ( this.shootCounter >30 ){
				var shoot = new Sprite(10,10,{backgroundColor:"red",background:"url(images/run/fixshoot.png)"});
				var x = this.direction ? this.range.x.max-this.width : this.width;
				var y = this.y + this.height/2;
				shoot.svx =this.direction ? -this.shootSpeed:this.shootSpeed;
				shoot.svy =this.vy/3;
				shoot.setPosition( x,y);
				shoot.data = 'red';
				this.game.addChild(shoot);
				shootArr.push(shoot);
				this.shootCounter =0 ;
			}
			this.shootCounter++;
		}
	});
	var MoveMonster = function(){
		this.vx = 0;
		this.vy = 0;
		this.range ={x:{},y:{}};
		this.type=2;
	};
	MoveMonster.inherits(Monster);
	MoveMonster.method({
		structure:function(){
			var rnd = Math.random()*100;
			this.x = 0;
			if (rnd>60){
				this.x = this.range.x.max - this.width;
				this.direction= 1;
			}
			this.setPosition(this.x);
			this.setStyle({border:"0 none","background":'url(images/run/moveMonster.png) no-repeat'});
		},
		Attack:function(shootArr){			
			//var rnd = Math.floor(Math.random()*500);
			if ( this.shootCounter >30 ){
				var shoot = new Sprite(10,10,{backgroundColor:"red",background:"url(images/run/moveshoot.png)"});
				var x = this.x+ this.width/2;
				var y = this.y + this.height;
				shoot.svx =this.direction ? -this.shootSpeed/4:this.shootSpeed/4;
				shoot.svy =+ this.shootSpeed;
				shoot.setPosition( x,y);
				shoot.data = 'blue';
				this.game.addChild(shoot);
				shootArr.push(shoot);
				this.shootCounter =0 ;
			}
			this.shootCounter++;
		}
	});

if (location.host !=="www.lovewebgames.com"&&location.hostname !=="localhost" && location.host !="jsjy.cloudfoundry.com"){
	location.href="http://www.lovewebgames.com";
}