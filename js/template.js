"use strict";
! function (n) {
    Vue.component("sidebar-content", {
        data: function () {
            return {
                menus: [{
                    name: "My Account",
                    url: "About-me.html",
                    icon: "nc-circle-09",
                    dropdown: !1
                }, {
                    name: "Options",
                    url: "options.html",
                    icon: "nc-settings-gear-64",
                    dropdown: !1
                }, {
                    name: "Support",
                    url: "#menuSupport",
                    icon: "nc-support-17",
                    dropdown: [{
                        name: "Messenger",
                        shortName: "M",
                        url: "https://www.messenger.com/t/ShawnSavour",
                        target: "_blank"
                    }, {
                        name: "FAQ",
                        shortName: "F",
                        url: "https://shawnsavour.com/blog",
                        target: "_blank"
                    }]
                }, {
                    name: "Follow me",
                    url: "#menuFollow",
                    icon: "nc-bell-55",
                    dropdown: [{
                        name: "Github",
                        shortName: "G",
                        url: "https://www.github.com/shawnsavour",
                        target: "_blank"
                    }, {
                        name: "Facebook",
                        shortName: "F",
                        url: "https://www.facebook.com/congson99tn/",
                        target: "_blank"
                    }, {
                        name: "Twitter",
                        shortName: "T",
                        url: "https://twitter.com/SonCreed",
                        target: "_blank"
                    }, {
                        name: "Instagram",
                        shortName: "I",
                        url: "https://www.instagram.com/shawnsavour/",
                        target: "_blank"
                    }, {
                        name: "Youtube",
                        shortName: "Y",
                        url: "https://www.youtube.com/soncreedvideo?sub_confirmation=1",
                        target: "_blank"
                    }]
                }, {
                    name: "ShawnSavour Page",
                    url: "https://www.facebook.com/shawnsavour/",
                    icon: "nc-favourite-28",
                    dropdown: !1,
                    target: "_blank"
                }, {
                    name: "Donate",
                    url: "https://www.shawnsavour.com/buy-me-coffee",
                    icon: "nc-money-coins",
                    dropdown: !1,
                    target: "_blank"
                }]
            }
        },
        methods: {
            setTarget: function (n) {
                return "_blank" === n ? "_blank" : "_self"
            },
            isActive: function (n) {
                return new URL(window.top.location.href).pathname.substr(1) === n
            }
        },
        template: '\n      <!--\n      Tip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n      Tip 2: you can also add an image using data-image tag\n      -->\n      <div class="sidebar-wrapper">\n        <div class="logo">\n          <a href="options.html" class="simple-text logo-mini">\n            JS\n          </a>\n          <a href="options.html" class="simple-text logo-normal">\n            ShawnSavour Security\n          </a>\n        </div>\n        <ul class="nav">\n          <li class="nav-item" v-for="menu in menus">\n            <a class="nav-link" :href="menu.url" :target="setTarget(menu.target)" v-if="!menu.dropdown">\n              <i :class="`nc-icon ${menu.icon}`"></i>\n              <p>{{menu.name}}</p>\n            </a>\n\n            <a class="nav-link" data-toggle="collapse" :href="menu.url" v-if="menu.dropdown">\n              <i :class="`nc-icon ${menu.icon}`"></i>\n              <p>\n                {{menu.name}}\n                <b class="caret"></b>\n              </p>\n            </a>\n\n            <div class="collapse" :id="menu.url.substr(1)" v-if="menu.dropdown">\n              <ul class="nav">\n                <li class="nav-item" v-for="item in menu.dropdown">\n                  <a class="nav-link" :href="item.url" :target="setTarget(item.target)">\n                    <span class="sidebar-mini">{{item.shortName}}</span>\n                    <span class="sidebar-normal">{{item.name}}</span>\n                  </a>\n                </li>\n              </ul>\n            </div>\n          </li>\n        </ul>\n      </div>\n    '
    }), Vue.component("navbar-content", {
        data: function () {
            return {
                show: !0,
                brandLink: {
                    name: n.i18n.getMessage("appName"),
                    url: "https://www.facebook.com/shawnsavour/",
                    newTab: !0
                },
                notifications: [ {
                    name: "Follow me",
                    url: "https://www.facebook.com/shawnsavour/",
                    target: "_blank"
                }, {
                    name: "Buy Me a Coffee",
                    url: "https://www.shawnsavour.com/buy-me-coffee",
                    target: "_blank"
                }],
                menus: [{
                    name: "Options",
                    url: "options.html",
                    icon: "nc-settings-gear-64"
                }, {
                    name: "FAQ",
                    url: "#",
                    icon: "nc-support-17",
                    target: "_blank"
                }]
            }
        },
        methods: {
            setTarget: function (n) {
                return "_blank" === n ? "_blank" : "_self"
            }
        },
        template: '\n      <div class="container-fluid">\n        <div class="navbar-wrapper">\n          <div class="navbar-minimize">\n            <button id="minimizeSidebar" class="btn btn-primary btn-fill btn-round btn-icon d-none d-lg-block">\n            <i class="fa fa-ellipsis-v visible-on-sidebar-regular"></i>\n            <i class="fa fa-navicon visible-on-sidebar-mini"></i>\n            </button>\n          </div>\n          <a class="navbar-brand" :href="brandLink.url" :target="brandLink.newTab ? \'_blank\' : \'_self\'">{{brandLink.name}}</a>\n        </div>\n        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">\n        <span class="navbar-toggler-bar burger-lines"></span>\n        <span class="navbar-toggler-bar burger-lines"></span>\n        <span class="navbar-toggler-bar burger-lines"></span>\n        </button>\n        <div class="collapse navbar-collapse justify-content-end" v-if="show">\n          <ul class="navbar-nav">\n            <li class="dropdown nav-item">\n              <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">\n                <i class="nc-icon nc-bell-55"></i>\n                <span class="notification">{{notifications.length}}</span>\n                <span class="d-lg-none">Notification</span>\n              </a>\n              <ul class="dropdown-menu">\n                <a class="dropdown-item" :href="notify.url" :target="setTarget(notify.target)" v-for="notify in notifications">{{notify.name}}</a>\n              </ul>\n            </li>\n            <li class="nav-item dropdown">\n              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n                <i class="nc-icon nc-bullet-list-67"></i>\n              </a>\n              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">\n                <a class="dropdown-item" :href="menu.url" :target="setTarget(menu.target)" v-for="menu in menus">\n                  <i :class="`nc-icon ${menu.icon}`"></i> {{menu.name}}\n                </a>\n              </div>\n            </li>\n          </ul>\n        </div>\n      </div>\n    '
    }), Vue.component("footer-content", {
        data: function () {
            return {
                menus: [{
                    name: "Home",
                    url: "options.html"
                }, {
                    name: "Donate",
                    url: "https://www.shawnsavour.com/buy-me-coffee",
                    target: "_blank"
                }],
                year: (new Date).getFullYear()
            }
        },
        methods: {
            setTarget: function (n) {
                return "_blank" === n ? "_blank" : "_self"
            }
        },
        template: '\n      <div class="container">\n        <nav>\n          <ul class="footer-menu">\n            <li v-for="menu in menus"><a :href="menu.url" :target="setTarget(menu.target)">{{menu.name}}</a></li>\n          </ul>\n          <p class="copyright text-center">\n            &copy; {{year}} <a href="https://www.shawnsavour.com/" target="_blank">ShawnSavour</a> &amp; <a href="https://www.facebook.com/179034362668856" target="_blank">ShawnSavour</a>\n          </p>\n        </nav>\n      </div>\n    '
    }), new Vue({
        el: "#sidebar"
    }), new Vue({
        el: "#shawn-savour-navbar"
    }), new Vue({
        el: "#footer"
    })
}(chrome);