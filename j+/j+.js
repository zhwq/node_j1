/*!
 * j+,(c) zhng(zhangwen77@qq.com)
 */

/*
//����
//<div id="container"><a href="http://www.baidu.com" alt="dubai">dubai</a></div>
var divElement = document.createElement( "div" );
var aElement = document.createElement( "a" );
var txtNode = document.createTextNode( "dubai" );

divElement.id = "container";//divElement.setAttribute( "id", "container" );
aElement.href = "http://www.baidu.com";
aElement.setAttribute( "alt", "dubai");

aElement.appendChild( txtNode );
divElement.appendChild( aElement );
document.body.appendChild( divElement );
*/
var j = {};
//utils
/**
 * ��̬�ű�ע��
 * @param url �ű���ַ
 * @param callback �ű�������ɾ�����ִ�еĻص�����
 */
function loadScript( url, callback ) {
	var script = document.createElement( "script" );
	script.type = "text/javascript";//HTML5�в���Ҫ����

	if ( script.readyState ) {//IE
		script.onreadystatechange = function() {
			if ( script.readyState == "loaded" || script.readyState == "complete" ) {
				script.onreadystatechange = null;
				callback();
			}
		}
	} else {//���������
		script.onload = function() {
			callback();
		}
	}

	script.src = url;
	document.getElementByTagName( "head" )[0].appendChild( script );
}
//����������ģʽ
//���Ƕ��
//yui2 connection manager
function xhr() {
	//msdn ActiveXObject
	var msxml_proid = [
		"MSXML2.XMLHTTP.6.0",
		"MSXML3.XMLHTTP",
		"Microsoft.XMLHTTP",//��֧��readyState 3
		"MSXML2.XMLHTTP.3.0"//��֧��readyState 3
	];
	var xhr = null;
	try {
		xhr = new XMLHttpRequest;
	} catch ( e ) {
		for ( var i=0, len=msxml_proid.length; i<len; i++ ) {
			try {
				xhr = new ActiveXObject( msxml_proid[ i ] );
				break;//�˳�ѭ��
			} catch ( e2 ) {
				//ignore
			}
		}
	} finally {
		return xhr;
	}
}

