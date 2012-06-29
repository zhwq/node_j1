/**
 * @ zhng,2012-6-29
 * @ 正则表达式
 * @ 依赖文件 version.js
 */
/**
 * 返回执行的结果
 * @param reg
 * @param instance
 */
function exec( reg, instance ) {
    //console.trace();
    if ( arguments.length != 2 ) return;
    if ( !( reg instanceof RegExp) ) return;
    if ( !instance ) return;

    /*console.log( "begin to exec the reg...." );
     */
    return reg.test( instance );
}
//日志输出函数
function log( msg ) {
    var time = (new Date).getTime();
    console.time( time );
    console.profile( msg );
    console.log( msg );
    console.profileEnd();
    console.timeEnd( time );
}
//正则
var reg = {};
/*1.中国电话号码验证
 *匹配形式如:0511-4405222 或者021-87888822 或者 021-44055520-555 或者 (0511)4405222
 */
reg.chinaTel = /((d{3,4})|d{3,4}-)?d{7,8}(-d{3})/;
/*2.电子邮件
 */
reg.email = /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/;
/*3.url
 */
reg.url = /[a-zA-z]+:\/\/[^\s]*/;
console.group("reg#group");
log( "tel: " + exec(reg.chinaTel,"027-12345678"));
log( "email: " + exec( reg.email, "zhngjob@163.com" ) );
log( "url: " + exec( reg.url, "http://www.github.com" ) );
console.groupEnd();