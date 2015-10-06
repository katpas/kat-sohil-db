var fs = require('fs');
var index1 = fs.readFileSync(__dirname + '/public/index1.html');
var index2 = fs.readFileSync(__dirname + '/public/index2.html');
var redis = require('redis');
var client = redis.createClient();


function handler(request, response) {
     var url = request.url;

     if (request.method === "GET") {
       client.lrange("favourites", 0, -1, function(err, reply) {
         response.writeHead(200, {"Content-Type": "text/html"});
         response.write(index1);
         response.end(index2);
       });

     }
     else if (request.method === "POST") {
       var body ='';
       request.on('data', function(chunk){
         body += chunk;
         item = "<li>" + body.split('item=').join('').split(',').join('') + "</li>";
         console.log(item);
            client.rpush('favourites', item, function (err,reply) {
              if(err){
                console.log('error from client rpush');
              }
              else{

                client.lrange("favourites", 0, -1, function(err, reply) {
                response.writeHead(200, {"Content-Type": "text/html"});
                console.log(reply);
                response.write(index1);
                console.log(reply.join(''));
                response.write(reply.join(''));
                response.end(index2);
              });

              }
            });
       });

     }
     else {
       fs.readFile(__dirname + request.url, function(err, file) {
         if (err) {
           response.writeHead(404, {"Content-Type": "text/" + ext});
         } else {
           var ext = request.url.split('.')[1];
           response.writeHead(200, {"Content-Type": "text/" + ext});
           response.end(file);
         }
       });
     }
}

module.exports = handler;
