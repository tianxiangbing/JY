//------------------------
//模块检查
if(window.JCloudisk){
	try{ delete window.JCloudisk; } catch (e){ window.JCloudisk = undefined; }
}
(function(window, undefined){
	"use strict"
	
	var _doc = document, _times, _style, 
		_body = _doc.body || _doc.getElementsByTagName( 'body' )[ 0 ], 
		_host = window.location.protocol + "//" + window.location.host, 
		_IE6 = (function(){
			var div = _doc.createElement('div'), s;
			div.innerHTML = '<!--[if IE 6]><s></s><![endif]-->';
	    	s = div.getElementsByTagName('s');
			if(s.length > 0) return true;
			return false;
		})();
	
	var cloudisk = { 
		title: '欢迎使用迷你淘云盘 - <span style="font-weight:100">便捷，可靠的云端硬盘</span>', 
		number:0, 
		wdState: false, 
		bindEvents: {}, 
		config: {
			width 			: 940, 
			height			: 490, 
			zIndex			: 9999, 
			
			appurl			: 'http://yunpan.alibaba-inc.com', 
			code			: 0, 
			choice			: 0, 
			appkey			: 'minitest', 
			debug			: 0, 
			preview			: 1, 
			upload			: 0, 
			tabs			: 1
		}
		
		//获取随机数
		,now: Date.now || function () {
            return +new Date();
        }
		
		//日志
		,log: function(msg, cat, src) {
			if(cloudisk.config.debug){
				if (src) {
					msg = src + ': ' + msg;
				}
				if (typeof console !== 'undefined' && console.log) {
					console[cat && console[cat] ? cat : 'log'](msg);
				}
			}
		}
		
		//字符串转为JSON
		,parseJSON: function( data ) {
			if ( typeof data !== "string" || !data ) {
				return null;
			}
			
			var chars = /^[\],:{}\s]*$/,
				escape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
				tokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
				braces = /(?:^|:|,)(?:\s*\[)+/g;
			
			if ( chars.test(data.replace(escape, '@').replace(tokens, ']').replace(braces, '')) ) {
				return window.JSON && window.JSON.parse ?
					window.JSON.parse( data ) :
					(new Function('return ' + data))();
			} else {
				throw 'Invalid JSON: ' + data ;
			}
		}
		
		//添加事件
		,addEvent: function (obj, name, callback, capture){
			capture = !!capture;
			if (obj.addEventListener){
				obj.addEventListener(name, callback, capture);
			}else if(obj.attachEvent){
				obj.attachEvent('on' + name, callback);
			}
		}
		
		//删除事件
		,detach: function (obj, name, callback, capture){
			capture = !!capture;
			if(obj.removeEventListener){
				obj.removeEventListener(name, callback, capture);
			}else if(obj.detachEvent){
				obj.detachEvent('on' + name, callback);
			}
		}
		
		//自定义事件绑定
		,bind: function (obj, name, callback){
			if(obj.nodeType !== 1) return false;
			var root = cloudisk, id = obj.getAttribute('_cloudisk_id');
			if(id) {
				root.bindEvents[id][name] = callback;
				return;
			}
			id = root.now()+(root.number++);
			obj.setAttribute('_cloudisk_id', id);
			root.bindEvents[id] = {};
			root.bindEvents[id][name] = callback;
		}
		
		//执行对象绑定的事件
		,trig: function (obj, name, data){
			if(obj.nodeType !== 1) return false;
			var root = cloudisk, id = obj.getAttribute('_cloudisk_id')||0;
			if(typeof root.bindEvents[id] === 'object' && root.bindEvents[id][name]) {
				root.bindEvents[id][name].apply(obj, [data]);
			}
		}
		
		//准备就绪
		,ready: function( callback ){
			var root = this;
			if ( !_doc.readyState || /loaded|complete/.test( _doc.readyState ) ) { 
				if(callback) callback.call(root);
				return;
		    }
			window.onload = window.onreadystatechange = function(){
				if ( !_doc.readyState || /loaded|complete/.test( _doc.readyState ) ) { 
					if(callback) callback.call(root);
					return;
				}
			};
		}, 
		
		//初始化------------------------------------------
		__init: function(){
			var root = this, CF = this.config, k, msg=[], 
			gb = {
				width		: 'CLOUDISK_CF_WIDTH', 
				height		: 'CLOUDISK_CF_HEIGHT', 
				zIndex		: 'CLOUDISK_CF_ZINDEX', 
				appurl		: 'CLOUDISK_CF_APPURL', 
				code		: 'CLOUDISK_CF_CODE', 
				choice		: 'CLOUDISK_CF_CHOICE', 
				appkey		: 'CLOUDISK_CF_APPKEY', 
				debug		: 'CLOUDISK_CF_DEBUG', 
				preview		: 'CLOUDISK_CF_PREVIEW', 
				upload		: 'CLOUDISK_CF_UPLOAD', 
				tabs		: 'CLOUDISK_CF_TABINDEX'
			};
			
			for(k in gb){
				if(typeof window[gb[k]] !== 'undefined'){
					CF[k] = (window[gb[k]] === true ? 1 : (window[gb[k]] === false ? 0 : window[gb[k]]));
				}else{
					msg.push(gb[k]);
				}
			}
			
			if(msg.length > 0) cloudisk.log('The "'+msg.join(',')+'" config is null', 'warn');
			msg = k = undefined;
			
		    var cssText =
		        '.cloudisk-dialog{ width:0px; height:0px; position:'+(_IE6 ? 'absolute' : 'fixed')+'; background:#FFF;' +
		        	'z-index:'+CF.zIndex+'; border:#ACACAC 1px solid; -moz-box-shadow:rgba(0,0,0,0.2) 3px 3px 5px;' +
					'-webkit-box-shadow:rgba(0,0,0,0.2) 3px 3px 3px; box-shadow:rgba(0,0,0,0.2) 3px 3px 5px; }' + 
				'.cloudisk-dialog-head{height:36px; background:#F9F9F9; border-bottom:#EBEBEB 1px solid; color:#666;' + 
					'font:bold 14px/36px Arial, Helvetica, sans-serif; padding-left:20px; overflow:hidden; }' + 
				'.cloudisk-dialog-body{height:'+(CF.height-37)+'px; overflow:hidden; background:url("'+CF.appurl+'/assets/mini/stylesheet/image/require-loading.gif") no-repeat center center;}' + 
				'.cloudisk-close{display:block;width:14px;height:14px;text-decoration:none; position:absolute; top:11px; right:11px;' + 
					'background:url("'+CF.appurl+'/assets/mini/stylesheet/image/x.gif") no-repeat center center;cursor:pointer;}' + 
				'.cloudisk-close:hover{text-decoration:none;}' + 
				'.cloudisk-mask{ width:100%;height:'+(_IE6 ? _doc.documentElement.offsetHeight +'px' : '100%')+'; position:'+(_IE6 ? 'absolute' : 'fixed')+';' + 
					'background:#000;opacity:0.2;filter:alpha(Opacity=0.2); top:0; left:0; right:0; bottom:0; z-index:'+(CF.zIndex-1)+'; }';
					
			if(_style) { _style.parentNode.removeChild(_style); }
			
			_style = document.createElement('style');
			_style.type = "text/css";
			if (_style.styleSheet) {  // IE
		        _style.styleSheet.cssText = cssText;
		    } else {
		        _style.textContent = cssText;
		    }
		    document.getElementsByTagName('head')[0].appendChild(_style);
		}
		
		,chooserUrl: function() {
			var CF = this.config, param = [];
			param.push('origin='+encodeURIComponent(_host));
			param.push('choice='+CF.choice);
			param.push('key='+CF.appkey);
			param.push('preview='+CF.preview);
			param.push('debug='+CF.debug);
			param.push('upload='+CF.upload);
			param.push('tabs='+CF.tabs);
			param.push('code='+CF.code);
			
	    	return CF.appurl + '/mini/?' + param.join('&');
		}
		
		,position: function(){
			if(!cloudisk.outer && cloudisk.outer.nodeName !== 'div') return;
			
			cloudisk.outer.style.width = cloudisk.config.width+'px';
			cloudisk.outer.style.height = cloudisk.config.height+'px';
			
			var left = _doc.documentElement.clientWidth/2;
				left = left - cloudisk.outer.offsetWidth/2;
				left = left < 0 ? 0 : left;
			var top = _doc.documentElement.clientHeight/2;
				top = top - cloudisk.outer.offsetHeight/2;
				top = top < 0 ? 0 : top;
			
			if(_IE6){
				left += _body.scrollLeft;
				top += _body.scrollTop;
			}
			
			cloudisk.outer.style.left = left+'px';
			cloudisk.outer.style.top = top+'px';
		}
		
		,handleMessage: function(evt, callback) {
			var data = this.parseJSON(evt.data), 
				obj = evt.targetElement;
			
			switch(data.xcmd){
				case 'success':	
					this.trig(obj, 'CDChooseSuccess', data.data);
					if (callback) callback();
					cloudisk.log('OK designated to receive!','info');
					break;
				case 'cancel':
					this.trig(obj, 'CDChooseCancel');
					if (callback) callback();
					if (window.JCloudisk) {
						window.JCloudisk.uploadStatus = 'cancel';
					}
					cloudisk.log('Unassign receive success!','info');
					break;
				case 'uploadStart': 
					if (window.JCloudisk) {
						window.JCloudisk.uploadStatus = 'start';
					}
					break;
				case 'chooseCallback': 
					this.trig(obj, 'CDChooseCallback', data.data);
					break;
				case 'uploadFile': 
					this.trig(obj, 'CDUploadFile', data.data);
					break;
				case 'uploadProgress': 
					if (window.JCloudisk) {
						window.JCloudisk.uploadStatus = 'procedure';
					}
					this.trig(obj, 'CDUploadProgress', data.data);
					break;
				case 'uploadComplete': 
					if (window.JCloudisk) {
						window.JCloudisk.uploadStatus = 'complete';
					}
					this.trig(obj, 'CDUploadComplete', data.data);
					break;
			}
		}
		
		,dialogDom: function( ele ){
			var oHead = _doc.createElement('div');
				oHead.className = 'cloudisk-dialog-head';
				oHead.innerHTML = cloudisk.title;
			var oBody = _doc.createElement('div');
				oBody.className = 'cloudisk-dialog-body';
				if(ele) oBody.appendChild(ele);
			var oClose = _doc.createElement('a');
				oClose.className = 'cloudisk-close';
				oClose.href = 'javascript:;';
			var outer = _doc.createElement('div');
				outer.className = 'cloudisk-dialog';
				outer.appendChild(oHead);
				outer.appendChild(oBody);
				outer.appendChild(oClose);
			var mask = _doc.createElement('div');
				mask.className = 'cloudisk-mask';
			
			cloudisk.outer = outer;
			cloudisk.oClose = oClose;
			
			return {
				create: function(){
					_body.appendChild(outer); 
					_body.appendChild(mask); 
				}, 
				remove: function(){
					outer.parentNode.removeChild(outer); 
					mask.parentNode.removeChild(mask);
				}
			};
		}
		
		,check: function( target ){
			if(!this.config.appurl && !this.config.code && !this.config.appkey) {
				alert('Error: "JCloudisk" Missing configuration! :(');
				return false;
			}
			if(!target && target.nodeType !== 1) {
				alert('Error: The "JCloudisk.embed" function missing "targetElement" parameters! :(');
				return false;
			}
			if(target.wdState) return false;
			
			return true;
		}

		,clear: function( target ){
			if(!this.check(target)) return;
			if (window.JCloudisk) {
				window.JCloudisk.uploadStatus = 'waiting';
			}
			if(target.iframeElem) {
				target.iframeElem.src = this.chooserUrl();
				return;
			}
		}
		
		,embed: function( target ){
			if(!this.check(target)) return;
			if(target.iframeElem) {
				target.iframeElem.src = this.chooserUrl();
				return;
			}
			
			var root = cloudisk, CF = root.config, post = window.postMessage;
			var iframe = _doc.createElement('iframe');
				iframe.src = root.chooserUrl();
				iframe.marginWidth = iframe.marginHeight = iframe.frameBorder = 0;
				iframe.style.cssText = 'width:100%;height:100%;background:#FFF;visibility:'+(_IE6 ? 'visible' : 'hidden')+';';

			var handler = post ? function(evt) {
					if (evt.source == iframe.contentWindow) {
						evt.targetElement = target;
						root.handleMessage(evt);
					}
				} : function(evt) {
					if ( !iframe.readyState || /loaded|complete/.test( iframe.readyState ) ) {
						clearInterval(_times);
						_times = setInterval(function(){
							if((evt.data = window.name) && evt.data.indexOf(_host) !== -1){
								// clearInterval(_times);
								evt.targetElement = target;
								root.handleMessage(evt);
								window.name = '';
							}
						}, 10);
					}
				};
				
			//绑定通信处理事件
			if(post){
				root.addEvent(window, 'message', handler);
			}else{
				root.addEvent(iframe, 'load', handler);
			}

			root.addEvent(iframe, 'load', function(){
				if ( !iframe.readyState || /loaded|complete/.test( iframe.readyState ) ) {
					root.trig(target, 'CDDialogLoad');
				}else{
					root.trig(target, 'CDDialogError');
				}
			});
			
			!_IE6 && root.addEvent(iframe, 'load', function(){
				iframe.style.visibility = 'visible';
			});
			
			target.iframeElem = iframe;
			target.appendChild(iframe); 
			//target.wdState = true;
		}
		
		,choose: function( target ){
			if(!this.check(target)) return;
			if(target.blur) target.blur();
			
			var root = cloudisk, CF = root.config, post = window.postMessage;
			var iframe = _doc.createElement('iframe');
				iframe.src = root.chooserUrl();
				iframe.marginWidth = iframe.marginHeight = iframe.frameBorder = 0;
				iframe.style.cssText = 'width:100%;height:100%;background:#FFF;visibility:'+(_IE6 ? 'visible' : 'hidden')+';';
			var dialog = root.dialogDom( iframe );
				dialog.create();
			
			var choose = {
				init: function(){
					target.wdState = true;
					//给窗口定位
					root.position();
					root.addEvent(window, 'resize', root.position);
					root.addEvent(window, 'scroll', root.position);
					//窗口载入完成显示
					!_IE6 && root.addEvent(iframe, 'load', function(){
						iframe.style.visibility = 'visible';
					});
					root.addEvent(iframe, 'load', function() {
						if (!iframe.readyState || /loaded|complete/.test(iframe.readyState)) {
							root.trig(target, 'CDDialogLoad');
						} else {
							root.trig(target, 'CDDialogError');
						}
					});
					//绑定ESC键关闭窗口
					choose.ESCCallback = function(event){
						var evt = event || window.event;
						if(evt.keyCode == 27) choose.destroy();
					};
					root.addEvent(document, 'keydown', choose.ESCCallback);
					//绑定右上角关闭窗口按钮
					if(cloudisk.oClose) {
						root.addEvent(cloudisk.oClose, 'click', choose.destroy);
					}
					//绑定通信处理事件
					if(post){
						root.addEvent(window, 'message', choose.handler);
					}else{
						root.addEvent(iframe, 'load', choose.handler);
					}
				}, 
				destroy: function(){
					window.clearInterval(_times);
					window.name = '';
					target.wdState = false;
					dialog.remove();
					
					if(post){
						root.detach(window, 'message', choose.handler);
					}else{
						root.detach(iframe, 'load', choose.handler);
					}
					
					root.detach(window, 'resize', root.position);
					root.detach(window, 'scroll', root.position);
					
					if(choose.ESCCallback) {
						root.detach(document, 'keydown', choose.ESCCallback);
						choose.ESCCallback = null;
					}

					iframe = undefined;
					
					root.trig(target, 'CDDialogClose');
					
					return false;
				}, 
				handler: post ? function(evt) {
					if (evt.source == iframe.contentWindow) {
						evt.targetElement = target;
						root.handleMessage(evt, choose.destroy);
					}
				} : function(evt) {
					if ( !iframe.readyState || /loaded|complete/.test( iframe.readyState ) ) {
						clearInterval(_times);
						_times = setInterval(function(){
							if((evt.data = window.name) && evt.data.indexOf(_host) !== -1){
								// clearInterval(_times);
								evt.targetElement = target;
								root.handleMessage(evt, choose.destroy);
								window.name = '';
							}
						}, 10);
					}
				}
			};

			target.iframeElem = iframe;
			
			choose.init();
			root.trig(target, 'CDDialogOpen');
		}
	};
	
	/*--开放的API-----------------------------------------------*/
	window.JCloudisk = {

		// 文件上传的状态
		// 返回状态：
		// 		开始上传 'start' 
		// 		上传中 	 'procedure'
		// 	    上传完成 'complete'
		uploadStatus: 'waiting', 

		// 初始化
		init: function(){
			if(!window.CLOUDISK_CF_CODE && !window.CLOUDISK_CF_APPKEY){
				cloudisk.ready(function(){ this.__init(); });
				return;
			}
			cloudisk.__init();
		}, 

		// 为一个dom嵌入一个云盘控件
		embed: function(o, callback){
			if(callback) cloudisk.bind(o, 'CDChooseSuccess', callback);
			cloudisk.embed(o);
		}, 

		// 为一个dom绑定弹出云盘控件
		choose: function(o, callback){
			if(callback){
				cloudisk.bind(o, 'CDChooseSuccess', callback);
				cloudisk.addEvent(o, 'click', function(){
					cloudisk.choose(o);
				});
				return;
			}
			cloudisk.choose(o);
		}, 

		// 清除一个dom绑定的云盘控件内所有已选状态
		clear: function(o){
			cloudisk.clear(o);
		}, 

		// 在窗口里点击了确定按钮trigger一个事件
		chooseSuccess: function(o, callback){
			cloudisk.bind(o, 'CDChooseSuccess', callback);
		}, 

		// 在窗口里点击了取消按钮trigger一个事件
		chooseCancel: function(o, callback){
			cloudisk.bind(o, 'CDChooseCancel', callback);
		}, 

		// 窗口打开后trigger一个事件
		dialogOpen: function(o, callback){
			cloudisk.bind(o, 'CDDialogOpen', callback);
		}, 

		// 窗口关闭后trigger一个事件
		dialogClose: function(o, callback){
			cloudisk.bind(o, 'CDDialogClose', callback);
		},

		// 窗口异步文件载入完成后trigger一个事件
		dialogLoad: function(o, callback){
			cloudisk.bind(o, 'CDDialogLoad', callback);
		},

		// 窗口异步文件载入失败后trigger一个事件
		dialogError: function(o, callback){
			cloudisk.bind(o, 'CDDialogError', callback);
		},

		// 上传队列全部完成后trigger一个事件
		uploadComplete: function(o, callback){
			cloudisk.bind(o, 'CDUploadComplete', callback);
		},

		// 上传队列当中每个文件上传完成后trigger一个事件
		uploadFile: function(o, callback){
			cloudisk.bind(o, 'CDUploadFile', callback);
		},

		// 上传队列总的上传进度trigger一个事件
		uploadProgress: function(o, callback){
			cloudisk.bind(o, 'CDUploadProgress', callback);
		}, 

		// 选中文件trigger一个事件
		chooseCallback: function(o, callback){
			cloudisk.bind(o, 'CDChooseCallback', callback);
		}
	};
	//初始化
	window.JCloudisk.init();
	
})(window);