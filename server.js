"use strict";

var fs = require("fs");

function handler (req, res) {

    var url = req.url;

    if (url == "/js") {
        return fs.readFile(__dirname + '/socket.io.min.js', function (err, data) {
            if (err) {
              res.writeHead(500);
              return res.end('Error loading socket.io.min.js');
            }
            res.writeHead(200);
            res.end(data);
        });
    }

    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}


var server = require('http').createServer(handler);
var io = require('socket.io').listen(server, {log: false})

var count = 0;
var latency = [];

io.sockets.on('connection', function (socket) {
    console.log("Client connected.");
    console.time('time');

    var ms;

    socket.on('pong', function (data) {
        count++;
        var now = new Date().getTime();
        latency.push(now - ms);
        ms = now;
        socket.emit('ping', { msg: 'ping' });
    });

    var ms = new Date().getTime();
    socket.emit('ping', { msg: 'ping' });
});

process.on('SIGINT', function() {
    console.log("\n");
    console.timeEnd('time');
    console.log("Count: " + count);

    var averageLatency;
    var totalLatency = 0;
    latency.forEach(function(l) {
        totalLatency+=l;
    });    

    averageLatency = totalLatency/latency.length;
    console.log("Average latency: " + averageLatency);

    process.exit();
});

server.listen(3006);
console.log("Server listening.");
