/**
 * float menu(1 level).
 * 
 * @Author:Fly Mirage
 * @Date:2010-04-29
 * @Version:1.4
 *
 * @History:
 * ----------------------------------------------
 * v1.4		2010-09-27
 * # Fix,remove the iframe's scrollbar 
 * ----------------------------------------------
 * v1.3		2010-07-02
 * # Fix,remove method "showMenu" when menu hovering,it make running slower 
 * ----------------------------------------------
 * v1.2		2010-06-30
 * # Change the public variant to private of jQuery
 * # Fix,m.menu.unbind('hover') every showing,cuz the menus of parent may be the same one
 * ----------------------------------------------
 * v1.1		2010-04-30
 * # Add,absolute rect or relative rect(+=000px)
 * ----------------------------------------------
 * v1.0		2010-04-29
 * # Create it
 * 
 */
 
/**
 * @param namespace (String): ['simplemenu']
 * @param menuObject (jQuery object): [$('#xxxx_menu')]
 * @param menuRect (Object)
 * 					left (integer): [null],the absolutly left
 * 					top (integer): [null],the absolutly top
 * 					_left (integer): [null],the relative left ($('#theParentOfMenu').offset().left + menuRect._left)
 * 					_top (integer): [null],the relative top ($('#theParentOfMenu').offset().top + .height() + menuRect._top)
 * @param zIndex (integer): [1000]
 *
 * @comment $().ready(function(){ $('#test').simplemenu(); }); //must after dom ready(ie only)
 */
(function($){
	$.SimpleMenu = new Object();
	$.SimpleMenu.Active = {'simplemenu':null};
	$.SimpleMenu.Timer = {'simplemenu':null};
	$.fn.extend({simplemenu : function(namespace,menuObject,menuHoverStop,menuRect,frameBackground,zIndex){
		var t = this;
		if (!t[0]) {
			//throw('this object is not exists');
			return t;
		}
		function isUndefined(obj) {
			return typeof obj == 'undefined' ? true : false;
		}
		if (!(namespace instanceof String) || namespace == '') namespace = 'simplemenu';
		if ( isUndefined(menuHoverStop) || menuHoverStop == null ) menuHoverStop = true;
		if ( isUndefined(frameBackground) || frameBackground == null ) frameBackground = true;
		if ( isUndefined($.SimpleMenu.Timer[namespace]) ) 
			$.SimpleMenu.Timer[namespace] = null;
		if ( isUndefined($.SimpleMenu.Active[namespace]) ) 
			$.SimpleMenu.Active[namespace] = null;
		var _menuRect = {left:null,top:null,_left:null,_top:null};
		_menuRect = $.extend(_menuRect,menuRect);
		var m = {menu:$(!!menuObject ? menuObject : '#' + t.get(0).id + '_menu'),intelval:1000,'zIndex':zIndex > 2 ? zIndex : 1000};
		if (!m.menu.get(0)) {
			//throw('the menu is not exists');
			return t;
		}
		m.menu.hide();
		m.iframe = $('#simplemenu_frame');//fix ie6's select
		if (!m.iframe.get(0))
			m.iframe = $('<div id="simplemenu_frame" style="overflow:hidden;display:none;position:absolute;"><iframe src="about:blank" style="border:0;width:100%;height:100%;overflow:hidden;" scroll="no" scrolling="no" frameboder="0" ></iframe></div>').hide().appendTo('body');
		m.clearTimer = function(){
			clearTimeout($.SimpleMenu.Timer[namespace]);
			$.SimpleMenu.Timer[namespace] = null;
		}
		m.setTimer = function(){
			clearTimeout($.SimpleMenu.Timer[namespace]);
			$.SimpleMenu.Timer[namespace] = setTimeout(m.hideMenu,m.intelval);
		}
		m.showMenu = function(){
			if ($.SimpleMenu.Timer[namespace] != null)
				m.clearTimer();
			if ($.SimpleMenu.Active[namespace] != null) {
				//if ($.SimpleMenu.Active[namespace].get(0).menuParent === m.menu.get(0).menuParent) {
				//	return t;
				//} else {
					$.SimpleMenu.Active[namespace].hide();
					$.SimpleMenu.Active[namespace] = null;
					
				//}
			}
			var offset = t.offset();
			var rect = {w:t.width(),h:t.height(),l:offset.left,t:offset.top,mw:m.menu.width(),mh:m.menu.height()};
			if (!!_menuRect.left) rect.l = _menuRect.left;
			if (!!_menuRect.top) rect.t = _menuRect.top;
			if (!!_menuRect._left) rect.l += _menuRect._left;
			if (!!_menuRect._top) rect.t += _menuRect._top;
			if (frameBackground == true)
				m.iframe.css({left:rect.l,top:(rect.t + rect.h),'z-index':(m.zIndex - 1),width:rect.mw ,height:rect.mh}).show();			else 
				m.iframe.hide();
			m.menu.css({position:'absolute',left:rect.l,top:(rect.t + rect.h),'z-index':m.zIndex}).show();
			m.menu.get(0).menuParent = t.get(0);
			$.SimpleMenu.Active[namespace] = m.menu;
			if (menuHoverStop == true) {
				m.menu.unbind('hover').hover(function(){
					m.clearTimer();
				},function(){
					m.setTimer();
				});
			}
		}
		m.hideMenu = function(){
			//m.menu.unbind('hover');
			m.menu.hide();
			m.iframe.hide();
			$.SimpleMenu.Active[namespace] = null;
			m.clearTimer();
		}
		t.hover(
			function(){
				m.showMenu();
			},function(){
				m.setTimer();
			}
		);
		
		return t;
	}
	});
})(jQuery);/*  |xGv00|e504c01773f2c7410b57404f0da060bd */