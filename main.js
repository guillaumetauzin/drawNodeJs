/* eslint no-console: "off" */
var http = require("http");
var fs = require("fs");
// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile("./index.html", "utf-8", function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var count = 0;
// Chargement de socket.io
var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
	
    count++;
    socket.broadcast.emit("counter", count);
    socket.emit("counter", count);
    
    socket.on("sendCursors", function (data) {
    console.log(data);
    socket.broadcast.emit("sendPoints", data);
    socket.emit("sendPoints", data);
    });

    socket.on("sendClear", function(data2) {
        if (data2 === "azaz") {
            console.log("Ecran Reset !")
            socket.broadcast.emit("clearScreen");
            socket.emit("clearScreen");
        }
    
    });
    socket.on("disconnect", function() {
    count--;
    socket.broadcast.emit("counter", count);
  	});
    
});

server.listen(8080);
console.log("Serveur lancé sur le port 8080 !");
