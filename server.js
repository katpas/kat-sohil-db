var http = require("http");
var port = process.env.PORT || 8000;
var handler = require('./handler.js');

http.createServer(handler).listen(port);
