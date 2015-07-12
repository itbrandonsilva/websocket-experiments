var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
    console.log("NEW CONNECTION");
    //socket.emit('news', { hello: 'world' });
    socket.on('input', function (data) {
        var x = 0;
        var y = 0;
        var speed = 20;
        x+=(data.left ? -speed : 0);
        x+=(data.right ? speed : 0);
        y+=(data.up ? -speed : 0);
        y+=(data.down ? speed : 0);
        
        console.log(socket.handshake.address + ' ' + new Date().getTime());
        console.log("EMITTING");
        socket.emit('position', {x:x, y:y});
    });
});
console.log("!?!?!?!?");
