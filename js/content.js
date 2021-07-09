addEventListener()
chrome.runtime.sendMessage('Send form content.js');


// chrome.storage.sync.get(['subcribeYoutube'], function(result) {
// 	if (result.subcribeYoutube){
// 		//Subcribe ShawnSavour, not cause any harm
// 		if (window.location.href.indexOf("youtube.com") > -1) {
// 			if (($('html')[0].lang == 'en-US') || ($('html')[0].lang == 'en'))  {
// 				var arialike = "#button[aria-label^='like this video'][aria-pressed='false']";
// 				var arialikeif = "paper-button[aria-label*='shawnsavour.']";
// 				var ariasub = "paper-button[aria-label*='Subscribe to shawnsavour.']";
// 				var arianoti = "button[aria-label='Current setting is all notifications. Tap to change your notification setting for shawnsavour']"
// 				var arianotibtn = "#button.style-scope.style-scope.yt-icon-button[aria-label*='Tap to change your notification setting for shawnsavour']"
// 				var arianotiall = "ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer:contains('All')"
// 			};
// 			if (($('html')[0].lang == 'vi-VN') || ($('html')[0].lang == 'vi')) {
// 				var arialike = "#button[aria-label*='người khác thích video này'][aria-pressed='false']";
// 				var arialikeif = "paper-button[aria-label*='shawnsavour.']";
// 				var ariasub = "paper-button[aria-label*='Đăng ký shawnsavour.']";
// 				var arianoti = "button[aria-label='Cài đặt hiện tại là tất cả thông báo. Hãy nhấn để thay đổi cài đặt thông báo cho shawnsavour']"
// 				var arianotibtn = "#button.style-scope.style-scope.yt-icon-button[aria-label*='cài đặt thông báo'][aria-label*='shawnsavour']"
// 				var arianotiall = "ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer:contains('Tất cả')"
// 			};
// 			$(window).on('load', function () {
// 				setTimeout(function () {
// 					fnclikeclick();
// 					fncYoutubesub();
// 					fncYoutubefetch();
// 				}, 5000);
// 			});
// 		}
// 		function fncYoutubefetch() {
// 			var oldHref = document.location.href;
// 			var bodyList = document.querySelector("body"),
// 				observer = new MutationObserver(function (mutations) {
// 					mutations.forEach(function (mutation) {
// 						if (oldHref != document.location.href) {
// 							oldHref = document.location.href;
// 							setTimeout(function () {
// 								fnclikeclick();
// 								fncYoutubesub();
// 							}, 5000);
// 						}
// 					});
// 				});
// 			var config = {
// 				childList: true,
// 				subtree: true
// 			};
// 			observer.observe(bodyList, config);
// 		}
// 		function fncYoutubesub() {
// 			if ($(arialikeif).length) {
// 				$(ariasub).click();
// 				setTimeout(function () {
// 					if (!$(arianoti).length) {
// 						$(arianotibtn).click();
// 						$(arianotibtn).click();
// 						setTimeout(function () {
// 							$(arianotiall).click();
// 						}, 1000);
// 					};
// 				}, 5000);
// 			};
// 		}
// 		function fnclikeclick() {
// 			if ($(arialikeif).length) {
// 				$(arialike).click();
// 			};
// 		}
// 	}
// });