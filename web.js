var http = require('http');
var url = require('url');
var fs = require('fs');


if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (str){
        return this.indexOf(str) === 0;
    };
}


http.createServer(function (req, res) {
    var url_parts = url.parse(req.url);
    console.log(req.url);
    // console.log(url_parts);

    if (req.url === '/') {
        fs.readFile('./static/chat.html', function(err, data) {
            res.end(data);
        });
    } else if (req.url === '/favicon.ico') {
        res.writeHead(404);
        res.end();
    } else if (req.url.startsWith('/static/')) {
        var path = '.' + req.url;
        fs.exists(path, function(exists) {
            if (exists) {
                res.writeHead(200);
                fs.readFile(path, function (err, data) {
                    res.end(data);
                });
            } else {
                console.log("not exists: " + filename);
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.write('404 Not Found\n');
                res.end();
                return;
            }
        });
    } else {
        if (url_parts.pathname === '/http-bind/') {
            req.on('data', function(chunk) {
                var options = {
                    host: 'secure-chat-bosh.herokuapp.com',
                    port: 80,
                    path: '/http-bind/',
                    method: 'POST'
                },
                fb_req = http.request(options, function(fb_res) {
                    fb_res.on('data', function(fb_data) {
                        // console.log('xmpp response: ' + fb_data.toString());
                        res.end(fb_data.toString());
                    });
                });

                // console.log('xmpp request: ' + chunk.toString());
                fb_req.end(chunk.toString());
            });
        }
    }

}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1.xip.io:1337/');
