var _20p = _20p || {};
(function(exports){
  exports.DOMAIN_ROOT = "https://css_selector.local";
  exports.loadJsAsync = function(scripts) {
    //console.log('loading scripts async', scripts);
    var scriptIndex = 0;
    (function loadScriptInAsync() {
      var script = scripts[scriptIndex++];
      if(script) {
        exports.loadJs(script.js, function() {
          //console.log('loading script', script.js)
          if(script.callback) {
            script.callback(function() {
              loadScriptInAsync();
            });
          } else {
            loadScriptInAsync();
          }
        });
      } else {
        //console.log('loaded everything!');
      }
    })();
  }
  exports.loadJs = function(url, loaded) {
    var scr = document.createElement('script');
    scr.type = 'text/javascript';
    scr.src = url;
    if (navigator.userAgent.indexOf('MSIE') > -1) {
        scr.onload = scr.onreadystatechange = function () {
            if (this.readyState == "loaded" || this.readyState == "complete") {
                if (loaded) { loaded(); }
            }
            scr.onload = scr.onreadystatechange = null;
        };
    } else {
        scr.onload = loaded;
    }
    document.getElementsByTagName('head')[0].appendChild(scr);
  };
  exports.addStyleSheet = function(url) {
    var link  = document.createElement('link');
    link.id   = (+new Date()) + "_app_styles";
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href =  url;
    link.media= 'all';
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  var afterJsLoaded = function(){
    _20p.startApp();
  };

  var init = function(){
    var scripts = [
      { js: exports.DOMAIN_ROOT + "/js/jquery.js", callback: null },
      { js: exports.DOMAIN_ROOT + "/js/jquery.hotkeys.js", callback: null },
      { js: exports.DOMAIN_ROOT + "/js/jquery.hoverIntent.js", callback: null },
      { js: exports.DOMAIN_ROOT + "/src/dom-selector.js", callback: null },
      { js: exports.DOMAIN_ROOT + "/src/highlighter.js", callback: null },
      { js: exports.DOMAIN_ROOT + "/src/jquery.ct.js", callback: null },
      { js: exports.DOMAIN_ROOT + "/js/main.js", callback: afterJsLoaded }
    ];
    exports.loadJsAsync(scripts);
  };
  init();
})(_20p);