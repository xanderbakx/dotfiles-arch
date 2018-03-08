// LICENSE_CODE ZON
'use strict'; /*jslint browser:true*/
define([], function(){

function _init(conf, zon_config){
    window.conf = conf;
    window.zon_config = zon_config;
    require(['config'], function(be_config){
        window.be_config = be_config;
        require(['ui_accel'], function(ui_accel){
            ui_accel.init();
        });
    });
}

function init(){
    require(['conf', 'zon_config'], _init);
}

init(); });
