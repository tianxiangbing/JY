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