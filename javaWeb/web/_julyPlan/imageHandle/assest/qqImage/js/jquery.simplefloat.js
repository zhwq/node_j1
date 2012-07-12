/**
 * position:fixed
 * <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 *
 * @Author:Fly Mirage
 * @Date:2010-05-04
 * @Version:1.7
 *
 * @History:
 * ----------------------------------------------
 * v1.7.1		2011-04-01/2011-04-06
 * # Fix,method "show"/"hide" return "this" instead of "t",(error in method "animate");
 * ----------------------------------------------
 * v1.6		2011-03-09
 * # Fix,unbind "show" ;
 * ----------------------------------------------
 * v1.5		2011-01-24
 * # Fix,it's error like animate({left:'auto'}) ;
 * ----------------------------------------------
 * v1.4		2010-11-02
 * # Add,overload jQuery.fn.show/hide;
 * # Fix,receive the show/hide message,adjust the rect when the dom turn to show
 * ----------------------------------------------
 * v1.3		2010-10-28
 * # Add,support left/top is center
 * ----------------------------------------------
 * v1.2		2010-05-19
 * # Fix,Position:Fixed when IE 7+ in standards mode
 * # Fix,"left/top/right/bottom" is 'auto' when position:none on chrome
 * ----------------------------------------------
 * v1.1		2010-05-06
 * # Add parameter "animate"
 * # Unbind "resize/scroll" with stoping;
 * ----------------------------------------------
 * v1.0		2010-05-04
 * # Create it
 * 
 */
 
/**
 * @param position (object): control the queue with buttons
 *					left (interage): [auto]|length
 *					right (boolean): [auto]|length
 *					top (boolean): [auto]|length
 *					bottom (boolean): [auto]|length
 * @param position (boolean): if position === true then stop float;
 * @param animate (boolean): [true]|false;
 * @param parent (object): [window/document.body],the element of "document.getElementByid('')";
 *
 */
 
(function($){
jQuery.fn.__hide = jQuery.fn.hide;
jQuery.fn.__show = jQuery.fn.show;
jQuery.fn.extend({hide:function(a,b){
	this.__hide(a,b);
	this.triggerHandler('hide');
	return this;
},show:function(a,b){
	this.__show(a,b);
	this.triggerHandler('show');
	return this;
}});
jQuery.fn.extend({simplefloat:function(position,animate,parent){
	var t = this;
	var o = t[0];
	if (!t[0]) return t;
	var is_ie = $.browser.msie && !(document.all && document.compatMode=="CSS1Compat" && window.XMLHttpRequest);// IE6 or  IE7+ browsers not in standards mode
	var w3c = document.compatMode == "CSS1Compat";
	var _parent = !parent ? $(window) : $(parent);
	if (!parent) {
		if (is_ie) {
			if (document.documentElement.clientWidth == 0)
				parent = document.body;
			else
				parent = document.documentElement;
		} else if ($.browser.opera) {
			parent = document.body;
		} else {
			if (w3c) 
				parent = document.documentElement;
			else
				parent = document.body;
		}
	}
	if (position === true) {
		if (is_ie) {
			_parent.unbind('scroll',o.simplefloat);
			_parent.unbind('resize',o.simplefloat);
		} else 
			_parent.unbind('resize',o.simplefloat);
		t.unbind('show',o.simplefloat_show);
		return t;
	}
	var rect = {w:t.width(),h:t.height(),l:t.css('left'),r:t.css('right'),'t':t.css('top'),b:t.css('bottom')};
	if (!is_ie && rect.l == 'auto' && rect.r == 'auto' && rect.t == 'auto' && rect.b == 'auto') {
		t.css('position','fixed');//fixed chrome
		rect = {w:t.width(),h:t.height(),l:t.css('left'),r:t.css('right'),'t':t.css('top'),b:t.css('bottom')};
	}
	if (rect.l != 'auto') rect.l = parseInt(rect.l);
	if (rect.r != 'auto') rect.r = parseInt(rect.r);
	if (rect.t != 'auto') rect.t = parseInt(rect.t);
	if (rect.b != 'auto') rect.b = parseInt(rect.b);
	var _pos = {left:rect.l,right:rect.r,top:rect.t,bottom:rect.b};
	_pos = $.extend(_pos,position);
	
	rect.restore = function(){
		if (is_ie && t.is(':visible')) {
			var sl = _parent.scrollLeft();
			var st = _parent.scrollTop();
			var _l = 'auto';var _t = 'auto';
			if(_pos.left == 'center') {
				_l = ( parent.clientWidth - t.width() ) / 2;
				if (_l < 0) _l = 0;
			} else
				_l = !isNaN(_pos.left) ? _pos.left : parent.clientWidth - _pos.right - t.width();
			if (_pos.top == 'center') {
				_t = ( parent.clientHeight - t.height() ) / 2;
				if (_t < 0) _t = 0;
			} else
				_t = !isNaN(_pos.top) ? _pos.top : parent.clientHeight - _pos.bottom - t.height();
			var r = {left:(_l + sl),top:(_t + st)};
			if (animate)
				t.stop().animate(r);
			else
				t.stop().css(r);
		}
	}
	rect.resize = function() { /*2010-11-02*/
		if (!is_ie && t.is(':visible')) { //w3c
			var _l = _pos.left;var _t = _pos.top;
			if(_pos.left == 'center') {
				_l = ( parent.clientWidth - t.width() ) / 2;
				if (_l < 0) _l = 0;
			}
			if (_pos.top == 'center') {
				_t = ( parent.clientHeight - t.height() ) / 2;
				if (_t < 0) _t = 0;
			}
			var r = {left:_l,top:_t,right:_pos.right,bottom:_pos.bottom};
			if (r.left == 'auto') delete r.left; /*2011-01-24*/
			if (r.right == 'auto') delete r.right;
			if (r.bottom == 'auto') delete r.bottom;
			if (r.top == 'auto') delete r.top;
			if (animate)
				t.stop().animate(r);
			else
				t.stop().css(r);
		}
	}
	if (is_ie) {
		t.css('position','absolute');
		rect.restore(); //init
		_parent.bind('scroll',o.simplefloat = function(){rect.restore()});
		_parent.bind('resize',o.simplefloat);
	} else {
		t.css({'position': 'fixed',
			left:(!isNaN(_pos.left) ? _pos.left : 'auto'),
			right:(!isNaN(_pos.right) ? _pos.right : 'auto'),
			top:(!isNaN(_pos.top) ? _pos.top : 'auto'),
			bottom:(!isNaN(_pos.bottom) ? _pos.bottom : 'auto')
		});
		rect.resize(); //init
		_parent.bind('resize',o.simplefloat = function(){rect.resize()});
	}
	t.bind('show',o.simplefloat_show = function(){
		rect.resize();
		rect.restore();
	});
	return t;
}
});

})(jQuery);/*  |xGv00|9b867a3cd244b850811290c5a3019bc2 */