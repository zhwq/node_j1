/**
 * @fileoverview TS �����ռ�����.
 * @author shiran<shiran@taobao.com>
 */
//��Ի: Ϊ���Ե�, Ʃ�籱��, �����������ǹ�֮. <���� - Ϊ��>

if ('undefined' === typeof TS) {

	/**
	 * @name TS
	 * @namespace
	 */
	TS = {};

}
/**
 * @fileoverview ��ȡ��ǰ host.
 * @author ��Ȼ<nanzhienai@163.com>
 */
//��Ի: �˶�����, ��֪���Ҳ. ������, С�����, �������֮��! <���� - Ϊ��>
;(function(K, T) {

	var D = K.DOM,
		h = location.host,
		DAILY_REG = /(?:(.+)\.)*daily\.(.+?)\.net/i,
		FORMAL_REG = /(?:(.+)\.)*([^.]+?)\.com/i,
		HOST_REG = /\{(.+?)Server\}/i,
		EMPTY = '',
		uri;

	/**
	 * ��ȡ��ǰ host
	 * @memberof TS
	 * @namespace
	 */
	uri = {

		/**
		 * @lends TS.uri
		 * @static
		 */

		/**
		 * �ж��Ƿ��� daily
		 * @private
		 */
		_checkDaily: function() {

			return h.indexOf('.daily.') > -1;

		},

		/**
		 * ��ȡ server ��ַ
		 * @param { String } url ��Ҫ��ȡ�� server ��ַ.
		 * @param { Boolean } addStamp �Ƿ����ʱ���.
		 * @return { String } �޸ĺ�� server ��ַ.
		 * @example:
		 * 		TS.uri.getServer('http://jianghu.{taobaoServer}/home.htm'); // http://jianghu.taobao.com/home.htm
		 * 		TS.uri.getServer('http://www.{tmallServer}/index.html'); // http://www.tamll.com/home.htm
		 */
		getServer: function(url, addStamp) {

			var host = this,
				m = HOST_REG.exec(url),
				server,
				ret;

			if (!(m && m[1])) {

				ret = url;

			} else {

				server = m[1];

				if (!host._checkDaily()) {

					ret = url.replace(HOST_REG, server + '.com');

				} else {

					ret = url.replace(HOST_REG, 'daily.' + server + '.net');

				}

			}

			if (addStamp) {

				return host.addStamp(ret);

			}

			return ret;

		},

		/**
		 * ��ȡ cdn ��ַ
		 * @param { String } url ��Ҫ�޸ĵ� url, ��ѡ.
		 * @return { String } ���û������ url �򷵻� host.
		 * @example:
		 * 		TS.uri.getCdn('p/sns/1.0/tbra-sns.js');
		 */
		getCdn: function(url) {

			var host = this,
				cdn = host._checkDaily() ? 'http://assets.daily.taobao.net/' : 'http://a.tbcdn.cn/';

			return url ? (cdn + url) : cdn;

		},

		/**
		 * ���ʱ���
		 * @param { String } url ��Ҫ���ʱ����� url.
		 * @return { String } ���ʱ������ url.
		 * @example:
		 * 		TS.uri.addStamp('http://www.12sui.cn/'); //print: http://www.12sui.cn/?t=1232421394
		 */
		addStamp: function(url) {

			var mark = this._checkQmark(url) ? '&' : '?',
				day = new Date().getTime();

			return url + mark + 't=' + day;

		},

		/**
		 * ����Ƿ���� ?
		 * @private
		 * @param { String } url ��Ҫ���� url.
		 * @return { Boolean } ������� ?, ���� true, ���򷵻� false.
		 */
		_checkQmark: function(url) {

			return url.indexOf('?') > -1;

		},

		/**
		 * ���� url
		 * @param { String } url ��ʼ url.
		 * @param { String | Object } params Ҫƴ�ӵĲ�����.
		 * @return { String } �����õ��ַ���.
		 */
		buildUri: function(url, params) {

			var mark = this._checkQmark(url) ? '&' : '?';

			return url + mark + (K.isPlainObject(params) ? K.param(params) : params);

		},

		/**
		 * ת��
		 * @param { String } str �ַ���.
		 * @return { String } ת�����ַ���
		 */
		escape: function(str) {

			return str.replace(/(%|&|\?|#)/g, function(nul, k) {
				   return escape(k);
			}).replace(/\+/g, '%2b');

		},

		/**
		 * encode ����, �� escape ��ͬ, �����Ӣ�ı��֮��ı���, ������������� value ֵΪ�����������, ����������
		 * @param { String Object } str ��Ҫ������ַ������߶���.
		 * @return { String } �������ַ���.
		 */
		encode: function(str) {

			var host = this,
				regexp = /[^\x00-\xff]/g,
				m, s, _str = EMPTY,
				i;

			if (K.isPlainObject(str)) {

				for (i in str) {

					var value = str[i];

					if (K.isString(value)) {

						value = host.escape(value);

					}

					_str += i + '=' + value + '&';

				}

			} else {

				_str = str;

			}

			if (!K.isString(_str)) {

				return false;

			}

			s = _str;

			while (m = regexp.exec(_str)) {

				s = s.split(m[0]).join(escape(m[0]).split('%').join('\\'));

			}

			return s;

		}

	};

	return T.uri = uri;

})(KISSY, TS);
/**
 * @fileoverview ��¼ģ��.
 * @author ��Ȼ<nanzhienai@163.com>
 */
//��Ի: <ʫ> ����, һ���Ա�֮, Ի: ˼��а. <���� - Ϊ��>
;(function(K, T) {

	var win = window,
		doc = document,
		D = K.DOM,
		E = K.Event,
		uri = T.uri,
		SUCCESS_URL = uri.getServer('http://www.{taobaoServer}/go/act/share/loginsuccess.php'),
		LOGIN_URL = uri.getServer('https://login.{taobaoServer}/member/login.jhtml?from=share&style=mini&is_ignore=false&redirect_url=') + escape(SUCCESS_URL),
		LOGINCHECK_URL = uri.getServer('http://www.{taobaoServer}/go/act/share/logincheck.php'),
		login;

	/**
	 * ��¼ģ��
	 * @memberof TS
	 * @namespace
	 */

	login = {

		/**
		 * @lends TS.login.prototype
		 * @static
		 */

		/**
         * ����û��Ƿ��¼
		 * @param { Object } callback �ص�����, �� true �� false.
         * @return { Boolean }  true ��ʾ�û��Ѿ���¼.
         */
        check: function(callback) {

			//if(location.host.search(/localhost|10\.|127\.0\.0\.1/i) > -1) return true;

			//return K.unparam(K.Cookie.get('uc1'))['cookie15'] && K.Cookie.get('_nk_');

			var host = this,
				isLogin,
				cookie,
				cb;

			//���ȳ��Զ�ȡ cookie, �����ȡ����, ������������ٴ��ж�, �Ե�¼�û����Լ��ٲ�������
			if ((K.unparam(K.Cookie.get('uc1'))['cookie15'] && K.Cookie.get('_nk_')) || K.Cookie.get('ck1')) {

					cb = callback['true'];

					cb && cb();

			} else {

				T.IO.getScript(LOGINCHECK_URL + '?t=' + new Date().getTime(), function() {

					cookie = T['_userCookie'];
					isLogin = Boolean(K.unparam(cookie['uc1'].replace(/&amp;/g, '&'))['cookie15'] && cookie['_nk_']);

					cb = callback[isLogin.toString()];

					cb && cb();

				});

			}

        },

        /**
         * ����¼״̬�����û�е�¼����ʾ��¼��
		 * @param { Function } callback �ص�����.
		 * @return { Object } T.login.
         */
        show: function(callback) {

			var host = this,
				popup = host['popup'],
				func = callback ? callback : function() {};

			host['callback'] = func;

			host.check({

				'true':	function() {

					func();

				},

				'false': function() {

					if (popup&&false) {

						K.log('login: ��¼���Ѿ�����, �޸� iframe ��ַ.');

						//�޸� iframe ��src
						popup['contentEl'].getElementsByTagName('iframe')[0].src = LOGIN_URL;

						popup.show();
						popup.center();
						//�̶�����
						popup.fix();

					} else {

						K.log('login: ��¼�㲻����, ��ʼ��������.');

						host._initOverlay();

					}

				}

			});

			return host;

        },

		/**
		 * ���ص�¼��
		 * @return { Object } T.login.
		 */
		hide: function() {

			var host = this;

			host['popup'].hide();

			return host;

		},

		/**
		 * ��ʼ��������
		 * @private
		 */
		_initOverlay: function() {

			var host = this,
				popup;

			popup = host['popup'] = new T.Popup({
				elCls: 'tb-ts-login',
				content: '<iframe width="410" height="270" data-status="0" src="' + LOGIN_URL + '" frameborder="0" id="shareIframe" name="shareIframe" scrolling="no" onload="TS.login.checkLocation(this.name);"></iframe><a href="#" class="close J_Close"></a>'
			});

			host._initStyle();

			host._bindEvent();

			popup.show();
			popup.center();
			//�̶�����
			popup.fix();

		},

		/**
		 * ��� url
		 * @name { String } iframeName iframe name ��
		 */
		checkLocation: function(iframeName) {

			K.log('login: �ж��Ƿ��ǵ�¼�ɹ���ת.');

			var host = this,
				iframe = D.get('#' + iframeName),
				href;

			if ('0' === D.attr(iframe, 'data-status')) {

				K.log('login: ��һ�������¼ҳ��, �������ж�.');
				D.attr(iframe, 'data-status', '1');

			} else {

				K.log('login: ��ʼ�ж��Ƿ��¼�ɹ�.');

				try {

					href = win.frames[iframeName].location.href;

					K.log('login: ���Ի�ȡ��ת�������: ' + href + ', �ǲ���: ' + SUCCESS_URL);

					if (href) {

						if (SUCCESS_URL === href) {

							S.log('login: url һ��, ��¼�ɹ�, �رո�����, ִ�лص�.');

							host.hide();

							host['callback']();

						}

					} else {

						//���ȡ������ǿ�Ƴ���, ���� catch
						K.log('login: �޷���ȡ iframe ��ַ, ǿ�Ʊ���.');

						fuck();//�ණ��

					}

				} catch (e) {

					K.log('login: ��ȡ����ʧ��, �����ж� cookie.');

					host.check({

						'true': function() {

							K.log('login: ��¼�ɹ�, �رո�����, ִ�лص�.');

							host.hide();

							host['callback']();

						}

					});

				}

			}

		},

		/**
		 * ������ʽ
		 * @private
		 */
		_initStyle: function() {

			D.addStyleSheet(

				'.tb-ts-login { border:1px solid #aaa; box-shadow:3px 3px 3px rgba(0, 0, 0, 0.2); width:410px; height:307px; background:#fafafa} ' +
				'.tb-ts-login .close { background:url(http://img03.taobaocdn.com/tps/i1/T1k.tYXadGXXXXXXXX-146-77.png) no-repeat -132px 0; height:17px; position:absolute; right:5px; top:5px; width:17px; }'

			);

		},

		/**
		 * �����¼�
		 * @private
		 */
		_bindEvent: function() {

			var host = this;

			E.on(host['popup']['contentEl'], 'click', function(ev) {

				var target = ev.target;

				if (D.hasClass(target, 'J_Close')) {

					ev.preventDefault();

					host.hide();

				}

			});

		}

	};

	return T.login = login;

})(KISSY, TS);

/**
 * @fileoverview �󶨺����������Լ�����.
 * @author ��Ȼ<nanzhienai@163.com>
 */
//��Ի: �¹ʶ�֪��, ����Ϊʦ��. <���� - Ϊ��>
;(function(K, T) {

 	/**
	 * �󶨺����������Լ�����
	 * @memberOf TS
	 * @function
	 * @param { Object } context ������.
	 * @param { Function } method ����.
	 * @param { Array } params ��������.
	 * @return { Function } �󶨺�ĺ���.
	 */
	function hitch(context, method, params) {

		var func = K.isString(method) ? context[method] : method;

		return function() {

			var args = arguments ? K.makeArray(arguments) : [];

			if (params) {

				args = params.concat(args);

			}

			func.apply(context, args);

		};

	}

	return T.hitch = hitch;

})(KISSY, TS);
/**
 * @fileoverview ������, ��ΪĿǰ���� overlay �汾��һ, ����ֻ�ܼ�дһ��������.
 * @author ��Ȼ<nanzhienai@163.com>
 */
//��Ի: ѧ����˼����, ������ѧ���. <���� - Ϊ��>
;(function(K, T) {

	var doc = document,
		win = window,
		D = K.DOM,
		E = K.Event,
		//����
		CONTENT_EL = 'contentEl',
		CONFIG = 'config',
		CLICK = 'click',
		TIMER = 'timer',
		EVENTS = 'events',
		FILTER = 'filter',
		AUTO_HIDE = 'autoHide',
		VISIBILITY = 'visibility',
		HIDDEN = 'hidden',
		VISIBLE = 'visible',
		MASK = 'mask',
		DISPLAY = 'display',
		NONE = 'none',
		BLOCK = 'block',
		SRC_NODE = 'srcNode',
		CALLBACK = 'callback',
		J_CLOSE = 'J_Close',
		PX = 'px',
		IS_SHOW = false,
		UA = K.UA,
		//����
		defaultConfig = {

			elCls: '',
			content: ''

		};

	/**
	 * �򵥸�����
	 * @memberof TS
	 * @constructor
	 */
	function Popup(cfg) {

		this._init(cfg);

	}

	Popup.prototype = {

		/**
		 * @lends TS.Popup
		 */

		/**
		 * ��ʼ��
		 * @private
		 * @param { Object } cfg ������.
		 */
		_init: function(cfg) {

			var host = this,
				popup = D.create('<div class="ts-popup" style="position:' + (6 === UA.ie ? 'absolute' : 'fixed') + ';z-index:10001;visibility:hidden"></div>'),
				config = K.merge(defaultConfig, cfg),
				owner = config.srcNode || doc.body;

			//�����Ȳ���ڵ�, ��Ϊ ie6 ��֧��δ�����ĵ��Ľڵ���Ⱦ html5 ��ǩ
			host.prepend(popup, owner);
			popup.innerHTML = config.content;
			//D.html(popup, config.content); // KISSY 1.0.8 ������, �ᵼ�� html5 ��ǩʧЧ

			config.style && D.css(popup, config.style);
			D.addClass(popup, config.elCls);

			host[CONTENT_EL] = popup;
			host[CONFIG] = config;

			if (config.mask) {

				host.createMask();

			}

			//�����¼�
			host._bindEvent();

	    },

		/**
		 * �����¼�
		 * @private
		 */
		_bindEvent: function() {

			var host = this;

			E.on(host[CONTENT_EL], CLICK, function(ev) {

				var target = ev.target,
					i, len, events = host[CONFIG][EVENTS];

				//�ر�
				if (D.hasClass(target, J_CLOSE)) {

					ev.preventDefault();

					host.hide();

				}

				//�Զ����¼�
				if (events && events.length > 0) {

					for (i = 0, len = events.length; i < len; i++) {

						if (events[i][FILTER](target)) {

							events[i][CALLBACK](target);

						}

					}

				}

			});

		},

		/**
		 * ���ݽڵ㶨λ������
		 * @param { HTMLelement } root �ڵ�.
		 * @param { String } pos λ��.
		 * @param { Array } offset ƫ��.
		 * @return this.
		 */
		position: function(root, pos, offset) {

			var host = this,
				config = host[CONFIG],
				popup = host[CONTENT_EL],
				node = D.get(root),
				sof = D.offset(node),
				sw = node.offsetWidth,
				sh = node.offsetHeight,
				pw = popup.offsetWidth,
				ph = popup.offsetHeight,
				of = offset || [0, 0],
				srcNode = config[SRC_NODE],
				offset,
				rl, rt;

			switch (pos) {

				case 'tr':
					rl = sof['left'] + sw - pw + of[0];
					rt = sof['top'] - ph + of[1];
					break;

				case 'tl':
					rl = sof['left'] + of[0];
					rt = sof['top'] - ph + of[1];
					break;

				case 'br':
					rl = sof['left'] + sw - pw + of[0];
					rt = sof['top'] + sh + of[1];
					break;

				default:
					rl = sof['left'] + of[0];
					rt = sof['top'] + sh + of[1];

			}

			if (srcNode) {

				offset = D.offset(srcNode);
				rl -= offset['left'];
				rt -= offset['top'];

			}

			D.css(popup, { 'left': rl + PX, 'top': rt + PX });


		},

		/**
		 * ���뵽��һ����Ԫ��
		 * @param { HTMLelement } node �µĽڵ�.
		 * @param { HTMLelement } srcNode ��Ҫ���뵽�Ľڵ�.
		 */
		prepend: function(node, srcNode) {

			var children = D.children(srcNode),
				first;

			if (children.length > 0) {

				first = children[0];

				D.insertBefore(node, first);

			} else {

				D.get(srcNode).appendChild(node);

			}

		},

		/**
		 * �ø��������
		 */
		center: function() {

			var host = this;

			host.centerAlign();
			host.centerValign();

		},

		/**
		 * ��ֱ����
		 */
		centerValign: function() {

			var host = this,
				config = host[CONFIG],
				popup = host[CONTENT_EL],
				stop = 6 === UA.ie ? D.scrollTop() : 0,
				vh = D.viewportHeight(),
				oh = popup.offsetHeight;

			D.css(popup, { 'top': stop + (vh - oh) / 2 + PX });

		},

		/**
		 * ˮƽ����
		 */
		centerAlign: function() {

			var host = this,
				config = host[CONFIG],
				popup = host[CONTENT_EL],
				vw = D.viewportWidth(),
				ow = popup.offsetWidth;

			D.css(popup, { 'left': (vw - ow) / 2 + PX });

		},

		/**
		 * ie6 �¹̶����м�
		 */
		fix: function() {

			var host = this,
				i;

			if (6 === UA.ie) {

				if (host['hasFixedEvent']) {
					//���������

					return false;

				}

				E.on(win, 'scroll resize', function(ev) {

					if (host[IS_SHOW]) {

						host.centerValign();
						//����Ѿ������¼�
						host['hasFixedEvent'] = true;

					}

				});

			}

		},

		/**
		 * ��������
		 * @param { String | HTMLelement } html �ַ������߽ڵ�.
		 */
		setContent: function(html) {

			var host = this,
				popup = host[CONTENT_EL],
				node;

			popup.innerHTML = '';

			node = K.isString(html) ? D.create(html) : html;

			popup.appendChild(node);

		},

		/**
		 * ��������
		 */
		createMask: function() {

			var host = this,
				height = D.docHeight(),
				width = D.docWidth(),
				mask = D.create('<div class="ts-mask" style="height:' + height + 'px;display:none">' + (6 === UA.ie ? ('<iframe scrolling="no" frameborder="0" src="about:blank" width="' + width + '" height="' + height + '" style="filter:alpha(opacity=0.1)"></iframe>') : '') + '</div>');

			host.prepend(mask, doc.body);

			host[MASK] = mask;

		},

		/**
		 * ��ʾ����
		 */
		showMask: function() {

			var mask = this[MASK];

			mask && D.css(mask, DISPLAY, BLOCK);

		},

		/**
		 * ��������
		 */
		hideMask: function() {

			var mask = this[MASK];

			mask && D.css(mask, DISPLAY, NONE);

		},

		/**
		 * ��ʾ������
		 * @return this.
		 */
		show: function() {

			var host = this,
				timer;

			if (host[CONFIG][AUTO_HIDE]) {

				timer = host[TIMER];

				if (timer) {

					clearTimeout(timer);

				}

				host[TIMER] = setTimeout(function() {

					host.hide();

					host[TIMER] = null;

				}, 3000);

			}

			host.showMask();

			D.css(host[CONTENT_EL], VISIBILITY, VISIBLE);

			host[IS_SHOW] = true;

			return host;

		},

		/**
		 * ���ظ�����
		 * @return this.
		 */
		hide: function() {

			var host = this;

			D.css(host[CONTENT_EL], VISIBILITY, HIDDEN);

			host.hideMask();

			host[IS_SHOW] = false;

			return host;

		},

		/**
		 * ���ٸ�����
		 * @return this.
		 */
		destroy: function() {

			var host = this,
				popup = host[CONTENT_EL];

			popup.parentNode.removeChild(popup);

			host[IS_SHOW] = false;

			return host;

		}

	};


	return T.Popup = Popup;


})(KISSY, TS);
/**
 * @fileoverview KISSY Template Engine.
 * @author 文河(yyfrankyy) <yyfrankyy@gmail.com>
 * @see https://github.com/yyfrankyy/kissy/tree/template/src/template
 *
 * @license
 * Copyright (c) 2010 Taobao Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

;(function() {

	if (KISSY.Template) {
		return false;
	}

KISSY.add('template', function(S) {

    var defaultConfig = {},

        // Template Cache
        templateCache = {},

        // start/end tag mark
        tagStartEnd = {
            '#': 'start',
            '/': 'end'
        },

        // Regexp Cache
        regexpCache = {},
        getRegexp = function(regexp) {
            if (!(regexp in regexpCache)) {
                regexpCache[regexp] = new RegExp(regexp, 'ig');
            }
            return regexpCache[regexp];
        },

        // static string
        KS_TEMPL_STAT_PARAM = 'KS_TEMPL_STAT_PARAM',
        KS_TEMPL = 'KS_TEMPL',
        KS_DATA = 'KS_DATA_',
        KS_EMPTY = '',
        KS_AS = 'as',

        PREFIX = '");',
        SUFFIX = KS_TEMPL + '.push("',

        PARSER_SYNTAX_ERROR = 'KISSY.Template: Syntax Error. ',
        PARSER_RENDER_ERROR = 'KISSY.Template: Render Error. ',

        PARSER_PREFIX = 'var ' + KS_TEMPL + '=[],' +
            KS_TEMPL_STAT_PARAM + '=false;with(',
        PARSER_MIDDLE = '||{}){try{' + KS_TEMPL + '.push("',
        PARSER_SUFFIX = '");}catch(e){' + KS_TEMPL + '=["' +
            PARSER_RENDER_ERROR + '" + e.message]}};return ' +
            KS_TEMPL + '.join("");',

        // build a static parser
        buildParser = function(templ) {
            var _parser, _empty_index;
            return S.trim(templ).replace(getRegexp('[\r\t\n]'), ' ')
                .replace(getRegexp('(["\'])'), '\\$1')
                .replace(getRegexp('\{\{([#/]?)(?!\}\})([^}]*)\}\}'),
                    function(all, expr, oper) {
                    _parser = KS_EMPTY;
                    // is an expression
                    if (expr) {
                        oper = S.trim(oper);
                        _empty_index = oper.indexOf(' ');
                        oper = _empty_index === -1 ? [oper, ''] :
                                [oper.substring(0, oper.indexOf(' ')),
                                oper.substring(oper.indexOf(' '))];
                        for (var i in Statements) {
                            if (oper[0] !== i) continue;
                            oper.shift();
                            if (expr in tagStartEnd) {
                                // get expression definition function/string
                                var fn = Statements[i][tagStartEnd[expr]],
                                    _oper = S.trim(oper.join(KS_EMPTY)
                                        .replace(getRegexp('\\\\([\'"])'),
                                            '$1'));
                                _parser = S.isFunction(fn) ?
                                    fn.apply(this, _oper.split(/\s+/)) :
                                    fn.replace(
                                        getRegexp(KS_TEMPL_STAT_PARAM),
                                        'typeof ' + _oper +
                                        '!=="undefined"&&' + _oper
                                    );
                            }
                        }
                    }

                    // return array directly
                    else {
                        _parser = KS_TEMPL +
                            '.push(' +
                            oper.replace(getRegexp('\\\\([\'"])'), '$1') + ');';
                    }
                    return PREFIX + _parser + SUFFIX;

                });
        },

        // convert any object to array
        toArray = function(args) {
            return [].slice.call(args);
        },

        // join any array to string by empty
        join = function(args) {
            return toArray(args).join(KS_EMPTY);
        },

        // expression
        Statements = {
            'if': {
                start: 'if(' + KS_TEMPL_STAT_PARAM + '){',
                end: '}'
            },

            'else': {
                start: '}else{'
            },

            'elseif': {
                start: '}else if(' + KS_TEMPL_STAT_PARAM + '){'
            },

            // KISSY.each function wrap
            'each': {
                start: function() {
                    var args = toArray(arguments),
                        _ks_value = '_ks_value', _ks_index = '_ks_index';
                    if (args[1] === KS_AS && args[2]) {
                        if (args[3] === '->') {
                            _ks_index = args[2] || _ks_index;
                            _ks_value = args[4] || _ks_value;
                        } else {
                            _ks_value = args[2] || _ks_value;
                        }
                    }
                    var r = 'KISSY.each(' + args[0] +
                            ', function(' + _ks_value + ', ' + _ks_index + '){';
                    return r;
                },
                end: '});'
            },

            // comments
            '!': {
                start: '/*' + KS_TEMPL_STAT_PARAM + '*/'
            }
        },

        /**
         * Template
         * @param {String} templ template to be rendered.
         * @param {Object} config configuration.
         * @return {Object} return this for chain.
         */
        Template = function(templ, config) {
            S.mix(defaultConfig, config);
            if (!(templ in templateCache)) {
                var _ks_data = KS_DATA + S.now(), func,
                    _parser = [
                        PARSER_PREFIX,
                        _ks_data,
                        PARSER_MIDDLE,
                        buildParser(templ),
                        PARSER_SUFFIX
                    ];

                try {
                    func = new Function(_ks_data, _parser.join(KS_EMPTY));
                } catch (e) {
                    _parser[3] = PREFIX + SUFFIX + PARSER_SYNTAX_ERROR + ',' +
                        e.message + PREFIX + SUFFIX;
                    func = new Function(_ks_data, _parser.join(KS_EMPTY));
                }

                templateCache[templ] = {
                    name: _ks_data,
                    parser: _parser.join(KS_EMPTY),
                    render: func
                };
            }
            return templateCache[templ];
        };

        S.mix(Template, {
            /**
             * Logging Compiled Template Codes
             * @param {String} templ template string.
             */
            log: function(templ) {
                if (templ in templateCache) {
                    if ('js_beautify' in window) {
                        S.log(js_beautify(templateCache[templ].parser, {
                            indent_size: 4,
                            indent_char: ' ',
                            preserve_newlines: true,
                            braces_on_own_line: false,
                            keep_array_indentation: false,
                            space_after_anon_function: true
                        }), 'info');
                    } else {
                        S.log(templateCache[templ].parser, 'info');
                    }
                } else {
                    Template(templ);
                    this.log(templ);
                }
            },

            /**
             * add statement for extending template tags
             * @param {String} statement tag name.
             * @param {String} o extent tag object.
             */
            addStatement: function(statement, o) {
                if (S.isString(statement) && S.isObject(o)) {
                    Statements[statement] = o;
                }
            }

        });

    S.Template = Template;
    return Template;

}, {requires: ['core']});

})();
/**
 * @fileoverview ����ģ��.
 * @author ��Ȼ<nanzhienai@163.com>
 * @require ./uri.js, ./hitch.js
 */
//��Ի: ��ʮ�����־��ѧ, ��ʮ����, ��ʮ������, ��ʮ��֪����, ��ʮ����˳, ��ʮ���������������. <���� - Ϊ��>
;(function(K, T) {

	if (T.root) {
		return false;
	}

	var REQUIRE_COUNT = '_requireCount',
		CALLBACK_QUEUE = '_callbackQueue',
		PATH = 'apps/snstaoshare/widget/ts',
		doc = document,
		IO = K.IO,
		D = K.DOM,
		JSONP_NUM = 0,
		uri = T.uri;

	K.mix(TS, {

		/**
		 * @lends TS
		 * @static
		 */

		/**
		 * ��·��
		 * @property
		 * @const
		 */
		root: 'apps/snstaoshare/widget/ts/',

		/**
		 * ������ͳ��
		 * @private
		 * @property
		 */
		_requireCount: 0,

		/**
		 * �ص���������
		 * @private
		 * @property
		 */
		_callbackQueue: [],

		/**
		 * ȫ�ֺ�������
		 * @private
		 * @property
		 */
		_globalObject: {},

		/**
		 * IO
		 * ���� KISSY 1.0.8
		 */
		IO: {

			getScript: IO ? IO.getScript : (K.getScript ? K.getScript : K.Ajax.getScript), //nnd, fuck kissy!!!!!!!!!

			jsonp: IO ? IO.jsonp : function(url, callback) {

				var host = T.IO,
					id = '_jsonp_' + JSONP_NUM++;

				host[id] = callback;

				host.getScript(uri.buildUri(url, 'callback=TS.IO.' + id));

			}

		},

		/**
		 * �����������
		 * @param { String } url ������� url.
		 * @param { Object | String } param ������������ַ�����ʽ ( key1=value1&key2=value2 ).
		 * @param { Function } callback �ص�����.
		 */
		interactServer: function(url, param, callback) {

			var host = this,
				str,
				version;

			str = param ? uri.encode(param) : '';

			host[REQUIRE_COUNT]++;

			host.IO.jsonp(

				uri.buildUri(uri.addStamp(url), str),

				function(data) {

					host[REQUIRE_COUNT]--;

					host[CALLBACK_QUEUE].push(T.hitch(host, callback, [data]));

					host._excuteCallback();

				}

			);

		},


		/**
		 * ����ű�
		 * @param { String } url �ű�·��.
		 * @param { Function } callback �ص�����.
		 */
		loadScript: function(url, callback) {

			var host = this;

			//����Ѽ���, ֱ��ִ��
			if (K.indexOf(url, host['_loadedScript']) > -1) {
				return host._excuteCallback();
			}

			host[REQUIRE_COUNT]++;
			host.ready(callback);

			if ((location.href.indexOf('ks-debug') > -1) && url.indexOf('.source.') < 0) {

				url = url.replace(/\.js/, '.source.js');

			}

			return host.IO.getScript(url, function() {

				host[REQUIRE_COUNT]--;
				host['_loadedScript'].push(url);
				host._excuteCallback();

			});

		},

		/**
		 * �Ѽ��ع��Ľű�
		 * @private
		 * @property
		 */
		_loadedScript: [],

		/**
		 * ���������ִ�к���
		 * @param { Function } callback �ص�����.
		 */
		ready: function(callback) {

			var host = this;

			callback && host[CALLBACK_QUEUE].push(callback);

			host._excuteCallback();

		},

		/**
		 * ִ�к�������
		 * @private
		 */
		_excuteCallback: function() {

			var host = this,
				arr;

			if (0 === host[REQUIRE_COUNT]) {

				arr = host[CALLBACK_QUEUE];
				host[CALLBACK_QUEUE] = [];

				K.each(arr, function(cb) {

					cb.call(host);

				});

			}

		},

        /**
         * �����ʽ
		 * copy from tstart
         */
        addStyleSheet: function(val) {

            var hd = D.get('head'), link;

            // TODO: ���� combo, ���� plugins ���ֻ����һ�� link
            if (/\.css/.test(val)) { // url
                link = doc.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                hd.appendChild(link);
                link.href = val;
            } else { // cssText
                D.addStyleSheet(val);
            }
        },

		/**
		 * ��ȡʱ���
		 */
		getTimeStamp: function() {

			var host = this;

			if ('undefined' === typeof _TS_TIME_STAMP) {

				_TS_TIME_STAMP = {};

				return host.loadScript('http://www.taobao.com/go/rgn/sns/ts-timestamp.php');

			}

			return _TS_TIME_STAMP;

		},

		/**
		 * ���巽��
		 * @param { String } name ����, ������.
		 * @param { Array } deps ������ģ��, ��ѡ.
		 * @param { Function } callback �ṩ�ĺ���, ������.
		 * @return { Object }
		 */
		define: function(name, deps, callback) {

			var host = this,
				args = [],
				i, len;

			if (K.isFunction(deps)) {

				callback = deps;
				deps = [];

			}

			len = deps.length;

			if (len) {

				for (i = 0; i < len; i++) {
					host.loadScript(uri.getCdn(host.root + deps[i] + '.js'));
					args.push(host['_globalObject'][deps[i]]);
				}

			}

			host.ready(function() {

				host['_globalObject'][name] = callback.apply(host, args);
					
			});

		},

		/**
		 * ������ذ�
		 * @param { String } name ģ����.
		 * @param { String } version �汾��.
		 * @param { Function } callback �ص�����.
		 */
		require: function(name, version, callback) {

			var host = this,
				hasVersion = K.isString(version),
				cb = hasVersion ? callback : version,
				fname = name.toLowerCase(),
				path;

			//���ģ���Ѿ�������ֱ��ִ�лص�
			if (T[name]) {
				return cb && cb();
			}

			host.getTimeStamp();

			host.ready(function() {

				path = [PATH, fname, hasVersion ? version : '1.0', (location.href.indexOf('ks-debug') > -1 ? 'main.source' : 'main') + '.js' + '?t=' + _TS_TIME_STAMP[fname]].join('/');

				host.loadScript(uri.getCdn(path));

				host.ready(function() {

					cb && cb.call(host, host['_globalObject'][name + '/' + version]);

				});

			});

			return false;


		}


	});

})(KISSY, TS);