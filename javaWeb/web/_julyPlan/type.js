/**
 * @ zhng,2012-7-2
 * 数据类型判定
 */
/**
 *
 * @param obj
 */
jui.fn.isFn = function( obj ) {
//    typeof fnName;
//    //fnName instanceof
//    fnName.constructor = Function;
    return !obj?Object.prototype.toString.call( obj ) === "[object Function]":"object";
}
/**
 * 是否未定义<注意undefined变量可重新赋值>
  * @param obj
 */
jui.fn.isUndefined = function( obj ) {
    return obj === undefined && !obj;
}
/**
 * 是否为null
  * @param obj
 */
jui.fn.isNull = function( obj ) {
    return obj === null && !obj;
}