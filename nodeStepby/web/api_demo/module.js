//使用commonJS加载模块
//使用circle.js中的函数
var circle = require("./circle.js");
console.log("The area of a circle of radius 4 is " + circle.area(4));
//console.log("the variable in a module file is private PI:"+PI);   //编译不过