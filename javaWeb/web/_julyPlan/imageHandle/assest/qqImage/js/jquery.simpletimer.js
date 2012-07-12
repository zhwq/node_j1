/**
 * timer class
 * 
 * @Author:Fly Mirage
 * @Date:2010-02-23
 * @Version:1.3
 *
 * @History:
 * ----------------------------------------------
 * v1.3		2010-04-01
 * # Fix,ajax "dataType"
 * # Add,function "simpleCountdown"
 * ----------------------------------------------
 * v1.2		2010-03-22
 * # Fix,ajax file of cross-domain
 * ----------------------------------------------
 * v1.1		2010-03-04
 * # Add, get server time of header with ajax
 * ----------------------------------------------
 * v1.0		2010-02-23
 * # get server time with SSI
 * # Create it
 * 
 */
 /**
  * when the ext is 'html',it use SSI.'js',it use ajax
	*/
(function($){
	var array_week = [
		'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',
		'Sun','Mon','Tue','Wed','Thu','Fri','Sat',
		'&#26085;','&#19968;','&#20108;','&#19977;','&#22235;','&#20116;','&#20845;'
	];
	var array_number = ['&#12295;','&#19968;','&#20108;','&#19977;','&#22235;','&#20116;','&#20845;','&#19971;','&#20843;','&#20061;','&#21313;'];
	var array_month = [
		'','January','February','March','April','May','June','July','August','September','October','November','December',
		'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'
	];
	var RELATIVE = /^[\w\.]+[^:]*$/;
	function makePath(href, path) {
		if (RELATIVE.test(href)) href = (path || "") + href;
		return href;
	};
	function makeLocation(){
		var s = window.location.search;
		if (s == '') s = '?';
		return window.location.protocol + '//' + window.location.host + window.location.pathname + s;
	}
	function getPath(href, path) {
		href = makePath(href, path);
		return href.slice(0, href.lastIndexOf("/") + 1);
	};
	function getHost(url) {
		var r, re,s = '';
		url += '/';
		re = /:\/\/(.[^/]*)\//ig;
		r = url.match(re);
		if (r.index >= 0) {
			s = r[0].replace(/:\/\//g,'');
			s = s.replace('/','');
		}
		return s;
	}
	var script = null;
	if ($.browser.msie) {
		script = document.scripts[document.scripts.length - 1];
	} else {
		var scripts = document.getElementsByTagName("script");
		script = scripts[scripts.length - 1];
	}
	var path = getPath(script.src);
	var host = getHost(script.src);
	var ajaxURL = '';
	if (window.location.host != host)
		ajaxURL = window.location.href/*makeLocation() + '&_=' + Math.random()*/;
	else
		ajaxURL = makePath('jquery.simpletimer.ajax.html',path) /*+ '?_=' + Math.random()*/;
	
	var number_pad = function(num, n) {
			return (new Array(n >(''+num).length ? (n - (''+num).length+1) : 0).join('0') + num);
	}
	$.simpletimer = {
		getDate:function(time){
			var t = time;
			if (!(time instanceof Date)){
				if (!isNaN(time)) time = parseInt(time);
				t = new Date(time);
				if (isNaN(t.getTime()))
					t = new Date();
			}
			return t;
		}
	};
	$.extend($.simpletimer,{
		countdown:function(delta,target){
			target = $.simpletimer.getDate(target);
			var cd = target.getTime() - ((new Date()).getTime() + delta);
			return cd;
		},
		toLimitString:function(limite_ms,format){
			var d,h,m,s,ms,minus=false;
			//if (limite_ms < 0) minus = true;
			limite_ms = Math.abs(parseInt(limite_ms));
			var t = parseInt(limite_ms / 1000);
			d = parseInt(t / 60 / 60 / 24);
			if (format.indexOf('%D') < 0) d = 0;
			h = parseInt(t / 60 / 60 - d * 24);
			if (format.indexOf('%H') < 0) h = 0;
			m = parseInt(t / 60 - d * 24 * 60 - h * 60);
			if (format.indexOf('%M') < 0) m = 0;
			s = t - d * 24 * 60 * 60 - h * 60 * 60 - m * 60;
			ms = limite_ms - t * 1000;
			var f = format.replace(/%S/g,number_pad(s,2));//Second
			f = f.replace(/%s/g,t.toString());//Stamp
			f = f.replace(/%MS/g,ms.toString());//Millisecond
			f = f.replace(/%ms/g,limite_ms.toString());//Millisecond Stamp
			f = f.replace(/%M/g,number_pad(m,2));//Minute
			f = f.replace(/%H/g,number_pad(h,2));//Hour
			f = f.replace(/%D/g,number_pad(d,2));//Day
			return f;
		},
		toTimeString:function(time,format){
			var dt = $.simpletimer.getDate(time);
			var y,m,d,h,i,s,ms,w,t;
			y = dt.getFullYear();m = dt.getMonth()+1;d = dt.getDate();
			h = dt.getHours();i = dt.getMinutes();s = dt.getSeconds();
			ms = dt.getMilliseconds();w = dt.getDay();t = parseInt(dt.getTime() / 1000);

			var f = format.replace(/%S/g,number_pad(s,2));//Second
			f = f.replace(/%s/g,t.toString());//Stamp
			f = f.replace(/%MS/g,ms.toString());//Millisecond
			f = f.replace(/%M/g,number_pad(i,2));//Minute
			f = f.replace(/%H/g,number_pad(h,2));//Hour
			f = f.replace(/%D/g,number_pad(d,2));//Day
			f = f.replace(/%m/g,number_pad(m,2));//Month(Int)
			f = f.replace(/%B/g,array_month[m]);//January
			f = f.replace(/%b/g,array_month[m + 12]);//Jan
			f = f.replace(/%Y/g,y.toString());//Year
			f = f.replace(/%W/g,w.toString());//Week(Int)
			f = f.replace(/%A/g,array_week[w]);//Monday
			f = f.replace(/%a/g,array_week[w + 7]);//Mon
			return f;
		},
		serverClientDelta:0
	});
	$.extend($.simpletimer,{
		setDelta:function(delta){
			$.simpletimer.serverClientDelta = delta;
		},
		getDelta:function(){
			return $.simpletimer.serverClientDelta;
		},
		setDeltaSSI:function(datestr){
			/*<!--#config timefmt="%m/%d/%Y %H:%M:%S" -->*/
			var now = new Date();
			var ssi = $.simpletimer.getDate(datestr);
			var delta = ssi.getTime() - now.getTime();
			$.simpletimer.serverClientDelta = delta;
			return delta;
		}
	});
	function simpletimer_main_method(t){
		var o = t.get(0);
		var variants = {countdown:{}};
		var method = {};
		method.countdown = function(){
			var delta = $.simpletimer.getDelta();
			var ms = $.simpletimer.countdown(delta,variants.countdown.target);
			var str = $.simpletimer.toLimitString(ms,variants.countdown.format);
			t.html(str);
		}
		this.startCountDown = function(target,format,duration){
			if (!t[0]) return t;
			this.stopCountDown();
			variants.countdown.target = $.simpletimer.getDate(target);
			variants.countdown.format = format;
			if (duration > 99){
				o.interval = setInterval(method.countdown,duration);
			} else {
				method.countdown();
			}
			return t;
		}
		this.stopCountDown = function(){
			if (typeof o.interval != 'undefined')
				clearInterval(o.interval);
			return t;
		}
	}
	$.fn.extend({simpletimer:function(){
		var t = this;
		var m = new simpletimer_main_method(t);
		return m;
	}
	});
	$.fn.extend({simpleCountdown : function(format){
		var t = this;
		if (!t[0]) return t;
		if (!format) format = '%H:%M:%S';
		var c = {interval:null,'t': t};
		c.target = t.attr('target');
		c.target = $.simpletimer.getDate(c.target);
		c.delta = $.simpletimer.serverClientDelta;

		c.timer = function(){
			var cd = $.simpletimer.countdown(c.delta,c.target);
			if (cd <= 0) {
				c.t.simpletimer().stopCountDown().html($.simpletimer.toLimitString(0,format));
				clearInterval(c.interval);
			}
		}
		var cd = $.simpletimer.countdown(c.delta,c.target);
		if (cd > 0) {
			c.t.simpletimer().startCountDown(c.target,format,500);
			c.interval = setInterval(c.timer,500);
		}
		return c.t;
	}
	});
	function XMLHttpRequest2Delta(XMLHttpRequest){
		var date = XMLHttpRequest.getResponseHeader('Date');
		date = $.simpletimer.getDate(date);
		var now = new Date();
		var delta = date.getTime() - now.getTime();
		$.simpletimer.setDelta(delta);
	}
	if ('<!--#set var="simpletimer" value="Server Side Includes"--><!--#echo var="simpletimer"-->' == 'Server Side Includes') //SSI support
		$.simpletimer.setDeltaSSI('<!--#echo var="DATE_LOCAL" -->');
	else{
		$.ajax({
			url:ajaxURL,
			type:'GET',
			cache:false,
			async:false,
			dataType:'text',
			success:function(data,textStatus,XMLHttpRequest){
				XMLHttpRequest2Delta(XMLHttpRequest);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				XMLHttpRequest2Delta(XMLHttpRequest);
			},
			timeout:5000
		});
	}
	
})(jQuery);/*  |xGv00|4da45dc218adf936efc0c61e15cbf104 */