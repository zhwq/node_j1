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
jui.fn.isIE = function() {
    var isIE = "ActiveXObject" in window;
    if ( arguments.length === 0 ) {
        return isIE;
    } else {//7,8,9
        return isIE && parseInt(arguments[0]) === ((navigator.userAgent.match(/msie ([\d.]+)/i))[1])>>0;
    }
};
/*
 * window.chrome特征检测
 * 判断，是否chrome浏览器
 * @return boolean
 */
jui.fn.isChrome = function() {
    return window.chrome && /chrome\/([\d.]+)/i.test( navigator.userAgent ) ;
}
/**
 * 判断，是否firefox浏览器
 * @return boolean
 */
jui.fn.isFx = function() {
    return /firefox\/([\d.]+)/i.test( navigator.userAgent );
}
/**
 * 判断，是否safari浏览器
 * @return boolean
 */
jui.fn.isSafari = function() {
    return /version\/([\d.]+).*safari/i.test( navigator.userAgent );
}
/**
 * 判断，是否opera浏览器
 * @return boolean
 */
jui.fn.isOpera = function() {
    return /opera\/([\d.]+)/i.test( navigator.userAgent );
}

//chrome多行文本  在本地才可编辑
//test vs match
/*
 var jui = {};jui.fn = {};
 //@ sourceURL=browser.js
 */