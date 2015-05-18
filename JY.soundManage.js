
JY.soundManage={
	movieName:"",
	lastUrl :"",
	init:function(swfobjec,src,flashId,callback){
		this.movieName=flashId;
		var self = this;
		JY.loadFile(swfobjec,"script",function(){
			self.loadSWF(src,callback);
		});
	},
	loadSWF:function (src,callback){		
			var flashId = this.movieName||"playSound";
			var elem = document.createElement('div');
			JY.attr(elem ,"id",flashId);
			JY.css(elem,{width:'0px',height:'0px',"overflow":'hidden'});
			JY.append(document.body,elem);	 
			swfobject.embedSWF(src, flashId, 1, 1, "10.0.0", "",{},{},{},callback);
	},
	loaded:function(){
		this.isload = true;	
	},
	loadSound:function(str,key){
		var f  = null;
		var self = this;
		key = key||"";
		setTimeout(function(){
			if (self.thisMovie(self.movieName)){
				self.thisMovie(self.movieName).loadFile(str,key);
				self.lastUrl = str;
				//f?f.call(self):null;
				var timer = setInterval(function(){
					if (self.isload){
						clearInterval(timer);
						f?f.call(self):null;
					}
				},50);
			}
		},1000);
		return {
			done:function(t){
				f=t||f;
			}
		};
	},
	play:function(str,isLoop){	
		var self = this;	
		if (self.thisMovie(self.movieName)){
			str = str||this.lastUrl;
			isLoop = isLoop||false;
			this.thisMovie(this.movieName).onPlay(str,isLoop);
		}
		return this;
	},
	stop:function(str){
		var self = this;	
		if (self.thisMovie(self.movieName)){
			str = str||this.lastUrl;
			this.thisMovie(this.movieName).onStop(str);
		}
		return this;
	},
	thisMovie:function(movieName) {
		if (navigator.appName.indexOf("Microsoft") != -1) {
			return window[movieName];
		}else{
			return document[movieName];
		}
	}
};