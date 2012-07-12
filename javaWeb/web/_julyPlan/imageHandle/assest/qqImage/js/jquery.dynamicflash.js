/**
 * flash adv
 * 
 * @Author:Fly Mirage
 * @Date:2010-10-29
 * @Version:1.1
 *
 * @History:
 * ----------------------------------------------
 * v1.1		2010-11-02
 * # Add,method "timeout"
 * ----------------------------------------------
 * v1.0		2010-10-29
 * # Create it
 * 
 */
var tencent = (typeof window.tencent == 'undefined') ? new Object() : window.tencent;
tencent['dynamicflash'] = {
	close : function(selector,isaddons) {
		if (isaddons)
			jQuery(selector).dynamicflash('remove');
		else
			jQuery(selector).dynamicflash('close');
		return ;
	},
	replay : function(selector) {
		jQuery(selector).dynamicflash('replay');
		return;
	},
	timeout : function(selector,isaddons) {
		this.close(selector,isaddons);
	}
};
(function($){
$.fn.extend({dynamicflash:function(action,main_cfg,addons_cfg){
	var t = $(this);
	if (!t[0])
		return t;
	if (typeof action == 'undefined') action = 'show';
	var _cfg = {width:0,height:0,url:'',left:'auto',right:'auto',top:'auto',bottom:'auto',position:'auto',timeout:0,wmode:'transparent'};
	var _mainCfg = $.extend(_cfg,main_cfg);
	_cfg = {width:0,height:0,url:'',left:'auto',right:'auto',top:'auto',bottom:'auto',position:'auto',wmode:'opaque'};
	var _addonsCfg = $.extend(_cfg,addons_cfg);

	var method = {};
	method.main = $('.adv_main',t);
	method.addons = $('.adv_addons',t).hide();
	switch(action) {
		case 'replay':
			var h = method.main.html();
			method.main.empty().html(h).show();
			method.addons.hide();
			break;
		case 'show':
			if ($('embed',method.main).size() < 1) {
				$('<embed src="http://mat1.gtimg.com/hb/js/common/jquery/dynamicflash.swf?_=' + Math.random() +'" flashvars="' + encodeURI('url='+ _mainCfg.url +'&id='+ t.selector +'&timeout=' + _mainCfg.timeout) +'" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" width="'+ _mainCfg.width +'" height="'+ _mainCfg.height +'" wmode="' + _mainCfg.wmode + '" allowscriptaccess="always" type="application/x-shockwave-flash"></embed>')
				.appendTo(method.main);
				if (_mainCfg.position == 'fixed')
					method.main.simplefloat(_mainCfg);
				else
					method.main.css(_mainCfg);
			}
			method.main.show();
			if ($('embed',method.addons).size() < 1 && _addonsCfg.url != '') {
				$('<embed src="http://mat1.gtimg.com/hb/js/common/jquery/dynamicflash.swf?_=' + Math.random() +'" flashvars="' + encodeURI('url='+ _addonsCfg.url +'&id='+ t.selector +'&showreplay=true&isaddons=true') + '" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" width="'+ _addonsCfg.width +'" height="'+ _addonsCfg.height +'" wmode="' + _addonsCfg.wmode + '" allowscriptaccess="always" type="application/x-shockwave-flash"></embed>')
				.appendTo(method.addons);
				if (_addonsCfg.position == 'fixed')
					method.addons.simplefloat(_addonsCfg);
				else
					method.addons.css(_addonsCfg);
			}
			method.addons.hide();
			break;
		case 'close':
			method.main.hide();
			method.addons.show();
			break;
		case 'remove':
			t.remove();
			break;
	}
	
	return t;
}
});
})(jQuery);/*  |xGv00|a428841fe3b1948c5a5042b6d46c9111 */