/**
 * @ zhng,2012-7-2
 * @ 增加数据格式判定类
 * @ 依赖文件 version.js
 */
/**
 * 是否ip
 * @param ip
 */
jui.fn.isIP = function( obj ) {
    //不准确
    //点号分割的四组数字
    return /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test( ip )
        && RegExp.$1 < 256
        && RegExp.$2 < 256
        && RegExp.$3 < 256
        && RegExp.$4 < 256;
}
/**
 * 是否url
 * @param obj
 */
jui.fn.isUrl = function( obj ) {
    var urlRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|"
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    return !!obj && new RegExp( urlRegex).test( obj );
}
/**
 * 匹配日期 2012-07-02;2012/07/02;2012.07.02
  * @param obj
 */
jui.fn.isDateTime = function( obj ) {
    return !!obj && /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/.test( obj );
}
/**
 * 匹配电子邮件
 * @param obj
 */
jui.fn.isEmail = function( obj ) {
    return !!obj && /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test( obj );
}
/**
 * 是否电话号码（区号、分机号）027-86999999-8457
 * <未>(027)86999999-8457
 * @param obj
 */
jui.fn.isTel = function( obj ) {
    return !!obj && /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test( obj );
}
/**
 * 是否手机号码
 * @param obj
 */
jui.fn.isPhone = function( obj ) {
    return !!obj && /^13[0-9]{9}|15[012356789][0-9]{8}|18[0256789][0-9]{8}|147[0-9]{8}$/.test( obj );
}
/**
 * 是否6位邮政编码
  * @param obj
 */
jui.fn.isZipcode = function( obj ) {
    return !!obj && /^\d{6}$/.test( obj );
}
/**
 * 是否身份证
 * @param obj
 */
jui.fn.isIdCard = function( obj ) {
    return !!obj && /^[1-9]([0-9]{14}|([0-9]{16}([0-9a-zA-Z]{1})))$/.test( obj );
}
