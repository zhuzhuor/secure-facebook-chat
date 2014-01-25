var connection = null;

function log(msg) {
    $('<div></div>').append(document.createTextNode(msg)).prependTo($('#log'));
}

function onConnect(status) {
    if (status === Strophe.Status.CONNECTING) {
        log('Connecting...');
    } else if (status === Strophe.Status.CONNFAIL) {
        log('Failed to connect.');
        $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.DISCONNECTING) {
        log('Disconnecting.');
    } else if (status === Strophe.Status.DISCONNECTED) {
        log('Disconnected.');
        $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.CONNECTED) {
        log('Connected.');

        connection.addHandler(onMessage, null, 'message', null, null,  null);
        connection.send($pres().tree());
    }
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type === "chat" && elems.length > 0) {
        var body = elems[0];

        log('I got a message from ' + from + ': ' +
        Strophe.getText(body));
    }

    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
}

function sendMessage() {
    var message = $('#message').get(0).value;
    var to = '-' + $('#to').get(0).value + "@chat.facebook.com";
    
    if(message && to){
        var reply = $msg({
            to: to,
            type: 'chat'
        })
        .cnode(Strophe.xmlElement('body', message));
        connection.send(reply.tree());

        log('I sent ' + to + ': ' + message);
    }
}

$(document).ready( function () {
    connection = new Strophe.Connection('/http-bind/');

    // Uncomment the following lines to spy on the wire traffic.
    //connection.rawInput = function (data) { log('RECV: ' + data); };
    //connection.rawOutput = function (data) { log('SEND: ' + data); };

    // Uncomment the following line to see all the debug output.
    //Strophe.log = function (level, msg) { log('LOG: ' + msg); };
    
    $('#send').bind('click', function () {
        sendMessage();
    });
});



function login() {
    FB.getLoginStatus(function(response) {
      if (response.authResponse) {
        connection.facebookConnect(
            response.authResponse.userId + "@chat.facebook.com/test", 
            onConnect, 
            60,
            1, 
            FB._apiKey,
            response.authResponse.accessToken);
        FB.api('/me/friends', function(response) {
            var to = $("#to");
            to.empty();
          $.each(response.data, function(i,v){
            to.append($("<option value='" + v.id + "'>" + v.name + "</option>"));
          });
        });
            
      } else {
       connection.disconnect();
      }
    });
}


window.fbAsyncInit = function() {
    FB.init({appId: '1456856884526437', status: true, cookie: true,
        xfbml: true});

    if (window.fbAsyncInited) {
        fbAsyncInited();
    }
};
(function() {
    var e = document.createElement('script');
    e.async = true;
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    document.getElementById('fb-root').appendChild(e);
}());
