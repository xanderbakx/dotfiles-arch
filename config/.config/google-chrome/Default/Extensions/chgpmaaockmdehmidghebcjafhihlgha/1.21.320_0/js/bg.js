// LICENSE_CODE ZON
'use strict'; /*jslint browser:true*/
define([], function(){

function _init(conf, zon_config){
    window.conf = conf;
    window.zon_config = zon_config;
    window.hola_va = true;
    require(['config'], function(config){
        window.be_config = config;
        config.init(conf, zon_config);
        require(['jquery', '/bext/va/pub/va.js', '/util/storage.js',
            '/bext/pub/browser.js'], loaded);
    });

    function loaded($, va, storage, B){
        var conf_url = 'http://client.hola.org/client_cgi/background_init';
        B.init();
        B.runtime.set_uninstall_url('https://hola.org/uninstall_va');
        $.getJSON(conf_url, function(conf){
            if (!(conf && conf.va_conf && conf.va_conf.enabled))
                return;
            var init_modules = ['/bext/pub/tabs.js'];
            require(init_modules, function(){
                [].slice.call(arguments).forEach(function(m){ m.init(); });
                va.init(conf);
            });
        });
        first_run(storage);
        update_icon(storage);
    }
}

function first_run(storage){
    var initialized = storage.get_int('ext_accel_initialized');
    ensure_uuid(storage);
    if (initialized)
        return;
    storage.set('ext_accel_initialized', 1);
    storage.set('ext_accel_enabled', 1);
}

function ensure_uuid(storage){
    if (storage.get('uuid'))
        return;
    var buf = new Uint8Array(16), uuid = '';
    window.crypto.getRandomValues(buf);
    for (var i=0; i<buf.length; i++)
        uuid += (buf[i]<=0xf ? '0' : '')+buf[i].toString(16);
    storage.set('uuid', uuid);
}

function update_icon(storage){
    var is_on = storage.get_int('ext_accel_enabled');
    is_on = is_on===undefined ? true : !!is_on;
    window.chrome.browserAction.setIcon(
        {path: 'img/ha_19'+(is_on ? '' : '_inactive')+'.png'});
}


function init(){
    require(['conf', 'zon_config'], _init);
}

init(); });
