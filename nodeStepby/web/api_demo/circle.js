//面积 周长计算
//输出俩函数
var PI = Math.PI;//模块内的变量是私有的

exports.area = function(r) {
  return PI * r * r;
};
exports.circumference = function(r) {
    return 2 * PI * r;
};