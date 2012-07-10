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
