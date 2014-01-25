var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    var url_parts = url.parse(req.url);
    console.log(req.url);
    console.log(url_parts);

    if (req.url === '/facebook.html') {
        fs.readFile('./facebook.html', function (err,data) {
            res.end(data);
        });
    } else if (req.url === '/facebook.js') {
        fs.readFile('./facebook.js', function (err,data) {
            res.end(data);
        });
    } else if (req.url === '/strophe.js') {
        fs.readFile('./strophe.js', function (err,data) {
            res.end(data);
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
                        console.log('xmpp response: ' + fb_data.toString());
                        res.end(fb_data.toString());
                    });
                });

                console.log('xmpp request: ' + chunk.toString());
                fb_req.end(chunk.toString());
            });
        }
    }

}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1.xip.io:1337/');
