// LICENSE_CODE ZON
'use strict'; /*jslint browser:true*/
define(['jquery', '/util/storage.js', '/bext/pub/popup_lib.js',
    '/util/ajax.js'], function($, storage, be_popup_lib, ajax){
var E = {};

function on_load(){
    ext_promo_init();
    toggle_enabled();
    $('.header-switch').click(on_switch);
    $('.popup-header .logo').click(on_switch);
    $('.popup-container').show();
}

function on_switch(evt){
    if (evt)
        evt.preventDefault();
    var is_on = !is_accel_on();
    storage.set('ext_accel_enabled', is_on ? 1 : 0);
    toggle_enabled(is_on);
    be_popup_lib.perr_ok({id: 'be_ui_accel_switch', info: {is_on:
        is_on}});
    ajax({url: window.conf.url_ccgi+'/accelerator',
        qs: {state: is_on ? 'enabled' : 'disabled'}});
    window.chrome.browserAction.setIcon(
        {path: 'img/ha_19'+(is_on ? '' : '_inactive')+'.png'});
}

function toggle_enabled(is_on){
    var $el = $('.popup-container');
    is_on = is_on || is_accel_on();
    $el.toggleClass('enabled', is_on);
}

function is_accel_on(){
    var is_on = storage.get_int('ext_accel_enabled');
    return is_on===undefined ? true : !!is_on;
}

function ext_promo_init(){
  var $prom_desc = $('.ext-promo-desc');
  var $prom_items = $('.ext-promo-items a');
  var id_prefix = 'be_ui_va_click_ext_promo';
  $prom_desc.on('click', function(){
      var id = id_prefix+'_more_link';
      be_popup_lib.perr_ok({id: id});
      return true;
  });
  $prom_items.on('click', function(){
      var type = '';
      var $this = $(this);
      if ($this.hasClass('promo-ab'))
          type = 'ab';
      if ($this.hasClass('promo-vpn'))
          type = 'vpn';
      if ($this.hasClass('promo-android'))
          type = 'android';
      var id = id_prefix+'_'+type;
      be_popup_lib.perr_ok({id: id});
      return true;
  });
}

E.init = function(){
    $(on_load);
};

return E;
});
