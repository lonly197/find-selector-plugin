var _20p = _20p || {};
(function($){

/* Start Highlighter  */
// Highlighter factory
var Highlighter = (function() {
  var cache = {};
  return {
    cache : cache, // for testing
    get : function(id, options){
      if(cache[id]){
        return cache[id];
      }else{
        var fr = new HighlighterCls(id, options);
        cache[id]=fr;
        return fr;
      }
    },
    remove : function(id){
      if(cache[id]){
        delete cache[id];
      }
    }
  };
})();

/* Highlighter class */
var HighlighterCls = function(id,options){
  this.borderWidth = 2; // change this to increase the size of border
  this.options = {
    borderWidth : 2,
    centerborderWidth : 0,
    type : 'frame',
    hole : false,
    allowEventsOnAllSides: false,
    className : '',
    cancelClick: false,
    cancelClickOnAllSides: false,
    zIndex: 999
  };
  this.overEl = null;
  this.frame  = null;
  var zIndex = options.zIndex || this.options.zIndex;
  this.options.styles = {
      defaults:{
        position:'absolute',
        display:'none',
        height:'2px',
        width: this.options.borderWidth+'px',
        zIndex: zIndex
      },
      sides:{
        backgroundColor:'#343739',//'#0066FF',
        opacity:'0.4'
      },
      center:{
        backgroundColor: '#fff',
        borderWidth : this.options.centerborderWidth + 'px',
        borderColor : '#000',
        borderStyle : 'solid',
        opacity: '0.2',
        "box-sizing": "border-box"
      }
    }
  this.id = id;
  this.init(id,options);
};

$.extend(HighlighterCls.prototype,{
  init : function(id,options){
    var options = options || {};
    // deep extend
    $.extend(true,this.options,options);
    this.createNew(id);
    return this;
  },
  createNew : function(id){
    var self=this;
    this.frame = {};
    var className = this.options.className;
    if($.trim(className).length){
      className = ' ' + className;
    }
    //for border box and center
    this.frame.left   = $('<div class="_20p_frame _20p_frame_side' + className + '"></div>').appendTo($('body'));
    this.frame.right  = $('<div class="_20p_frame _20p_frame_side' + className + '"></div>').appendTo($('body'));
    this.frame.top    = $('<div class="_20p_frame _20p_frame_side' + className + '"></div>').appendTo($('body'));
    this.frame.bottom = $('<div class="_20p_frame _20p_frame_side' + className + '"></div>').appendTo($('body'));
    this.frame.center = $('<div class="_20p_frame _20p_frame_center' + className + '"></div>').appendTo($('body'));

    $.each(this.frame, function(key, value) {
        var sideStyles = $.extend(self.options.styles.defaults,self.options.styles.sides);
        value.css(sideStyles);
        if(key=='center'){
          var centerStyles = $.extend(self.options.styles.defaults,self.options.styles.center);
          value.css(centerStyles);
        }
    });

    return this;
  },
  onCancelClick: function(options){
    var self = this;
    this.offCancelClick();
    $(document).on("mousedown.highlight", function(evt){
      //console.log("document mousedown in highlight");
      if(options.cancelClick){
        self.frame.center.css("pointer-events","auto");
      }
      if(options.cancelClickOnAllSides==true){
        self.frame.left.css("pointer-events","auto");
        self.frame.top.css("pointer-events","auto");
        self.frame.right.css("pointer-events","auto");
        self.frame.bottom.css("pointer-events","auto");
      }
    });
    $(document).on("mouseup.highlight", function(evt){
      //console.log("document mouseup in highlight");
      if(options.cancelClick){
        self.frame.center.css("pointer-events","none");
      }
      if(options.cancelClickOnAllSides==true){
        self.frame.left.css("pointer-events","none");
        self.frame.top.css("pointer-events","none");
        self.frame.right.css("pointer-events","none");
        self.frame.bottom.css("pointer-events","none");
      }
    });
  },
  offCancelClick: function(){
    $(document).off("mousedown.highlight");
    $(document).off("mouseup.highlight");
  },
  highlight : function(overEl, runtime_options){
    runtime_options = runtime_options || {};
    runtime_options = $.extend(true, {}, this.options, runtime_options);
    // //console.log("highlight options", JSON.stringify(runtime_options), JSON.stringify(this.options));
    var v_offset = null;
    var ownerIframe = null;
    if(typeof overEl  === 'undefined'){
      overEl = this.overEl;
      v_offset = this.v_offset;
      ownerIframe = this.ownerIframe || null;
    }else{
      if(typeof overEl.get == 'undefined'){
        this.overEl = overEl;
        this.v_offset = null;
        this.ownerIframe = null;
      }else{
        this.overEl = overEl.get(0);
        v_offset = overEl.data("v_offset") || null;
        this.v_offset = v_offset;
        ownerIframe = overEl.data("ownerIframe") || null;
        this.ownerIframe = ownerIframe;
      }
    }
    // //console.log("overEl 1 ", overEl);
    if(this.overEl==null){
      return; //do nothing;
    }

    var self=this;
    if(runtime_options.type=='frame'){
      this.setFrameElements(overEl);
    }else if(runtime_options.type=='shine'){
      this.setShineElements(overEl);

    }

    $.each(this.frame, function(key, value) {
      if(runtime_options.bgcolor){
        value.css("backgroundColor", runtime_options.bgcolor);
      }else{
        if(key=="center"){
          // value.css("backgroundColor", self.options.styles.center.backgroundColor || (self.options.styles.defaults.backgroundColor || ''));
        }else{
          value.css("backgroundColor", self.options.styles.sides.backgroundColor || (self.options.styles.defaults.backgroundColor || ''));
        }
      }

      value.show(); //"slow"
      // hide center if hole = true
      value.css({'pointer-events': ''});
      if(runtime_options.allowEventsOnAllSides==true || (key=='center' && runtime_options.hole==true)){
        // //console.log("****found hole");
        value.css({ 'pointer-events':'none'});
        // //tmp
        // //console.log("hide only center frame");
        // value.hide();
      }
    });
    if(runtime_options.hole==true || (runtime_options.allowEventsOnAllSides==true)){
      this.onCancelClick(runtime_options);
    }
    return this;
  },

  setShineElements : function(overEl){

    var ownerIframeDoc = this.ownerIframe ? this.ownerIframe.contentDocument: null;

    var element = $(overEl, ownerIframeDoc);

    if(!$.isEmptyObject(element)) {

      var offset = element.offset();
      var dimensions = {height: element.outerHeight(), width: element.outerWidth()};

      if(ownerIframeDoc){
        //add iframe offset to elements offset
        var iframeOffset = $(this.ownerIframe).offset();
        offset.top += iframeOffset.top;
        offset.left += iframeOffset.left;
      }

      if(this.v_offset){
        offset = {left: this.v_offset.left, top: this.v_offset.top};
        dimensions = {height: this.v_offset.height, width: this.v_offset.width};
      }


      var viewportWidth = $(document).width()-5; // hack to stop scrolbar's from coming
      var viewportHeight = $(document).height()-5;


      this.frame.left.css("left", "0px");
      this.frame.left.css("width", offset.left);

      this.frame.left.add(this.frame.right).css("top", offset.top);

      this.frame.left.add(this.frame.right).css("height",  dimensions.height);

      this.frame.right.css("left", offset.left + dimensions.width);
      this.frame.right.css("width", viewportWidth -  (offset.left + dimensions.width));

      this.frame.top.css("top", "0px");
      this.frame.top.css("height", offset.top);

      this.frame.top.add(this.frame.bottom).css("left", "0px");
      this.frame.top.add(this.frame.bottom).css("width", viewportWidth);
      this.frame.bottom.css("top", dimensions.height + offset.top);
      this.frame.bottom.css("height", viewportHeight - (offset.top + dimensions.height));

      this.frame.center.css({
          left: offset.left - this.options.centerborderWidth,
          top: offset.top - this.options.centerborderWidth,
          width: dimensions.width + this.options.centerborderWidth *2,
          height: dimensions.height + this.options.centerborderWidth *2
        });
    }

    return this;

  },

  setFrameElements : function(overEl){
    var ownerIframeDoc = this.ownerIframe ? this.ownerIframe.contentDocument: null;
    var element = $(overEl, ownerIframeDoc);

    if(!$.isEmptyObject(element)) {

      var offset = element.offset();
      if(ownerIframeDoc){
        //add iframe offset to elements offset
        var iframeOffset = $(this.ownerIframe).offset();
        offset.top += iframeOffset.top;
        offset.left += iframeOffset.left;
      }

      //offset.left = offset.left - parseInt($("body").css("marginLeft"), 10);
      //offset.top = offset.top - parseInt($("body").css("marginTop"), 10);
      var dimensions = {height: element.outerHeight(), width: element.outerWidth()}; //element.get(0).getBoundingClientRect();//


      if(this.v_offset){
        offset = {left: this.v_offset.left, top: this.v_offset.top};
        dimensions = {height: this.v_offset.height, width: this.v_offset.width};
      }



      var viewportWidth = $(document).width();
      var viewportHeight = $(document).height();

      this.frame.left.css("left", offset.left - this.options.borderWidth);
      this.frame.left.add(this.frame.right).css("top", offset.top);
      this.frame.left.add(this.frame.right).css("height",  dimensions.height);
      this.frame.right.css("left", offset.left + dimensions.width);
      this.frame.top.css("top", offset.top - this.options.borderWidth);
      this.frame.top.add(this.frame.bottom).css("left", offset.left - this.options.borderWidth);
      this.frame.top.add(this.frame.bottom).css("width",  dimensions.width + 2 * this.options.borderWidth);
      this.frame.bottom.css("top", dimensions.height + offset.top);

      this.frame.center.css({
          left: offset.left,
          top: offset.top,
          width: dimensions.width,
          height: dimensions.height
      });
    }

    return this;
  },

  hide: function(){
    $.each(this.frame, function(key, value) {
        value.css({ display:'none'});
    });
    this.offCancelClick();
    return this;
  },
  destroy: function(){
    $.each(this.frame, function(key, value) {
      value.remove();
    });
    var id = this.id;
    setTimeout(function(){_dm.Highlighter.remove(id)},10);
  }
});
/* End of Highlighter */

//export highlighter to root namespace
_20p.Highlighter = Highlighter;

})(_20p_$);