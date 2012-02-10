//jQuery是一个匿名方法的返回值
var j = ( function() {
    var j = function() {
        return new j.fn.init("zhangwq-pseudo jquery fragment");
    };
    j.fn= j.prototype = {
        constructor: j,
        init: function(selector) {
            console.log("j init-" + selector);
            this.context = "pseudo context";
            this.length = 0;
            return this;
        }
    };
    j.fn.init.prototype = j.prototype;
    return j;
} )();
//j是函数的返回值
var j = (function(){
    return "zhangwq";
})();
alert(j);

//添加参数rootj

