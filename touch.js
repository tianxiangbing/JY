/*
mobile event touch
2015-5-18
 */
(function($) {
	$.touch = function(obj, trigger, fn) {
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
				return fn.call(this, e);
			}
		}
	}
})(JY);