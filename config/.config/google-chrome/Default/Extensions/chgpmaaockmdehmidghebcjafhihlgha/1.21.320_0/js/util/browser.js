// LICENSE_CODE ZON
'use strict'; /*jslint node:true, eqnull:true, -W041, browser:true*/
(function(){
var define;
var is_node_ff = typeof module=='object' && module.exports;
if (!is_node_ff)
    define = self.define;
else
    define = require('./require_node.js').define(module, '../');
define([], function(){
var E = {};
// http://mxr.mozilla.org/mozilla-central/source/netwerk/base/src/ProxyAutoConfig.cpp

function dnsResolve(host){ return null; }
E.dnsDomainIs = function(host, domain){
    return host.length>=domain.length &&
	host.substring(host.length - domain.length)==domain;
};

E.dnsDomainLevels = function(host){ return host.split('.').length - 1; };

E.convert_addr = convert_addr;
function convert_addr(ipchars){
    var bytes = ipchars.split('.');
    var result = ((bytes[0] & 0xff) << 24) | ((bytes[1] & 0xff) << 16) |
	((bytes[2] & 0xff) << 8) | (bytes[3] & 0xff);
    return result>>>0;
}

E.isInNet = function(ipaddr, pattern, maskstr){
    var test = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    .exec(ipaddr);
    if (test==null)
    {
        ipaddr = dnsResolve(ipaddr);
        if (ipaddr==null)
            return false;
    }
    else if (test[1]>255 || test[2]>255 || test[3]>255 || test[4]>255)
        return false; // not an IP address
    var host = convert_addr(ipaddr);
    var pat = convert_addr(pattern);
    var mask = convert_addr(maskstr);
    return (host & mask)==(pat & mask);
};

E.isPlainHostName = function(host){ return !host.includes('.'); };

E.isResolvable = function(host){
    var ip = dnsResolve(host);
    return ip!=null;
};

E.localHostOrDomainIs = function(host, hostdom){
    return host==hostdom || hostdom.lastIndexOf(host + '.', 0)==0; };

E.shExpMatch = function(url, pattern){
   pattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
   .replace(/\?/g, '.');
   var newRe = new RegExp('^'+pattern+'$');
   return newRe.test(url);
};

return E; }); }());
