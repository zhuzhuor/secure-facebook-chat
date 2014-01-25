var connection = null;

function log(msg) {
    append_system_msg(msg);
}

function append_my_msg(msg) {
    var str = '<li class="right clearfix"> \
        <span class="chat-img pull-right"> \
            <img src="http://placehold.it/50/FA6F57/fff&amp;text=ME" class="img-circle"> \
        </span> \
        <div class="chat-body clearfix"> \
            <div class="header"> \
                <strong class="pull-right primary-font">Me</strong> \
                <small class=" text-muted"> \
                    <span class="glyphicon glyphicon-time"></span>a moment ago \
                </small> \
            </div> \
            <p>' + msg + '</p> \
        </div> \
    </li>';

    $('#chat-list').append(str);
    scroll_down();
}

function append_other_msg(msg) {
    var str = '<li class="left clearfix"> \
        <span class="chat-img pull-left"> \
            <img src="http://placehold.it/50/55C1E7/fff&amp;text=OTHER" class="img-circle"> \
        </span> \
        <div class="chat-body clearfix"> \
            <div class="header"> \
                <strong class="primary-font">Other</strong> \
                <small class="pull-right text-muted"> \
                    <span class="glyphicon glyphicon-time"></span>a moment ago \
                </small> \
            </div> \
            <p>' + msg  + '</p> \
        </div> \
    </li>';

    $('#chat-list').append(str);
    scroll_down();
}

function append_system_msg(msg) {
    var str = '<li class="right clearfix"> \
        <span class="chat-img pull-right"> \
            <img src="http://placehold.it/50/4B0082/fff&amp;text=SYS" class="img-circle"> \
        </span> \
        <div class="chat-body clearfix"> \
            <div class="header"> \
                <strong class="pull-right primary-font">System Info</strong> \
                <small class=" text-muted"> \
                    <span class="glyphicon glyphicon-time"></span>a moment ago \
                </small> \
            </div> \
            <p>' + msg + '</p> \
        </div> \
    </li>';

    $('#chat-list').append(str);
}

function scroll_down() {
    var foo = document.getElementById('chat-panel-body');
    foo.scrollTop = foo.scrollHeight;
    var chatbody = document.getElementById('chat-panel-body');
    chatbody.setAttribute("style", "opacity:1");
}

function append_friend_list(id, name) {
    var str = '<div class="row user-row" id="user-' + id + '"> \
        <div class="col-md-2"> \
            <img class="img-circle" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=30"> \
        </div> \
        <div class="col-md-10"> \
            <strong>' + name + '</strong><br> \
            <span class="text-muted">' + id + '</span> \
        </div> \
    </div>';

    $('#userlist').append(str);
}

var chat_with = chat_with || '100007680813408';
var otr_buddy = otr_buddy || null;
var otr_private_key = otr_private_key || null;
    
function start_chat(id) {
    chat_with = id;
    $('#chat-list').empty();
    append_system_msg("Start to chatting with " + id);

    var options = {
        fragment_size: 140,
        send_interval: 200,
        debug: true,
        priv: otr_private_key
    };

    otr_buddy = new OTR(options);

    otr_buddy.on('ui', function(msg, encrypted) {
        console.log("receive msg from buddy: " + msg + ', ' + encrypted);
        append_other_msg(msg);
    });
    otr_buddy.on('io', function(msg) {
        console.log("send msg to buddy: " + msg);
        sendMessage(msg);
    });
    otr_buddy.on('error', function (err) {
        console.error("error occurred: " + err)
    });
    otr_buddy.on('status', function (state) {
        console.log(status);
    });
            
    // otr_buddy.REQUIRE_ENCRYPTION = false;
    otr_buddy.sendQueryMsg();
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

    console.log('msg type: ' + type);

    if (type === "chat" && elems.length > 0) {
        var body = elems[0];

        otr_buddy.receiveMsg(atob(Strophe.getText(body)));
    }

    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
}

function sendMessage(message) {
    var to = '-' + chat_with + '@chat.facebook.com';
    
    if(message && to){
        var reply = $msg({
            to: to,
            type: 'chat'
        })
        .cnode(Strophe.xmlElement('body', btoa(message)));
        connection.send(reply.tree());
    }
}

$(document).ready( function () {
    connection = new Strophe.Connection('/http-bind/');

    // Uncomment the following lines to spy on the wire traffic.
    //connection.rawInput = function (data) { log('RECV: ' + data); };
    //connection.rawOutput = function (data) { log('SEND: ' + data); };

    // Uncomment the following line to see all the debug output.
    //Strophe.log = function (level, msg) { log('LOG: ' + msg); };
    
    $('#btn-chat').bind('click', function () {
        var message = $('#btn-input').val();
        if (message && message !== '') {
            otr_buddy.sendMsg(message);
            append_my_msg(message);
        }
        $('#btn-input').val('');  // clear the input text
    });

    otr_private_key = new DSA();

    var chatbody = document.getElementById('chat-panel-body');
        chatbody.addEventListener("mouseover",func1,false);
        chatbody.addEventListener("mouseout",func2,false);
        
    var opa = 0.5;
    var dim;
    var isTimerOn = 0;
    
    function func1(){
        opa = 1;
        chatbody.setAttribute("style", "opacity:1");
        clearTimeout(dim);

    }
    function func2(){
            opa = opa - 0.1;
            if(opa < 0.1) opa = 0.1;

            var opacity_mod = "opacity:" + String(opa);

            chatbody.setAttribute("style",opacity_mod);

            dim = setTimeout( function () {func2();}, 500);
              
              isTimerOn = 1;

    }

    $("#btn-input").keyup(function(event){
        if(event.keyCode == 13){
            $("#btn-chat").click();
        }
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
                    // console.log(i);
                    // console.log(v);
                    append_friend_list(v.id, v.name);

                    $('#user-' + v.id).hover(
                        function(){
                            $(this).css("background", "#FFEBCD");
                        },
                        function(){
                            $(this).css("background", "#FFF");
                        }
                    );

                    $('#user-' + v.id).click(function() {
                        start_chat(this.id.substring(5));
                    });
                
              });
        });


            
      } else {
        connection.disconnect();
      }
    });
}




// 
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
    e.src = 'https://connect.facebook.net/en_US/all.js';
    document.getElementById('fb-root').appendChild(e);
}());
