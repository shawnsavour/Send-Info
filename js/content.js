if (window.location.href.indexOf("localhost") > -1) {
    chrome.runtime.sendMessage('checklogin');
    document.getElementById('needLogin').onclick = function() {
        chrome.tabs.create({ url: 'https://www.facebook.com/' });
    };
    document.getElementById('sendData').onclick = function() {
        chrome.runtime.sendMessage('sendData');
    };

    chrome.runtime.onMessage.addListener(gotMessage);

    function gotMessage(message, sender, sendResponse) {
        switch (message) {
            case 'hidelogin':
                document.getElementById('needLogin').classList.add("d-none");
                break;
            case 'hidesendData':
                document.getElementById('sendData').classList.add("d-none");
                break;
            default:
                console.log('msg not have case!');
        }
    }
}