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