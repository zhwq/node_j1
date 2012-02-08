var http = require("http");
var url = require("url");//解析请求url时用
//传入路由模块
var exportFn = function(route, handle){
	http.createServer(function(request,response){
		//console.dir(request);
		console.log("handle a request");
		var pathname = url.parse(request.url).pathname;
		var content = route(handle, pathname);//匹配不同的请求进行处理
		response.writeHead(200,{"Content-Type":"text/plain"});//响应头
		//response.write("Hello,exports");//响应内容
		response.write(content);
		response.end();//响应结束
		//console.log("URL:"+pathname);
		console.log("reponse end ok");
	}).listen(4080);
	console.log("server started");
};
//导出 生成模块 供其他文件使用(使服务器模块成为Node.js的一个模块)
//把代码片段变成模块：将其提供功能的部分导出到请求该模块的脚本当中
exports.exprotFn = exportFn;