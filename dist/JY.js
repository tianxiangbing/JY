/*!
 * JY javascript库，版本号：1.0
 * http://www.lovewebgames.com
 * Copyright 2012, 田想兵
 * Email : yoooyeeey@163.com
 * QQ:55342775
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Date: 2012/7/11
 */

(function(win) {
	var JY = {};
	var readyList = [];
	var _ie = document.all ? true : false;
	var n = 0;
	var aps = Array.prototype.slice;
	var doc = document;
	//*正则*/
	var spaceRex = / +/,
		trimLeft = /^[\s\xA0]+/,
		trimRight = /[\s\xA0]+$/,
		domRex = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/;
	splitRex = /(\.\w+)|(\[\w+=[\"\']\w+[\"\']\])/,
		attrRex = /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/;
	JY = JY.prototype = {
		byId: function(id, doc) {
			return ((typeof id == "string") ? (doc || document).getElementById(id) : id) || null;
		},
		getCtx: function(id, doc) {
			if (!this.byId(id, doc).getContext) {
				alert('您的浏览器不支持html5元素，请更换浏览器，推荐使用360极速或谷歌或ie9以上版本的浏览器内核.');
			};
			return this.byId(id, doc).getContext("2d") || null;
		},
		//**事件延迟加载*/
		//****绑定事件****/
		bind: function(target, eventType, handle) {
			/*
			if(target.addEventListener){
				this.bind=function(target,eventType,handle){
					target.addEventListener(eventType,handle,false);
				}
			}else{
				this.bind=function(target,eventType,handle){
					target.attachEvent("on"+eventType,handle);
				}
			};
			this.bind(target,eventType,handle);
			*/
			target = JY.byId(target);
			JY.event.add(target, eventType, handle);
			return JY;
		},
		unbind: function(target, eventType, handle) {
			/*
			if(target.removeEventListener){
				this.unbind=function(target,eventType){
					target.removeEventListener(eventType,handle,false);
				}
			}else{
				this.unbind=function(target,eventType){
					target.detachEvent("on"+eventType,handle);
				}
			};
			this.unbind(target,eventType);
			*/
			target = JY.byId(target);
			JY.event.remove(target, eventType, handle);
			return JY;
		},
		one: function(target, eventType, handle) {
			target = JY.byId(target);
			JY.event.add(target, eventType, handle, "one");
			return JY;
		},
		on: function(trigger, eventType, selector, handle) {
			if (typeof selector == "function") {
				handle = selector;
				JY.event.add(trigger, eventType, handle);
			} else if (typeof eventType == "string") {
				JY.event.add(trigger, eventType, handle, "delegate", selector);
			}
			return JY;
		},
		off: function(trigger, eventType, selector, handle) {
			var type = '';
			if (typeof selector == "function") {
				handle = selector;
			} else {
				if (typeof selector == 'string') {
					type = 'delegate';
				}
			}
			JY.event.remove(trigger, eventType, handle, type, selector);
			return JY;
		},
		//为所有选择器匹配的元素附加一个处理一个或多个事件，现在或将来，基于一组特定的根元素。
		//父节点是trigger，目标节点是selector
		delegate: function(trigger, selector, eventType, handle) {
			JY.event.add(trigger, eventType, handle, "delegate", selector);
			return JY;
		},
		undelegate: function(trigger, selector, eventType, handle) {
			target = JY.byId(trigger);
			JY.event.remove(trigger, eventType, handle);
			return JY;
		},
		live: function(target, eventType, handle) {
			JY.event.add(document, eventType, handle, "delegate", target);
			return JY;
		},
		ready: function(func) {
			readyList.push(func);
			if (_ie) {
				JY.unbind(document, "readystatechange", JY.DOMContentLoaded);
				JY.bind(document, "readystatechange", JY.DOMContentLoaded);
			} else {
				JY.bind(win, "DOMContentLoaded", JY.DOMContentLoaded);
			};
			return JY;
		},
		_startReady: function() {
			for (var i = 0, len = readyList.length; i < len; i++) {
				setTimeout(readyList[i], 25);
			};
			return JY;
		},
		DOMContentLoaded: function(func) {
			if (_ie) {
				if (document.readyState === "complete" || document.readyState === "interactive") {
					JY.unbind(document, "readystatechange", JY.DOMContentLoaded);
					JY._startReady();
				}
			} else {
				JY.unbind(win, "DOMContentLoaded", JY.DOMContentLoaded);
				JY._startReady();
			};
			return JY;
		},
		//查找元素父级节点
		parent: function(elem) {
			elem = JY.byId(elem);
			var p = elem.parentNode;
			return p && p.nodeType !== 11 ? p : null;
		},
		//查找当前元素的子级
		child: function(elem) {
			elem = JY.byId(elem);
			var n = elem.firstChild;
			var r = new List();
			for (; n; n = n.nextSibling) {
				if (n.nodeType === 1 && n !== elem) {
					r.push(n);
				}
			};
			return r;
		},
		//查找相邻元素(后面)
		next: function(elem) {
			return this._brother(elem, "nextSibling");
		},
		//查找相领前面元素
		prev: function(elem) {
			return this._brother(elem, "previousSibling");
		},
		//第一个子级节点
		first: function(elem) {
			elem = JY.byId(elem).firstChild;
			return (elem && elem.nodeType != 1) ? this.next(elem) : elem;
		},
		// 最后一个子级节点
		last: function(elem) {
			elem = JY.byId(elem).lastChild;
			return (elem && elem.nodeType != 1) ? this.prev(elem) : elem;
		},
		_brother: function(elem, position) {
			elem = JY.byId(elem);
			do {
				elem = elem[position];
			}
			while (elem && elem.nodeType != 1);
			return elem;
		},
		//设置或获取节点样式
		css: function(elem, name, value) {
			elem = JY.byId(elem);
			if (typeof name === "object") {
				for (var i in name) {
					this.css(elem, i, name[i]);
				}
				return this;
			} else {
				if (value) {
					return JY._assign(elem, name, value, 'style');
				} else {
					return JY.curCss(elem, name);
				}
			}
		},
		curCss: function(elem, name) {
			if (doc.defaultView) {
				this.curCss = function(elem, name) {
					return doc.defaultView.getComputedStyle(elem, null)[name];
				};
				return this.curCss(elem, name);
			} else {
				this.curCss = function(elem, name) {
					return elem.currentStyle ? elem.currentStyle[name] : elem.style[name];
				};
				return this.curCss(elem, name);
			}
		},
		//获取或设置属性置
		attr: function(elem, name, value) {
			elem = JY.byId(elem);
			return JY._assign(elem, name, value, 'attribute');
		},
		_assign: function(elem, name, value, func) {
			if (!elem) {
				return this;
			}
			if (typeof name === "string") {
				if (typeof value !== "undefined") {
					func === "style" ? elem[func][name] = value : elem.setAttribute(name, value);
				} else {
					return (func === "style" ? elem[func][name] : elem.getAttribute(name)) || "";
				}
			} else {
				for (var i in name) {
					JY._assign(elem, i, name[i], func);
				}
			}
		},
		//隐藏节点
		hide: function(elem) {
			elem = JY.byId(elem);
			JY.css(elem, "display", "none");
			return this;
		},
		//显示节点
		show: function(elem) {
			elem = JY.byId(elem);
			JY.css(elem, "display", "block");
			return this;
		},
		//*继承扩展对象*/
		extend: function() {
			var target = arguments[0] || {};
			var obj = arguments[1];
			if (typeof target == "function") {
				target = target.prototype;
			}
			if (typeof obj === "object") {
				for (var i in obj) {
					target[i] = obj[i];
				}
				if (arguments.length > 2) {
					arguments.callee.apply(this, [target].concat(aps.call(arguments, 2)));
				}
			}
			return target;
		},
		//*样式类*/
		addClass: function(elem, cls) {
			elem = JY.byId(elem);
			if (!elem) {
				return this;
			}
			if (elem.addClass) {
				elem.addClass(cls);
			} else
			if (!JY.hasClass(elem, cls)) {
				var tempCls = JY.attr(elem, "class");
				tempCls = tempCls ? (tempCls + " " + cls) : cls;
				JY.attr(elem, "class", tempCls);
			};
			return elem;
		},
		//判断是否有class
		hasClass: function(elem, cls) {
			var elem = JY.byId(elem);
			if (elem.hasClass) {
				return elem.hasClass(cls);
			} else {
				var tmpCls = JY.attr(elem, "class");
				var re = new RegExp("\\b" + cls + "\\b");
				return re.test(elem.className);
				/*
				var cls_list = tmpCls?tmpCls.split(spaceRex):[];
				var isCls = false;
				for (var i =cls_list.length-1; i>=0 ;i-- ){
					if (cls_list[i]===cls){
						isCls = true;
					}
				}
				return isCls;*/
			}
		},
		//根据class查找节点列表List
		byClass: function(cls, parent, isArr) {
			if (doc.getElementsByClassName) {
				return isArr ? Array.prototype.slice.call(doc.getElementsByClassName(cls)) : List.prototype.init.call(null, doc.getElementsByClassName(cls));
			};
			if (parent) {
				parent = JY.byId(parent).childNodes;
			} else {
				parent = doc.getElementsByTagName("*");
			};
			var re = new RegExp('\\b' + cls + '\\b');
			var list = isArr ? [] : new List();
			var item = null;
			for (var i = 0, l = parent.length; i < l; i++) {
				item = parent[i];
				if (JY.hasClass(item, cls)) {
					list.push(item);
				}
			};
			return list;
		},
		//删除样式类
		removeClass: function(elem, cls) {
			elem = JY.byId(elem);
			if (!elem) {
				return this;
			}
			var classlist = JY.attr(elem, "class").split(spaceRex);
			var tmp = [];
			for (var i = 0; i < classlist.length; i++) {
				if (classlist[i] !== cls) {
					tmp.push(classlist[i]);
				}
			};
			JY.attr(elem, "class", tmp.join(" "));
			return this;
		},
		//根据tagName获取节点列表List
		byTag: function(tag, context, isArr) {
			//return List.prototype.init.call(null,doc.getElementsByTagName(tag));
			context = context || doc;
			var arr = context.getElementsByTagName(tag);
			//arr =isArr ? Array.prototype.slice.call(arr) : JY.makeArr(arr);
			arr = JY.makeArr(arr);
			return arr;
		},
		hover: function(elem, mouseover, mouseout) {
			JY.bind(elem, "mouseover", function() {
				mouseover ? mouseover.call(elem) : null;
			}).bind(elem, "mouseout", function() {
				mouseout ? mouseout.call(elem) : mouseover.call(elem);
			});
			return this;
		},
		//根据css3查找节点列表List
		query: function() {
			return this.makeArr(this._query.apply(this, arguments));
		},
		_query: function(queryStr, context, tmpList) {
			context = context || doc;
			if (doc.querySelectorAll) {
				return context.querySelectorAll(queryStr);
			} else {
				tmpList = tmpList || [];
				var matchArr = queryStr.split(spaceRex);
				var f = matchArr.shift();
				if (f) {

					var filter = f.split(splitRex);
					f = filter[0];
					var match = domRex.exec(f);
					//标签查询
					if (match[1]) {
						tmpList = tmpList.concat(JY.byTag(f, context, 1));
						//类查询
					} else if (match[2]) {
						tmpList = tmpList.concat(JY.byClass(match[2], context, 1));
					} else if (match[3]) {
						tmpList = tmpList.concat(JY.byId(match[3], context));
					};
					var tmpArr = [];
					for (var j = 0, len = matchArr.length; j < len; j++) {
						tmpArr = [];
						for (var i = 0, l = tmpList.length; i < l; i++) {
							tmpArr = tmpArr.concat(arguments.callee(matchArr.join(" "), tmpList[i]));
						}
					};
					tmpList = tmpArr.length == 0 ? tmpList : tmpArr;
				};
				return tmpList;
			}
		},
		/*
		_query:function(queryStr , context , tmpList){	
			var match=domRex.exec(queryStr);
			tmpList = tmpList||new List;
			//标签查询
			if (match[1]){
				tmpList = tmpList.concat (JY.byTag(queryStr,context) );
			//类查询
			}else if (match[2]){
				tmpList = tmpList.concat (JY.byClass(match[2],context) );
			}
			return tmpList;
		}*/
		//筛选出与指定表达式匹配的元素集合。
		filter: function(filterStr, list) {

		},
		//htmlCollection生成List
		makeArr: function(htmlConllecton) {
			/*return List.prototype.init.call(null,htmlConllecton);*/
			/*
			var arr = Array.prototype.slice.call(htmlConllecton);
			//arr.push.apply(arr, arguments);
			arr.__proto__ = List.prototype;
			return arr;
			*/
			var list = new List;
			for (var i = 0, l = htmlConllecton.length; i < l; i++) {
				list.push(htmlConllecton[i]);
			}
			//var arr = Array.prototype.slice.call(htmlConllecton);
			return list;
		},
		//ajax异表
		ajax: function(argsObj) {
			var xhr = new XHR();
			return xhr.send(argsObj);
		},
		//get方法的ajax
		get: function() {
			var args = arguments;
			var argsObj = {};
			argsObj.url = args[0];
			argsObj.data = args[1] || {};
			argsObj.success = args[2] || null;
			argsObj.dataType = args[3] || "html";
			new XHR().send(argsObj);
		},
		//post方法的ajax
		post: function() {
			var args = arguments;
			var argsObj = {};
			argsObj.url = args[0];
			argsObj.data = args[1] || {};
			argsObj.success = args[2] || null;
			argsObj.type = "POST";
			argsObj.dataType = args[3] || "html";
			new XHR().send(argsObj);
		},
		//字符串转换成json格式
		parseJson: function(txt) {
			return typeof txt === "string" ? (new Function("return " + txt))() : txt;
		},
		method: function() {
			var func = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			if (func) {
				func.apply(null, args);
			}
		},
		//json转换成&url参数
		param: function(obj) {
			if (typeof obj == "string") {
				return obj;
			} else {
				var a = [];
				for (var i in obj) {
					if (typeof obj[i] == "object") {
						a.push(i + "=" + this.param(obj[i]));
					} else
						a.push(i + "=" + obj[i]);
				}
				return a.join("&");
			}
		},
		//用一个表达式来检查当前选择的元素集合，如果其中至少有一个元素符合这个给定的表达式就返回true。
		is: function(elem, selector) {
			return !!selector && JY.query.filter(selector, elem).length > 0;
		},
		//遍历集合List或array
		each: function(arr, callback) {
			for (var i = 0, l = arr.length; i < l; i++) {
				if (arr[i] !== undefined) {
					if (callback.call(arr[i], arr[i], i) === false) {
						break;
					};
				}
			};
			return this;
		},
		//元素位置
		position: function(elem) {
			elem = JY.byId(elem);
			return {
				x: elem.getBoundingClientRect().left + doc.documentElement.scrollLeft,
				y: elem.getBoundingClientRect().top + doc.documentElement.scrollTop
			};
		},
		//元素偏移量
		offset: function(elem) {
			elem = JY.byId(elem);
			return {
				x: elem.getBoundingClientRect().left + doc.documentElement.scrollLeft,
				y: elem.getBoundingClientRect().top + doc.documentElement.scrollTop
			};
		},
		//交互变换的样式
		toggleClass: function(elem, cls) {
			if (JY.hasClass(elem, cls)) {
				JY.removeClass(elem, cls);
			} else {
				JY.addClass(elem, cls);
			};
			return this;
		},
		//去除空格
		trim: function(txt) {
			return txt == null ? "" : txt.toString().replace(trimLeft, "").replace(trimRight, "");
		},
		//dom插入操作的中间函数
		_domInsert: function(elem, child, callback) {
			var tmp = document.createElement("div");
			var frag = document.createDocumentFragment();
			if (typeof child === "string") {
				tmp.innerHTML = child;
			} else {
				tmp.appendChild(child);
			};
			var n = tmp.firstChild;
			for (; n; n = n.nextSibling) {
				if ((n.nodeType === 1 || n.nodeType === 3) && n !== tmp) {
					frag.appendChild(n);
				}
			};
			//elem.appendChild(frag);
			callback.call(elem, frag);
			return elem;
		},
		//字符串转换成DOM对象
		convertDOM: function(str) {
			if (typeof str === "string") {
				var tmp = document.createElement("div");
				tmp.innerHTML = str;
				var childList = JY.child(tmp);
				return childList.length == 1 ? childList[0] : childList;
			} else {
				return str;
			}
		},
		//追加，插入到后面
		append: function(elem, child) {
			elem = this.byId(elem);
			return this._domInsert(elem, child, function(c) {
				this.appendChild(c);
			})
		},
		//移除
		remove: function(elem) {
			elem = this.byId(elem);
			var p = this.parent(elem);
			p ? p.removeChild(elem) : null;
		},
		//插入最前面
		prepend: function(elem, child) {
			elem = this.byId(elem);
			return this._domInsert(elem, child, function(c) {
				this.insertBefore(c, this.firstChild);
			});
		},
		//插入之前
		before: function(elem, node) {
			elem = this.byId(elem);
			return this._domInsert(elem, node, function(c) {
				this.parentNode.insertBefore(c, elem);
			});
		},
		//插入之后
		after: function(elem, node) {
			elem = this.byId(elem);
			return this._domInsert(elem, node, function(c) {
				this.parentNode.insertBefore(c, JY.next(elem));
			});
		},
		//HTML文本
		toText: function(elem, txt) {
			elem = this.byId(elem);
			if (txt == null) {
				var tmpNode = document.createElement("div");
				tmpNode.appendChild(document.createTextNode(elem.innerHTML));
				return tmpNode.innerHTML;
			} else {
				elem.appendChild(document.createTextNode(txt));
				return elem;
			}
		},
		text: function(elem, txt) {
			elem = this.byId(elem);
			if (txt == null) {
				var tmpNode = document.createElement("div");
				tmpNode.appendChild(document.createTextNode(elem.innerHTML));
				return tmpNode.innerHTML;
			} else {
				elem.innerHTML = '';
				elem.appendChild(document.createTextNode(txt.toString()));
				return elem;
			}
		},
		html: function(elem, html) {
			elem = this.byId(elem);
			if (html == null) {
				return elem.innerHTML;
			} else {
				elem.innerHTML = '';
				elem.innerHTML = html;
				return elem;
			}
		},
		//鼠标拖动事件
		mouseDrag: function(elem, callback, stopCallback, targetEvent, stopEvent) {
			var mousemove = null,
				mouseEvent = {};
			targetEvent = targetEvent || "mousedown";
			stopEvent = stopEvent || "mouseup";
			JY.bind(elem, targetEvent, function(e) {
				getMousePosition(e);
				JY.bind(elem, "mousemove", getMousePosition);
				callback.call(this, e);
				mousemove = setInterval(JY.proxyFunc(callback, this), 15);
			}).bind(elem, stopEvent, function(e) {
				clearInterval(mousemove);
				JY.unbind(elem, "mousemove", getMousePosition);
				delete JY.mouseDrag.prevEvent;
				delete JY.mouseDrag.event;
				mouseEvent = null;
				stopCallback.call(this, e);
			});
			//获取鼠标
			function getMousePosition(e) {
				JY.mouseDrag.event = e;
				JY.mouseDrag.prevEvent = mouseEvent;
				mouseEvent = e;
			};
		},
		//代理函数，处理改变当前作用域
		proxyFunc: function(func, pointer) {
			return function() {
				func.apply(pointer, Array.prototype.slice.call(arguments));
			}
		},
		//分解优化循环
		resolve: function(callback, startIndex, max, arr, done) {
			var start = +new Date();
			var n = startIndex;
			var f = done;
			JY.resolve.time = JY.resolve.time || null;
			JY.resolve.isEnd = JY.resolve.isEnd || false;
			for (; n < max && +new Date() - start < 50; n++) {
				if (arr && arr[n] === undefined) {
					continue;
				};
				if (arr) {
					if (callback.call(arr[n], arr[n], n) === false) {
						clearTimeout(JY.resolve.time);
						JY.resolve.isEnd = true;
						break;
					};
				} else {
					if (callback(n) === false) {
						clearTimeout(JY.resolve.time);
						JY.resolve.isEnd = true;
						break;
					};
				}
			};
			clearTimeout(JY.resolve.time);
			if (n < max && !JY.resolve.isEnd) {
				var calleeFunc = arguments.callee;
				JY.resolve.time = setTimeout(applyr(calleeFunc, callback, n, max, arr, done), 25);
			} else {
				f ? f.call(null) : null;
			};
		},
		//碰撞检测
		hits: function(oA, oB, w) {
			w = w || 0;
			var bx = false,
				by = false;
			var bw = oB.width - w;
			var aw = oA.width - w;
			var bh = oB.height - w;
			var ah = oA.height - w;
			if (oA.x > oB.x) {
				bx = oA.x - oB.x < bw;
			} else if (oA.x < oB.x) {
				bx = oB.x - oA.x < aw;
			} else {
				bx = true;
			};
			if (oA.y > oB.y) {
				by = oA.y - oB.y < bh;
			} else if (oA.y < oB.y) {
				by = oB.y - oA.y < ah;
			} else {
				by = true;
			};
			return (bx && by);
			//return  (Math.abs(oA.x - oB.x) <=Math.max(oA.width,oB.width) && Math.abs(oA.y - oB.y) <= Math.max(oA.width,oB.width) )
		},
		loadFile: function(src, type, callback, flashId) {
			var arr = src.split(",");
			if (type === "script") {
				var n = 0;
				JY.each(arr, function(v, i) {
					var elem = document.createElement("script");
					JY.append(document.body, elem);
					if (elem.onreadystatechange !== undefined) {
						elem.onreadystatechange = function() {
							if (elem.readyState == "loaded") {
								n++;
								if (n == arr.length) {
									callback ? callback.call(this) : null;
								};
							}
						}
					} else {
						JY.bind(elem, "load", function(r) {
							n++;
							if (n == arr.length) {
								callback ? callback.call(this) : null;
							};
						});
					}
					elem.src = v;
				});
			} else if (type === "image") {
				var n = 0;
				JY.each(arr, function(v, i) {
					var elem = document.createElement("img");
					var div = document.createElement('div');
					JY.css(div, {
						width: '0px',
						height: '0px',
						"overflow": 'hidden'
					});
					JY.append(div, elem);
					JY.append(document.body, div);
					if (elem.onreadystatechange !== undefined) {
						if (elem.readyState == "complete" || elem.readyState == "loaded") {
							n++;
							if (n == arr.length) {
								callback.call(this);
							};
						}
						elem.onreadystatechange = function() {
							if (elem.readyState == "complete" || elem.readyState == "loaded") {
								n++;
								if (n == arr.length) {
									callback.call(this);
								};
							}
						}
					} else {
						elem.onload = function(r) {
							n++;
							if (n == arr.length) {
								callback.call(this);
							};
						};
					}
					elem.src = v;
				});
			} else if (type === "swf" && swfobject) {
				var n = 0;
				var elem = document.createElement('div');
				JY.attr(elem, "id", flashId);
				JY.css(elem, {
					width: '0px',
					height: '0px',
					"overflow": 'hidden'
				});
				JY.append(document.body, elem);
				swfobject.embedSWF(src, flashId, 1, 1, "10.0.0", "expressInstall.swf", {}, {}, {}, callback);
			}
		},
		//进度条
		progressbar: function(cur, max, maxWidth) {
			var progressDiv = document.createElement("div");
			JY.width(progressDiv, maxWidth);
			JY.addClass(progressDiv, "progressbar");
			var childDiv = document.createElement("div");
			JY.width(childDiv, cur / max * maxWidth);
			JY.addClass(childDiv, "progress");
			JY.append(progressDiv, childDiv);
			var percent = document.createElement("div");
			percent.innerHTML = cur + '/' + max;
			JY.css(percent, {
				'position': "absolute",
				"textAlign": "center",
				"top": '0px',
				width: maxWidth + "px",
				'text-align': "center"
			});
			JY.addClass(percent, 'percent');
			JY.append(progressDiv, percent);
			return JY.outerHTML(progressDiv);
		},
		outerHTML: function(elem) {
			elem = JY.byId(elem);
			var tmp = doc.createElement('div');
			JY.append(tmp, elem);
			var _html = tmp.innerHTML;
			delete tmp;
			return _html;
		}
	};
	//元素高度和宽度
	JY.each(["Height", "Width"], function() {
		var _self = this;
		var name = this.toLowerCase();
		JY[name] = function(elem, value) {
			elem = JY.byId(elem);
			if (value) {
				value = typeof value === "string" ? value : value + 'px';
				JY.css(elem, name, value);
				return this;
			}
			if (elem == window) {
				return document.compatMode == "CSS1Compat" && document.documentElement["client" + _self] || document.body["client" + _self];
			} else
			if (elem == document) {
				return Math.max(
					document.documentElement["client" + _self],
					document.body["scroll" + _self], document.documentElement["scroll" + _self],
					document.body["offset" + _self], document.documentElement["offset" + _self]
				);
			} else {
				var val = 0;
				var wich = name == "height" ? ["Top", "Bottom"] : ["Left", "Right"];
				if (doc.defaultView) {
					val = parseFloat(JY.curCss(elem, name));
				} else {
					val = elem["offset" + _self];
					JY.each(wich, function() {
						val -= parseFloat(JY.css(elem, "border" + this + "Width"));
						val -= parseFloat(JY.css(elem, "padding" + this));
					});
				}
				return Math.round(val);
			}
		}
	});
	//*列表集合*/
	var List = function() {};
	List.prototype = new Array();
	List.prototype.constructor = List;
	JY.extend(List, {
		each: function(callBack) {
			/*
				for (var i = 0,l = this.length; i<l ;i++ ){
					callBack.call(this[i],this[i],i);
				}
				*/
			JY.each(this, callBack);
			return this;
		},
		_assign: function(v, n) {
			this.each(function() {
				JY[n](this, v);
			});
		},
		css: function() {
			if (arguments.length == 2) {
				applyr(this._assign, "css").apply(this, arguments);
				return this;
			} else {
				JY.css(this[0], arguments[0]);
			}
		},
		attr: function() {
			applyr(this._assign, "attr").apply(this, arguments);
		},
		init: function() {
			var tmp = new List();
			var arg = arguments[0];
			var n = null;
			for (var i = 0, l = arg.length; i < l; i++) {
				n = arg[i];
				if (n.nodeType === 1) {
					tmp.push(n);
				}
			}
			return tmp;
		},
		concat: function(list2) {
			return List.prototype.init.call(null, Array.prototype.slice.call(this).concat(Array.prototype.slice.call(list2)));
		},
		first: function() {
			return this[0];
		},
		last: function() {
			return this[this.length - 1];
		},
		child: function() {
			var list = new List();
			this.each(function() {
				JY.child(this).each(function() {
					list.push(this);
				});
			});
			return list;
		},
		eq: function(i) {
			return this[i];
		},
		find: function(arg) {
			var list = new List();
			this.each(function() {
				var tmp = JY.query.find(arg, this).set;
				Array.prototype.push.apply(list, tmp);
			});
			return list;
		},
		filter: function(arg) {
			var tmp = JY.query.filter(arg, this);
			return JY.makeArr(tmp);
		},
		parents: function(arg) {
			var tmp = new List();
			var arr = new List();
			this.each(function() {
				var p = JY.parent(this);
				while (p && p.nodeType !== 9) {
					tmp.push(p);
					p = JY.parent(p);
				}
			});
			arr = JY.makeArr(JY.unique(JY.query.filter(arg, tmp)));
			return arr;
		},
		closest: function(arg) {
				var tmp = new List();
				this.each(function() {
					var p = JY.parent(this);
					while (p && p.nodeType !== 9) {
						if (JY.is([p], arg)) {
							tmp.push(p);
							break;
						}
						p = JY.parent(p);
					}
				});
				return JY.unique(tmp);
			}
			/*,
			height:function(arg){
				if (this.length==1){
					if( arg ){
						JY.height(this[0],arg);
						return this;
					}else{
						return JY.height(this[0]);
					}
				}else{
					var arr = [];
					this.each(function(){
						arr.push(JY.height(this,arg));
					});
					return arg  ? this : arr;
				}
			}*/
	});
	JY.each(["height", "width", "position"], function() {
		var name = this;
		List.prototype[name] = function(arg) {
			if (this.length == 1) {
				if (arg) {
					JY[name](this[0], arg);
					return this;
				} else {
					return JY[name](this[0]);
				}
			} else {
				var arr = [];
				this.each(function() {
					arr.push(JY[name](this, arg));
				});
				return arg ? this : arr;
			}
		}
	});
	JY.each(["bind", "unbind", "show", "hide", "addClass", "toggleClass", "removeClass", "live", "one", "delegate"], function() {
		var name = this;
		List.prototype[name] = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			this.each(function() {
				JY[name].apply(this, [this].concat(args));
			});
			return this;
		};
		return this;
	});

	function applyr(f) {
		var args = Array.prototype.slice.call(arguments, 1);
		return function(x) {
			return f.apply(this, [x].concat(args));
		}
	};
	JY.cache = {};
	JY.CID = 0; // DOM节点缓存的ID
	//事件驱动
	JY.event = {
		getData: function(target) {
			var _data;
			if (target === win) {
				_data = 'JY_win';
			} else if (target === document) {
				_data = 'JY_doc';
			} else {
				_data = JY.attr(target, "JY_data");
			};

			return _data;
		},
		add: function(target, eventType, handle, type, selector) {

			if (target.addEventListener) {
				this.add = function(target, eventType, handle, type, selector) {
					if (!target || target.nodeType === 3 || target.nodeType === 8) { //文本或注释
						return this;
					};
					selector = selector || "";
					var _data = this.getData(target);
					if (!_data) {
						//不存在
						_data = "JY_" + JY.CID;
						JY.attr(target, "JY_data", _data);
						JY.CID++;
					};
					var ishaveEvt = true; //是否已存在相同的事件
					if (!JY.cache[_data] || !JY.cache[_data][eventType + selector]) {
						ishaveEvt = false
					};
					handle = this._proxy.apply(this, Array.prototype.slice.call(arguments, 0));
					if (!ishaveEvt) { //没有就添加
						JY.cache[_data][eventType + selector].handle = handle;
						target.addEventListener(eventType, handle, false);
					}
				}
			} else {
				this.add = function(target, eventType, handle) {
					if (!target) {
						return this;
					}
					handle = this._proxy.apply(this, Array.prototype.slice.call(arguments, 0));
					target.attachEvent("on" + eventType, handle);
				}
			};
			this.add.apply(this, Array.prototype.slice.call(arguments, 0));
		},
		_proxy: function(target, eventType, handle, type, selector) {
			var _data = this.getData(target);
			selector = selector || "";
			JY.cache[_data] = JY.cache[_data] || {}; //初始化缓存事件列表
			JY.cache[_data][eventType + selector] = JY.cache[_data][eventType + selector] || [];
			var eList = JY.cache[_data][eventType + selector];
			var _self = this;
			var fn = handle;
			handle = function(e) {
				e.target = e.target || e.srcElement;
				e.stop = function() {
					e.preventDefault();
					e.stopPropagation();
				};
				if (type === "delegate") {
					var evtList = new List();
					if (typeof selector === "object") {
						if (selector.constructor === List) {
							evtList = selector;
						} else {
							evtList.push(selector);
						}
					} else {
						evtList = JY.query(selector, target);
					};
					JY.each(evtList, function() {
						if (e.target === this) {
							fn.call(this, e)
						};
					});
					return false;
				};
				if (!fn.call(target, e)) {
					e.preventDefault ? e.preventDefault() : null;
				};
				if (type === "one") {
					_self.remove(target, eventType, handle)
				}
			};
			handle.oldHandle = fn;
			eList.push(handle);
			return function(e) {
				JY.each(eList, function(d) {
					d.call(this, e);
				});
			};
		},
		remove: function(target, eventType, handle, type, selector) {
			var _self = this;
			var _data = this.getData(target);
			var evtList;
			if (!_data) {
				evtList = false;
			} else {
				evtList = JY.cache[_data][eventType + selector] || false;
			}
			if (handle) {
				var count = 0;
				JY.each(evtList, function(d, i) {
					if (handle == d.oldHandle) {
						delete evtList[i];
					} else {
						count++;
					};
				});
				if (count === 0) {
					this.remove(target, eventType + selector);
				}
			} else {
				if (evtList) {
					//target.removeEventListener(eventType,evtList.handle,false);
					JY.each(evtList, function(v, i) {
						delete evtList[i];
					});
					JY.cache[_data][eventType + selector] = null;
					_self.deleteEvt(target, eventType, evtList.handle);
				}
			};
		},
		deleteEvt: function(target, eventType, handle) {
			if (target.removeEventListener) {
				this.deleteEvt = function(target, eventType, handle) {
					target.removeEventListener(eventType, handle, false);
				}
			} else {
				this.deleteEvt = function(target, eventType, handle) {
					target.detachEvent("on" + eventType, handle);
				}
			};
		}
	};
	//绘图函数
	JY.draw = {
		cache: {},
		setStyle: function(cssObj) {
			this.cache = cssObj;
		},
		setPosition: function(o, x, y) {
			JY.css(o, {
				left: x + "px",
				top: y + "px"
			});
		},
		//画点
		point: function(container, x, y) {
			var p = document.createElement("i");
			JY.css(p, this.cache);
			JY.append(container, p);
			this.setPosition(p, x, y);
			p.x = x;
			p.y = y;
			p.width = parseInt(this.cache.width);
			p.height = parseInt(this.cache.height);
			return p;
		},
		//绘线
		line: function(objA, objB, c, callback) {
			var DvalueX = objB.x - objA.x;
			var DvalueY = objB.y - objA.y;
			var w = parseInt(this.cache.width);
			var len = parseInt(Math.sqrt(DvalueX * DvalueX + DvalueY * DvalueY)) / w; //两点间距离
			var angle = Math.atan2(DvalueX, DvalueY); //角度
			JY.resolve(function() {
				var x = objA.x + Math.sin(angle) * w;
				var y = objA.y + Math.cos(angle) * w;
				JY.draw.point(c, x, y);
				objA.x = x;
				objA.y = y;
				callback ? callback({
					x: x,
					y: y
				}) : null;
			}, 1, len);
		}
	};
	win.JY = JY;
	win.List = List;
	var XHR = function() {};
	XHR.prototype = {
		create: function() {
			var msxml_progid = ['MSXML2.XMLHTTP.6.0',
				'MSXML3.XMLHTTP',
				'Microsoft.XMLHTTP', // Doesn't support readyState 3. 
				'MSXML2.XMLHTTP.3.0' // Doesn't support readyState 3. 
			];
			var xhr;
			try {
				xhr = new XMLHttpRequest();
			} catch (e) {
				for (var i = 0, len = msxml_progid.length; i < len; i++) {
					try {
						xhr = new ActiveXObject(msxml_progid[i]);
						break;
					} catch (e) {}
				};
			} finally {
				return xhr;
			};
		},
		send: function(argsObj) {
			var _self = this;
			var xhr = _self.create();
			dataType = argsObj.dataType || "html";
			argsObj.contentType = argsObj.contentType || "application/x-www-form-urlencoded";
			if (argsObj.async == undefined) {
				argsObj.async = true;
			};
			if (argsObj.async) {
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						JY.method(argsObj.success, _self.format(xhr.responseText, xhr.responseXML, argsObj.dataType));
					}
				};
			}
			if (argsObj.type == "GET" || !argsObj.type) {
				var tmpArr = argsObj.url.split("?");
				if (tmpArr[1]) {
					argsObj.url += "&" + JY.param(argsObj.data);
				} else {
					argsObj.url = tmpArr[0] + "?" + JY.param(argsObj.data);
				};
				xhr.open("GET", argsObj.url, argsObj.async);
				xhr.send(null);
			} else {
				xhr.open("POST", argsObj.url, argsObj.async);
				xhr.setRequestHeader("Content-Type", argsObj.contentType);
				try {
					xhr.send(JY.param(argsObj.data));
				} catch (e) {
					JY.method(argsObj.error, e);
				}
			}
			if (!argsObj.async) {
				JY.method(argsObj.success, _self.format(xhr.responseText, xhr.responseXML, argsObj.dataType));
			};
			return xhr;
		},
		format: function(txt, xml, type) {
			switch (type) {
				case "xml":
					{
						return xml;
					}
					break;
				case "json":
					{
						return JY.parseJson(txt);
					}
					break;
				case "html":
					;
				default:
					{
						return txt;
					}
					break;
			}
		}
	};
})(window);


(function() {
	//状态码
	var JYGSTATE = {
		STATE_SYSTEM_WAIT_FOR_CLOSE: 0,
		STATE_SYSTEM_TITLE: 1,
		STATE_SYSTEM_INSTRUCTIONS: 2,
		STATE_SYSTEM_NEW_GAME: 3,
		STATE_SYSTEM_GAME_OVER: 4,
		STATE_SYSTEM_NEW_LEVEL: 5,
		STATE_SYSTEM_LEVEL_IN: 6,
		STATE_SYSTEM_GAME_PLAY: 7,
		STATE_SYSTEM_LEVEL_OUT: 8,
		STATE_SYSTEM_WAIT: 9
	};
	var JYG = function(stage) {
		this.timer = null; //计时器
		this.func = new Function(); //当前执行函数
		this.stage = stage; //舞台
		if (stage) {
			this.stage.width = JY.width(stage);
			this.stage.height = JY.height(stage);
		};
		this.lastState = null;
		this.currentState = null; //当前状态
		this.nextState = null;
		this.game = new Game();
		this.waitCount = 0; //等待
		this.waitTime = 30;
		this.titleScreen = null;
		this.InstructionsScreen = null;
		this.scoreScreen = null;
		this.gameOverScreen = null;
		this.frequency = 100; //刷新频率
	};
	var Game = function() {};
	Game.prototype = {
		gameOver: function(b) {
			b.checkState(JYGSTATE.STATE_SYSTEM_GAME_OVER);
		},
		newGame: function(b) {
			b.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
		},
		newLevel: function() {}
	};
	JYG.prototype = {
		init: function() {
			//over
			this.checkState(JYGSTATE.STATE_SYSTEM_TITLE);
		},
		setStage: function(stage) {
			this.stage = stage;
			this.stage.width = JY.width(stage);
			this.stage.height = JY.height(stage);
		},
		startTimer: function() {
			var _self = this;
			if (!_self.timer) {
				_self.timer = setInterval(JY.proxyFunc(_self.runGame, _self), _self.frequency);
			}
		},
		runGame: function() {
			this.func();
		},
		checkState: function(stateVal) {
			this.lastState = this.currentState;
			this.currentState = stateVal;
			switch (stateVal) {
				case JYGSTATE.STATE_SYSTEM_WAIT_FOR_CLOSE:
					{
						this.func = this.waitClose;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_TITLE:
					{
						this.func = this.setTitle;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_INSTRUCTIONS:
					{
						this.func = this.setInstructions;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_NEW_GAME:
					{
						this.func = this.systemNewGame;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_GAME_OVER:
					{
						this.func = this.gameOver;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_NEW_LEVEL:
					{
						this.func = this.newLevel;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_LEVEL_IN:
					{
						this.func = this.levelIn;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_GAME_PLAY:
					{
						this.func = this.gamePlay;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_LEVEL_OUT:
					{
						this.func = this.levelOut;
					}
					break;
				case JYGSTATE.STATE_SYSTEM_WAIT:
					{
						this.func = this.wait;
					}
					break;
			}
		},
		setTitle: function() {
			this.addChild(this.titleScreen);
			//JY.bind(this.titleScreen,"click", JY.proxyFunc( this.okButtonClickListener,this));
			this.checkState(JYGSTATE.STATE_SYSTEM_WAIT);
			this.nextState = JYGSTATE.STATE_SYSTEM_INSTRUCTIONS;
			//this.stopTimer();
		},
		setInstructions: function() {
			this.addChild(this.InstructionsScreen);
			//JY.bind(this.InstructionsScreen, "click", JY.proxyFunc(this.okButtonClickListener, this));
			JY.touch(this.InstructionsScreen, JY.proxyFunc(this.okButtonClickListener, this));
			this.nextState = JYGSTATE.STATE_SYSTEM_NEW_GAME;
			this.stopTimer();
		},
		systemNewGame: function() {
			this.game.newGame();
			this.addChild(this.scoreScreen);
			this.checkState(JYGSTATE.STATE_SYSTEM_NEW_LEVEL);
		},
		gameOver: function() {
			this.clearState();
			this.addChild(this.gameOverScreen);
			//JY.bind(this.gameOverScreen, "click", JY.proxyFunc(this.okButtonClickListener, this));
			JY.touch(this.gameOverScreen, JY.proxyFunc(this.okButtonClickListener, this));
			//this.checkState(JYGSTATE.STATE_SYSTEM_WAIT_FOR_CLOSE);
			this.nextState = JYGSTATE.STATE_SYSTEM_TITLE;
			this.stopTimer();
		},
		newLevel: function() {
			this.game.newLevel();
			this.checkState(JYGSTATE.STATE_SYSTEM_LEVEL_IN);
		},
		gamePlay: function() {
			this.game.runGame();
		},
		wait: function() {
			this.waitCount++;
			if (this.waitCount > this.waitTime) {
				this.checkState(JYGSTATE.STATE_SYSTEM_WAIT_FOR_CLOSE);
			}
		},
		waitClose: function() {
			//this.checkState(this.nextState);
			this.okButtonClickListener();
			waitCount = 0;
		},
		levelIn: function() {
			waitTime = 10;
			this.checkState(JYGSTATE.STATE_SYSTEM_WAIT);
			this.nextState = JYGSTATE.STATE_SYSTEM_GAME_PLAY;
		},
		clearState: function() {
			var _self = this;
			var child = JY.child(_self.stage);
			JY.each(child, function() {
				_self.removeChild(this);
			});
			this.stopTimer();
		},
		okButtonClickListener: function(e) {
			switch (this.nextState) {
				case JYGSTATE.STATE_SYSTEM_TITLE:
					{
						this.removeChild(this.gameOverScreen);
						this.startTimer();
					}
					break;
				case JYGSTATE.STATE_SYSTEM_INSTRUCTIONS:
					{
						this.removeChild(this.titleScreen);
					}
					break;
				case JYGSTATE.STATE_SYSTEM_NEW_GAME:
					{
						this.removeChild(this.InstructionsScreen);
						this.startTimer();
					}
					break;
			}
			this.checkState(this.nextState);
		},
		removeChild: function(child) {
			if (child.constructor == Sprite) {
				JY.remove(child.DOM);
			} else {
				JY.remove(child);
			}
		},
		addChild: function(child) {
			if (child.constructor == Sprite) {
				JY.append(this.stage, child.DOM);
			} else {
				JY.append(this.stage, child);
			}
			return this;
		},
		stopTimer: function() {
			clearInterval(this.timer);
			this.timer = null;
		}
	};

	function Sprite(w, h, style) {
		this.style = style || {};
		w = w || 0;
		h = h || 0;
		this.width = w;
		this.height = h;
		this.x = 0;
		this.y = 0;
		this.data = null;
		this.init = function(w, h, style) {
			JY.extend(this.style, style || {});
			this.DOM = document.createElement("i");
			this.width = w || this.width;
			this.height = h || this.height;
			JY.extend(this.style, {
				position: "absolute",
				overflow: "hidden",
				width: this.width + "px",
				height: this.height + "px"
			});
			JY.css(this.DOM, this.style);
		};
		this.init();
		this.remove = function() {
			JY.remove(this.DOM);
		};
		this.addChild = function(s) {
			JY.append(this.DOM, s.DOM);
		};
		this.setPosition = function(x, y) {
			this.x = x == null ? this.x : x;
			this.y = y == null ? this.y : y;
			JY.css(this.DOM, {
				left: this.x + "px",
				top: this.y + "px"
			});
			return this;
		};
		this.setStyle = function(style) {
			JY.css(this.DOM, style);
			return this;
		}
	};
	window.JYG = JYG;
	window.JYGSTATE = JYGSTATE;
	window.Game = Game;
	window.Sprite = Sprite;

	Function.prototype.method = function(name, func) {
		if (typeof name === "object") {
			for (var i in name) {
				this.prototype[i] = name[i];
			}
		} else {
			this.prototype[name] = func;
		}
		return this;
	};
	//UserInfo.prototype=new Person();
	Function.method("inherits", function(parent) {
		var d = {}, // 递归调用时的计数器  
			// 下面这行已经完成了最简单的原型继承：将子类的prototype设为父类的实例  
			p = (this.prototype = new parent());

		// 下面给子类增加uber方法（类似Java中的super方法），以调用上层继承链中的方法  
		this.method('uber', function uber(name) {
			if (!(name in d)) {
				d[name] = 0;
			}
			var f, r, t = d[name],
				v = parent.prototype;
			if (t) {
				while (t) {
					// 往上追溯一级  
					v = v.constructor.prototype;
					t -= 1;
				}
				f = v[name];
			} else {
				f = p[name];
				if (f == this[name]) {
					f = v[name];
				}
			}
			// 因为f函数中，可能存在uber调用上层的f  
			// 不设置d[name]的话，将导致获取的f始终为最近父类的f（陷入死循环）  
			d[name] += 1;
			// slice.apply的作用是将第2个及其之后的参数转换为数组  
			// 第一个参数就是f的名字，无需传递  
			// 这样，通过uber调用上层方法时可以传递参数：  
			// sb.uber(methodName, arg1, arg2, ...);  
			r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
			// 还原计数器  
			d[name] -= 1;
			return r;
		});
		// 返回this, 方便chain操作  
		return this;
	});
})();
/*
 *为HTML5而写成的JS游戏框架
 */
;
(function(win) {
	//canvasText output2013/3/21
	var CanvasText = function(position, context) {
		this._textStack = [];

		if (position === null || position === undefined) {
			position = {
				x: 0,
				y: 0
			}
		}

		this._position = position;
		this._context = context;
	};

	CanvasText.prototype = {
		_position: null,
		_textStack: null,
		_currentOptionSet: null,

		_newOptionSet: function() {
			if (this._currentOptionSet != null) {
				return;
			}

			this._currentOptionSet = {
				text: '',
				family: '',
				size: '',
				weight: '',
				style: '',
				color: ''
			};
		},

		position: function(x, y) {
			this._position.x = x;
			this._position.y = y;
		},

		family: function(family) {
			this._newOptionSet();
			this._currentOptionSet.family = family;
			return this;
		},

		size: function(size) {
			this._newOptionSet();
			this._currentOptionSet.size = size;
			return this;
		},

		weight: function(weight) {
			this._newOptionSet();
			this._currentOptionSet.weight = weight;
			return this;
		},

		style: function(style) {
			this._newOptionSet();
			this._currentOptionSet.style = style;
			return this;
		},

		color: function(color) {
			this._newOptionSet();
			this._currentOptionSet.color = color;
			return this;
		},

		append: function(text) {
			this._newOptionSet();
			this._currentOptionSet.text = text;
			this._textStack.push(this._currentOptionSet);
			this._currentOptionSet = null;
			return this;
		},

		newLine: function() {
			this.append('\n');
			return this;
		},

		render: function() {

			if (this._textStack.length == 0) {
				return;
			}

			var previousFontOptions = {
				text: '',
				family: '',
				size: '',
				weight: '',
				style: ''
			};

			var textAdjustment = {
				x: 0,
				y: 0
			};

			this._context.save();

			for (var i = 0, textStackLen = this._textStack.length; i < textStackLen; i++) {

				var currentFontOptions = this._textStack[i];

				// we must store previous font options so we can override any single one of them without losing previously stored settings
				if (currentFontOptions.family) {
					previousFontOptions.family = currentFontOptions.family;
				}

				if (currentFontOptions.size) {
					previousFontOptions.size = currentFontOptions.size;
				}

				if (currentFontOptions.weight) {
					previousFontOptions.weight = currentFontOptions.weight;
				}

				if (currentFontOptions.style) {
					previousFontOptions.style = currentFontOptions.style;
				}

				this._context.font = JY.trim(previousFontOptions.weight + ' ' + previousFontOptions.style + ' ' + previousFontOptions.size + ' ' + previousFontOptions.family);

				// we don't need to store previous color, and can instead use the context to remember the previously used color
				if (currentFontOptions.color) {
					this._context.fillStyle = currentFontOptions.color;
				}

				var textToDraw = currentFontOptions.text;
				var wordsArray = textToDraw.split(' ');

				for (var j = 0, wordsArrayLen = wordsArray.length; j < wordsArrayLen; j++) {
					var currentWord = ' ' + wordsArray[j];
					var currentWordWidth = this._context.measureText(currentWord).width;

					// we don't want to draw anything for new line characters, nor apply textAdjustment additions
					if (textToDraw == '\n') {
						this._position.y += 20;
						textAdjustment.x = 0;
						continue;
					}

					this._context.fillText(
						currentWord, // text
						this._position.x + textAdjustment.x, // x position
						this._position.y + textAdjustment.y // y position

					);

					textAdjustment.x += currentWordWidth;
				}
			}

			this._context.restore();
		}
	};
	/*游戏画布2013/3/25*/
	var GameCanvas = function() {
		this.canvas;
		this.context;
		this.size;
	};
	GameCanvas.prototype = {
		init: function(canvasId) {
			this.canvas = document.getElementById(canvasId);
			this.context = this.canvas.getContext('2d');
			this.size = {
				x: this.canvas.width,
				y: this.canvas.height
			};
		},
		render: function() {
			this.context.clearRect(0, 0, this.size.x, this.size.y);
		}
	};
	/*游戏主框架2013/3/25*/
	var Game5 = {
		updatePerSecond: 60,
		_loopInterval: null,
		_prevTime: null,
		init: function() {
			this.bindControl();
			this._prevTime = new Date().getTime();
			this._loopInterval = window.setInterval(this.gameLoop.bind(this), 1000 / this.updatePerSecond);
		},
		gameLoop: function() {
			var currentTime = new Date().getTime();
			var elapsed = currentTime - this._prevTime;
			this.update(elapsed);
			this._prevTime = currentTime;
		},
		update: function(elapsed) {

		},
		bindControl: function() {

		},
		handleInput: function(pressed, event) {

		}
	};
	var Sprite5 = function() {
		this.size = {
			x: 0,
			y: 0
		};
		this.cut = {
			size: {
				x: 0,
				y: 0
			},
			pos: {
				x: 0,
				y: 0
			}
		};
		this.x = 0;
		this.y = 0;
		this.context = null;
		this.img = null;
		this.init = function(context, img, cut, size) {
			this.context = context;
			this.img = img;
			cut ? this.cut = cut : null;
			size ? this.size = size : null;
		};
		this.setPosition = function(x, y) {
			this.x = x || this.x;
			this.y = y || this.y;
			this.context.save();
			var cutpos = this.cut;
			var cutsize = this.size;
			this.context.drawImage(this.img, cutpos.x, cutpos.y, cutsize.x, cutsize.y, this.x, this.y, this.size.x, this.size.y);
			this.context.restore();
		};
		this.setCut = function(x, y) {
			this.context.save();
			var cutpos = {
				x: x,
				y: y
			};
			var cutsize = this.cut.size;
			this.context.drawImage(this.img, cutpos.x, cutpos.y, cutsize.x, cutsize.y, x, y, this.size.x, this.size.y);
			this.context.restore();
		}
	};
	win.Sprite5 = Sprite5;
	win.Game5 = Game5;
	win.GameCanvas = GameCanvas;
	win.CanvasText = CanvasText;
})(window);
/*!
 * JY javascript库，版本号：1.0
 * http://www.lovewebgames.com
 * Copyright 2012, 田想兵 
 * Email : yoooyeeey@163.com
 * QQ:55342775
 *Cookie
 * Date: 2012/7/11
 */
JY.cookie=function(name,value,prop){
	var c = document.cookie, ret=null;
	if (arguments.length ==1){
		if (c && c!==''){
			var cookies =c.split(';');
			for (var i=0,l=cookies.length; i<l ;i++ ){
				var cookie =  JY.trim( cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    ret = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
			}
		}
	}else{		
		prop = prop||{};
		var expires= '';
		if (prop.expires){
			var date;
			switch(prop.expires.constructor){
				case Number :{
					date = new Date();
					date.setTime(date.getTime() + (prop.expires*1000*60*60*24) );
					date =date.toUTCString();
				}break;
				case String:{
					date = prop.expires;
				}break;
				default:{
					date = prop.expires.toUTCString();
				}break;
			}
			expires = '; expires=' + date;		
		}
		var path = prop.path ? '; path=' + (prop.path) : '';
		var domain = prop.domain ? '; domain=' + (prop.domain) : '';
		var secure = prop.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	}
	return ret;
}

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
/*
mobile event touch
2015-5-18
 */
(function($) {
	var touch = {
		touch: function(obj, trigger, fn) {
			var move;
			var istouch = false;
			if (typeof trigger === "function") {
				fn = trigger;
				$.on(obj, 'touchstart', function() {
					istouch = true;
				});
				$.on(obj, 'touchmove', function(e) {
					move = true;
				}).on(obj, 'touchend', function(e) {
					e.preventDefault();
					if (!move) {
						var returnvalue = fn.call(this, e, 'touch');
						if (returnvalue === false) {
							e.preventDefault();
							e.stopPropagation();
						}
					}
					move = false;
				});
			} else {
				$.on(obj, 'touchstart', trigger, function() {
					istouch = true;
				});
				$.on(obj, 'touchmove', trigger, function(e) {
					move = true;
				}).on(obj, 'touchend', trigger, function(e) {
					e.preventDefault();
					if (!move) {
						var touch = e.changedTouches[0];
						e.pageX = touch.pageX;
						e.pageY = touch.pageY;
						var returnvalue = fn.call(this, e, 'touch');
						if (returnvalue === false) {
							e.preventDefault();
							e.stopPropagation();
						}
					}
					move = false;
				});
			}
			$.on(obj, 'mousedown', trigger, click);

			function click(e) {
				if (!istouch) {
					return fn.call(this, e, 'touch');
				}
			}
		},
		touchStart: function(obj, fn) {
			var istouch = false;
			$.on(obj, 'touchstart', function(e) {
				var touch = e.changedTouches[0];
				e.pageX = touch.pageX;
				e.pageY = touch.pageY;
				return fn.call(this, e, 'touchstart');
			});
			$.on(obj, 'mousedown', trigger, click);
			function click(e) {
				if (!istouch) {
					return fn.call(this, e);
				}
			}
		},
		touchMove:function(obj,fn){
			var istouch = false;
			$.on(obj, 'touchmove', function(e) {
				var touch = e.changedTouches[0];
				e.pageX = touch.pageX;
				e.pageY = touch.pageY;
				return fn.call(this, e, 'touchmove');
			});
			$.on(obj, 'mousemove', trigger, click);
			function click(e) {
				if (!istouch) {
					return fn.call(this, e, 'touchmove');
				}
			}
		},
		touchEnd: function(obj, fn) {
			var istouch = false;
			$.on(obj, 'touchend', function(e) {
				var touch = e.changedTouches[0];
				e.pageX = touch.pageX;
				e.pageY = touch.pageY;
				return fn.call(this, e, 'touchend');
			});
			$.on(obj, 'mouseup', trigger, click);
			function click(e) {
				if (!istouch) {
					return fn.call(this, e, 'touchend');
				}
			}
		},
		swipeLeft: function(obj, fn) {
			var start = {},
				end = {};
			$.touchStart(ojb, function(e) {
				start = {
					x: e.pageX,
					y: e.pageY
				};
			});
			$.touchEnd(obj, function(e) {
				end = {
					x: e.pageX,
					y: e.pageY
				}
				e.start = start;
				e.end = end;
				if (end.x > start.x + 10) {
					return fn.call(this, e, 'swipeLeft');
				}
			});
		},
		swipeRight: function() {
			var start = {},
				end = {};
			$.touchStart(ojb, function(e) {
				start = {
					x: e.pageX,
					y: e.pageY
				};
			});
			$.touchEnd(obj, function(e) {
				end = {
					x: e.pageX,
					y: e.pageY
				}
				e.start = start;
				e.end = end;
				if (end.x < start.x + 10) {
					return fn.call(this, e, 'swipeRight');
				}
			});
		},
		swipe: function(obj, fn) {
			var start = {},
				end = {};
			$.touchStart(ojb, function(e) {
				start = {
					x: e.pageX,
					y: e.pageY
				};
			});
			$.touchEnd(obj, function(e) {
				end = {
					x: e.pageX,
					y: e.pageY
				}
				e.start = start;
				e.end = end;
				if (end.x > start.x + 10) {
					return fn.call(this, e, 'swipe');
				}
				if (end.x < start.x + 10) {
					return fn.call(this, e, 'swipe');
				}
				if (end.y > start.y + 10) {
					return fn.call(this, e, 'swipe');
				}
				if (end.y < start.y + 10) {
					return fn.call(this, e, 'swipe');
				}
			});
		}
	}
	JY.extend(JY, touch)
})(JY);