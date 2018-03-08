// LICENSE_CODE ZON
'use strict'; /*jslint browser:true*/
define(['/bext/pub/backbone.js', '/bext/pub/browser.js',
    '/bext/pub/tabs.js', '/util/zerr.js'],
    function(be_backbone, B, be_tabs, zerr){
B.assert_bg('va');
var cb_wrapper = zerr.catch_unhandled_exception;
var E = new be_backbone.task_model();
var on_tab_created = cb_wrapper(function(o){
    var tab = o.tab, url = tab.url, id = tab.id;
    var customer;
    if (!(customer = need_va(url)))
	return;
    load_va(customer, id, url);
});
var on_tab_updated = cb_wrapper(function(o){
    var url = o.tab&&o.tab.url, id = o.id;
    var customer;
    if (!(customer = need_va(url)))
	return;
    load_va(customer, id, url);
});
var on_tab_replaced = cb_wrapper(function(o){
    var added = o.added;
    var customer;
    B.tabs.get(added, function(tab){
        var url = tab&&tab.url;
        if (!(customer = need_va(url)))
            return;
        load_va(customer, added, url);
    });
});
// XXX arik: need test
function need_va(url){
    if (!url || !E.va_conf.customers)
        return;
    for (var c in E.va_conf.customers)
    {
        // XXX arik: make match regex and not string of regex. today we use
        // string because we get it via background_init with JSON.stringify
        if (!(new RegExp(E.va_conf.customers[c].match)).test(url))
            continue;
        return c;
    }
    return false;
}
function script_data(o){
    if (window.hola_va_inited)
    {
        console.log('hola va already inited');
        return;
    }
    window.hola_va_inited = true;
    function load_script(url, onload){
        var script = document.createElement('script');
        script.src = url;
        script.onload = onload;
        script.async = true;
        if (document.getElementsByTagName('head').length)
            document.getElementsByTagName('head')[0].appendChild(script);
        else
            document.getElementsByTagName('body')[0].appendChild(script);
    }
    load_script('//client.h-cdn.com/loader.js?customer='+
        encodeURIComponent(o.customer), function(){
        console.log('hola va loaded');
    });
}
function load_va(customer, tabid, url){
    console.log('loading va for '+customer+' tab '+tabid+
        ' url '+url);
    B.tabs.execute_script(tabid, {code: '('+
        script_data.toString()+')('+JSON.stringify({customer: customer})+')'},
        function(){ console.log('va loaded'); });

}
E.init = function(opt){
    if (!opt||!opt.va_conf)
        return;
    E.va_conf = opt.va_conf;
    E.listenTo(be_tabs, 'created', on_tab_created);
    E.listenTo(be_tabs, 'updated', on_tab_updated);
    E.listenTo(be_tabs, 'replaced', on_tab_replaced);
};
return E; });
