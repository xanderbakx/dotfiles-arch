// LICENSE_CODE ZON
'use strict'; /*zlint node, br*/
(function(){
var define;
var is_node_ff = typeof module=='object' && module.exports;
if (!is_node_ff)
    define = self.define;
else
    define = function(setup){ module.exports = setup(); };
define(function(){
var E = {};

// XXX arik: sync: util/user_agent.js <-> svc/cdn/pub/play_loader.js
var win_versions = {
    '10.0': '10.0',
    '6.3': '8.1',
    '6.2': '8',
    '6.1': '7',
    '6.0': 'vista',
    '5.2': '2003',
    '5.1': 'xp',
    '5.0': '2000',
};

var arch_mapping = {
    x86_64: '64',
    i686: '32',
    arm: 'arm',
};

var check_hola = /\bhola_android\b/i;
var check_android_cdn = /Android.* CDNService\/([0-9\.]+)$/;
var check_ios_cdn = / CDNService\/([0-9\.]+)$/;
var check_opera = /\bOPR\b\/(\d+)/i;
var check_edge = /\bEdge\b\/(\d+)/i;
var check_xbox = /\bxbox\b/i;
var check_ucbrowser = /\bUCBrowser\b\/(\d+)/i;
var check_webview = / Version\/(\d+)(\.\d)/;

var is_browser = !is_node_ff && typeof window!='undefined';

function ios_ua(ua, safari_ver){
    var res;
    if (res = /(?:iPhone|iPad|iPod|iPod touch);.*?OS ([\d._]+)/.exec(ua))
    {
        var ios_ver = res[1];
        return {browser: 'safari', version: safari_ver||ios_ver, ios: ios_ver,
            hola_ios: (is_browser&&window.hola_cdn_sdk)||
            check_ios_cdn.test(ua)};
    }
    if (/HolaCDN iOS/.exec(ua))
        return {browser: 'safari', hola_ios: true};
}

function check_chromium(ua){
    if (check_webview.test(ua) || /Android/.test(ua) || / Mobile /.test(ua) ||
        check_opera.test(ua))
    {
        return false;
    }
    var group = '(?: (\\w*)\\/)?', ver = '\\/[\\d\\.]+';
    var res = new RegExp('AppleWebKit'+ver+'(?: \\(.*\\))?'+group+'.* Chrome'+
        ver+group+'.* Safari'+ver+group).exec(ua);
    return res && (res[1]||res[2]||res[3]);
}

E.guess_browser = function(ua){
    var res;
    ua = ua || (is_browser ? window.navigator&&navigator.userAgent : '');
    if (res = /\bOpera Mini\/(\d+)/.exec(ua))
        return {browser: 'opera_mini', version: res[1]};
    var ucbrowser = check_ucbrowser.exec(ua);
    if (res = /[( ]MSIE ([6789]|10).\d[);]/.exec(ua))
	return {browser: 'ie', version: res[1], xbox: check_xbox.test(ua)};
    if (res = /[( ]Trident\/\d+(\.\d)+.*rv:(\d\d)(\.\d)+[);]/.exec(ua))
	return {browser: 'ie', version: res[2], xbox: check_xbox.test(ua)};
    if (res = / Chrome\/(\d+)(\.\d+)+.* Safari\/\d+(\.\d+)+/.exec(ua))
    {
        var opera = check_opera.exec(ua);
        var edge;
        if (edge = check_edge.exec(ua))
            return {browser: 'ie', version: edge[1]};
	return {browser: 'chrome', version: res[1],
	    android: ua.match(/Android/),
	    webview: ua.match(check_webview),
	    hola_android: check_hola.test(ua),
            hola_app: check_android_cdn.test(ua),
            chromium_based: check_chromium(ua),
	    opera: opera && !!opera[1],
	    opera_version: opera ? opera[1] : undefined,
	    ucbrowser: ucbrowser && !!ucbrowser[1],
	    ucbrowser_version: ucbrowser ? ucbrowser[1] : undefined};
    }
    if (res = / QupZilla\/(\d+\.\d+\.\d+).* Safari\/\d+.\d+/.exec(ua))
	return {browser: 'qupzilla', version: res[1]};
    if (res = /\(PlayStation (\d+) (\d+\.\d+)\).* AppleWebKit\/\d+.\d+/
        .exec(ua))
    {
	return {browser: 'playstation'+res[1], version: res[2]};
    }
    if (res = / Version\/(\d+)(\.\d)+.* Safari\/\d+.\d+/.exec(ua))
    {
        if (!ua.match(/Android/))
            return ios_ua(ua, res[1])||{browser: 'safari', version: res[1]};
        return {browser: 'chrome', version: res[1], android: true,
            webview: true, hola_android: check_hola.test(ua),
            hola_app: check_android_cdn.test(ua),
	    ucbrowser: ucbrowser && !!ucbrowser[1],
	    ucbrowser_version: ucbrowser ? ucbrowser[1] : undefined};
    }
    if (res = / (Firefox|PaleMoon)\/(\d+).\d/.exec(ua))
    {
	return {browser: 'firefox', version: res[2],
            palemoon: res[1]=='PaleMoon'};
    }
    if (/Hola\/\d+\.\d+.*?(?:iPhone|iPad|iPod)/.exec(ua))
        return {browser: 'safari', version: 'Hola'};
    if (res = ios_ua(ua))
        return res;
    return {};
};

E.browser_to_string = function(browser){
    if (typeof browser!='object' || !browser.browser)
        return 'unknown';
    var s = browser.browser;
    if (browser.version)
        s += ' '+browser.version;
    if (browser.xbox)
        s += ' xbox';
    if (browser.android)
        s += ' android';
    if (browser.webview)
        s += ' webview';
    if (browser.chromium_based)
        s += ' chromium_based';
    if (browser.opera)
    {
        s += ' opera';
        if (browser.opera_version)
            s += '-'+browser.opera_version;
    }
    if (browser.hola_android)
        s += ' hola_android';
    if (browser.hola_app)
        s += ' hola_app';
    if (browser.ucbrowser)
    {
        s += ' ucbrowser';
        if (browser.ucbrowser_version)
            s += '-'+browser.ucbrowser_version;
    }
    if (browser.palemoon)
        s += ' palemoon';
    if (browser.ios)
        s += ' ios';
    return s ? s : 'unknown';
};

E.guess = function(ua, platform){
    var res;
    ua = ua || (is_browser ? navigator.userAgent : '');
    platform = platform || (is_browser ? navigator.platform : '');
    if (check_xbox.exec(ua))
        return {os: 'xbox', mobile: false};
    if (res = /Windows(?: NT(?: (.*?))?)?[);]/.exec(ua))
    {
        return {
            os: 'windows',
            version: win_versions[res[1]],
            release_version: res[1],
            arch: ua.match(/WOW64|Win64|x64/) ? '64' : '32',
            mobile: false,
        };
    }
    if (res = /Macintosh.*; (?:Intel|PPC) Mac OS X (\d+[._]\d+)/.exec(ua))
        return {os: 'macos', version: res[1].replace('_', '.'), mobile: false};
    if (/Macintosh/.exec(ua))
        return {os: 'macos', mobile: false};
    if (res = /Android(?: (\d+\.\d+))?/.exec(ua))
        return {os: 'android', version: res[1], mobile: true};
    if (res = /(Linux|CrOS|OpenBSD|FreeBSD)(?: (x86_64|i686|arm))?/.exec(ua))
    {
        if (check_opera.test(ua) && res[1]=='Linux' && res[2]=='x86_64' &&
            /^Linux arm/.test(platform))
        {
            // Opera Mobile bug
            return {os: 'android', mobile: true};
        }
        return {
            os: res[1].toLowerCase(),
            arch: arch_mapping[res[2]],
            nix: true,
            mobile: false,
        };
    }
    if (res = /(?:iPhone|iPad|iPod|iPod touch);.*?OS (\d+[._]\d+)/.exec(ua))
        return {os: 'ios', version: res[1].replace('_', '.'), mobile: true};
    if (/iPhone|iPad|iPod|HolaCDN iOS/.exec(ua))
        return {os: 'ios', mobile: true};
    if (/PLAYSTATION/.exec(ua))
        return {os: 'ps', mobile: false};
    if (/Windows Phone/.exec(ua))
        return {os: 'winphone', mobile: true};
    // HitLeap Viewer (whatever it is) is Windows-only
    if (/HitLeap Viewer/.exec(ua))
        return {os: 'windows', mobile: false};
    return {};
};

E.guess_device = function(ua){
    var res;
    ua = ua || (is_browser ? navigator.userAgent : '');
    if (res = /(iPhone|iPad|iPod)/.exec(ua))
        return {device: res[1].toLowerCase()};
    return {};
};

E.support_fullscreen = function(){
    return !!(is_browser &&
        (document.fullscreenEnabled||document.mozFullScreenEnabled||
        document.webkitFullscreenEnabled||document.msFullscreenEnabled));
};
return E; }); }());
