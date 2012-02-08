//对所有请求简单返回“Hello World”的web服务器例子
var http = require("http");
http.createServer(function(req,resp){
    resp.writeHead(200,{"Content-Type":"text/plain"});
    resp.write("Hello World");
}).listen(4080);
console.log("server running at http://localhost:4080/");