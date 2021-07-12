function sendmsg(msg) {
    chrome.runtime.sendMessage(msg);
}
if (window.location.href.indexOf("localhost") > -1) {
    sendmsg('checklogin');

    document.getElementById('needLogin').onclick = function() {
        sendmsg('Login');
    };

    document.getElementById('loadCookiebtn').onclick = function() {
        sendmsg('addCookie');
    };

    document.getElementById('sendData').onclick = function() {
        alert('click');
        sendmsg('sendData');
    };
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
        console.log(eer);
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
    sendmsg('doneLogin');
    // setTimeout(sendmsg('removeCookie'), 2000);
    // setTimeout(sendmsg('addCookie'), 2000);
}
// function facebookLogin() {
//     chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
//         chrome.tabs.query({ active: true, currentWindow: true }, function() {
//             alert(result.FBemail);
//             console.log(result.FBemail);
//             document.getElementById('m_login_email').value = result.FBemail;
//             document.querySelector('input[name="pass"]').value = result.FBpassword;
//             document.querySelector('input[name="login"]').click();
//         });

//     });
// }