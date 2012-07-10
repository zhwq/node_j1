/**
 * @ zhng,2012-6-29
 * @ pc端浏览器版本判断，未使用特征检测的结果在userAgent重写后不正确
 * @ 依赖文件 version.js
 */
/**
 * 判断，是否IE浏览器及特定版本
 * @param arguments[0] 为空 为判断是否IE浏览器;传入数字7或者8或者9,或者传入数字字符"7"或者"8"或者"9"表示判断是否是IE7或者IE8或者IE9
 * @return boolean
 */
ui.fn.isIE = function() {
    var isIE = "ActiveXObject" in window;
    if ( arguments.length === 0 ) {
        return isIE;
    } else {//7,8,9
        return isIE && parseInt(arguments[0]) === ((navigator.userAgent.match(/msie ([\d.]+)/i))[1])>>0;
    }
};
ui.isIE = ui.fn.isIE;
/*
 * window.chrome特征检测
 * 判断，是否chrome浏览器
 * @return boolean
 */
ui.fn.isChrome = function() {
    return window.chrome && /chrome\/([\d.]+)/i.test( navigator.userAgent ) ;
};
ui.isChrome = ui.fn.isChrome;
/**
 * 判断，是否firefox浏览器
 * @return boolean
 */
ui.fn.isFx = function() {
    return /firefox\/([\d.]+)/i.test( navigator.userAgent );
};
ui.isFx = ui.fn.isFx;
/**
 * 判断，是否safari浏览器
 * @return boolean
 */
ui.fn.isSafari = function() {
    return /version\/([\d.]+).*safari/i.test( navigator.userAgent );
};
ui.isSafari = ui.fn.isSafari;
/**
 * 判断，是否opera浏览器
 * @return boolean
 */
ui.fn.isOpera = function() {
    return /opera\/([\d.]+)/i.test( navigator.userAgent );
};
ui.isOpera = ui.fn.isOpera;
/**
 * @ zhng,2012-7-3
 * 数据类型判定
 */
/**
 * 是否是函数
 * @param obj
 */
ui.fn.isFn = function( obj ) {
//    typeof fnName;
//    //fnName instanceof
//    fnName.constructor = Function;
    return !!obj && Object.prototype.toString.call( obj ) === "[object Function]";
};
ui.isFn = ui.fn.isFn;
/**
 * 是否未定义<注意undefined变量可重新赋值>
  * @param obj
 */
ui.fn.isUndefined = function( obj ) {
    return obj === undefined && !obj;
}
ui.isUndefined = ui.fn.isUndefined;
/**
 * 是否为null
  * @param obj
 */
ui.fn.isNull = function( obj ) {
    return obj === null && !obj;
};
ui.isNull = ui.fn.isNull;
/**
 * 是否为空字符串
  * @param obj
 */
ui.fn.isNotEmpty = function( obj ) {
    return /^\S+$/.test( obj );
}
ui.isNotEmpty = ui.fn.isNotEmpty;
/**
 * 是否数字(数字字符串验证不通过包括0)
 * @param obj
 */
ui.fn.isNum = function( obj ) {
    //前置与操作过滤掉了正则验证中对象为空字符串的情况
    ///^([+-]?)\d*\.?\d*$/ 通过.4
    /*/^\S+$/.test( obj ) &&*/
    return /^([+-]?)\d*\.?\d+$/.test( obj );
};
ui.isNum = ui.fn.isNum;
/**
 * 是否整数(包括0)
  * @param obj
 */
ui.fn.isInteger = function( obj ) {
    return /^([+-]?)([1-9]?)\d+$/.test( obj );
};
ui.isInteger = ui.fn.isInteger;
/**
 * 是否浮点数(包括0)
  * @param obj
 */
ui.fn.isDecimal = function( obj ) {
    //return /^(([+-]?)(([1-9]?)\d*.\d*|0.\d*[1-9]\d*))|0?.0+|0$/.test( obj );
    return /^([+-]?)(([1-9]?\d*\.\d*)|0)$/.test( obj );
};
ui.isDecimal = ui.fn.isDecimal;
/**
 * @ zhng,2012-7-2
 * @ 增加数据格式判定类
 * @ 依赖文件 version.js
 */
/**
 * 是否ip
 * @param ip
 */
ui.fn.isIp = function( obj ) {
    //不准确
    //点号分割的四组数字
    /*return /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test( ip )
        && RegExp.$1 < 256
        && RegExp.$2 < 256
        && RegExp.$3 < 256
        && RegExp.$4 < 256;*/
    return /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/.test( obj );
};
ui.isIp = ui.fn.isIp;
/**
 * 是否url
 * @param obj
 */
ui.fn.isUrl = function( obj ) {
    var urlRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|"
        + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    return !!obj && !/^true|false$/.test(obj) && new RegExp( urlRegex).test( obj );
}
ui.isUrl = ui.fn.isUrl;
/**
 * 使用捕获组、反向应用来判定年月和月日之间的间隔符一致
 * 匹配日期 2012-07-02;2012/07/02;2012.07.02
  * @param obj
 */
ui.fn.isDateTime = function( obj ) {
    return /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/.test( obj );
}
ui.isDateTime = ui.fn.isDateTime;
/**
 * 匹配电子邮件
 * @param obj
 */
ui.fn.isEmail = function( obj ) {
    return !!obj && /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test( obj );
}
ui.isEmail = ui.fn.isEmail;
/**
 * 是否电话号码（区号、分机号）027-86999999-8457;+23-012-81923663-564
 * <未>(027)86999999-8457
 * @param obj
 */
ui.fn.isTel = function( obj ) {
    return !!obj && /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test( obj );
}
ui.isTel = ui.fn.isTel;
/**
 * 是否手机号码
 * 通过格式: +8613136366666;(86)13163366666;13163366666
 * @param obj
 */
ui.fn.isPhone = function( obj ) {
    return !!obj && /^((\+86)|(\(86\)))?((13[0-9]{9})|(15[012356789][0-9]{8})|(18[0256789][0-9]{8})|(147[0-9]{8}))$/.test( obj );
}
ui.isPhone  = ui.fn.isPhone;
/**
 * 是否6位邮政编码
  * @param obj
 */
ui.fn.isZipcode = function( obj ) {
    return !!obj && /^\d{6}$/.test( obj );
}
ui.isZipcode = ui.fn.isZipcode;
/**
 * 是否身份证号码
 * 简单验证15位身份证
 * 使用数据格式和校验码验证18位二代公民身份证
 * @param obj
 */
ui.fn.isIdCard = function( obj ) {
    /**
     *wiki:http://zh.wikipedia.org/wiki/中华人民共和国公民身份号码
     *1,将身份证号码从右至左标记为a1,a2,...,a18;即a1为校验码
     *2,计算权重系数: wi= 2^(i-1) mod 11;
     *3,计算s = ai * wi的累加和(其中i属于[2,18]);
     *4,a1 = (12-(s mod 11))mod11;<16进制>
     * ------------------------
     * 接收18位身份证号的左起17位
     * @param obj 接收18为身份证号的左起17位
     * @return ret 检验码 身份证最后一位数(16进制)
     */
    function checksum( obj ) {
        function s( reverseArr ) {
            function w( i ) {
                return Math.pow( 2, i-1 ) % 11;
            }
            var ret = 0,j;
            for ( j = 0; j < 17; j++ ) {
                ret += reverseArr[ j ] * w( j + 2 );
            }
            return ret;
        }
        var checksum = ( 12 - ( s( obj.split("").reverse() ) % 11 ) ) % 11;
        return (checksum === 10)?"X":checksum+"";
    }
    var ret = !!obj && /^[1-9]([0-9]{14}|([0-9]{16}([0-9X]{1})))$/.test( obj );
    if ( ret && obj.length === 18 ) {
        return ( checksum(obj.substring(0,17)) === obj.substr(17,1) );
    } else {
        return ret;
    }
}
ui.isIdCard = ui.fn.isIdCard;
