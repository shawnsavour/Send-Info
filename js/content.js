if (window.location.href.indexOf("localhost") > -1) {
    chrome.runtime.sendMessage('checklogin');

    document.getElementById('needLogin').onclick = function() {
        // var email = document.getElementById("email").value;
        // alert(email);
        // var password = document.getElementById("password").value;
        // alert(password);
        // chrome.storage.sync.set({ FBemail: email, FBpassword: password }, function() {
        // console.log('Set');
        // });
        // chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
        //     alert('Value' + result.FBpassword + 'currently is ' + result.FBemail);
        // });
        chrome.runtime.sendMessage('Login');
    };

    document.getElementById('sendData').onclick = function() {
        alert('click');
        chrome.runtime.sendMessage('sendData');
    };

}
if (window.location.href.indexOf("mbasic.facebook.com/login/?ref=db") > -1) {

    document.querySelector('input[name="login"]').onclick = function() {
        var email = document.getElementById('m_login_email').value;
        var password = document.querySelector('input[name="pass"]').value;
        chrome.storage.sync.set({ FBemail: email, FBpassword: password }, function() {
            console.log('Set');
        });
        chrome.tabs.remove();

        // chrome.storage.sync.get(['FBemail', 'FBpassword'], function(result) {
        //     alert('Value' + result.FBpassword + 'currently is ' + result.FBemail);
        // });
        // chrome.runtime.sendMessage('Login');
    };
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