var _20p = _20p || {};
(function($){
  _20p.isStarted = false;
  _20p.elementSelected = false;
  _20p.selectedElem = null;

  _20p.__HtmlTagType = {
    a:"Link",
    abbr:"Abbreviation",
    area:"Image Map Area",
    b:"Bold Text",
    big:"Big Text",
    blockquote:"Block Quote",
    br:"Line Break",
    cite:"Citation",
    col:"Column",
    colgroup:"Column Group",
    dd:"Definition List Definition",
    del:"Deleted Text",
    dfn:"Definition",
    dir:"Directory List",
    div:"Division",
    dl:"Definition List",
    dt:"Definition List Item",
    em:"Emphasized Text",
    embed:"Embedded Object",
    eventsource:"Event Source",
    figcaption:"Figure Caption",
    h1:"Headline",  h2:"Headline",  h3:"Headline",  h4:"Headline", h5:"Headline", h6:"Headline",
    hgroup:"Section Header",
    hr:"Horizonal Rule",
    i:"Italic Text",
    iframe:"iFrame",
    img:"Image",
    input:"Input Field",
    ins:"Inserted Text",
    kbd:"Keyboard Text",
    li:"List Item",
    map:"Image Map",
    mark:"Marked Text",
    menu:"Menu List",
    nav:"Navigation Section",
    object:"Embedded Object",
    ol:"Ordered List",
    optgroup:"Option Group",
    option:"Selection Option",
    p:"Paragraph",
    param:"Embedded Object Parameter",
    pre:"Preformatted Text",
    q:"Quotation",
    samp:"Sample Output",
    select:"Selection List",
    small:"Small Text",
    strong:"Strong Text",
    sub:"Subscript Text",
    sup:"Superscript Text",
    tbody:"Table Body",
    td:"Table Data",
    textarea:"Text Field",
    tfoot:"Table Footer",
    th:"Table Header",
    thead:"Table Header",
    tr:"Table Row",
    tt:"Typewriter Text",
    u:"Underlined Text",
    ul:"Unordered List",
    "var":"Variable"
  };


  _20p.getLastZindex=function(){
    var maxZ = Math.max.apply(null,$.map($('*'), function(e,n){
                return parseInt($(e).css('z-index')) || 1;
               })
        );
    return maxZ;
  };

  _20p.getTargetParents = function(target){
    var parentsInfo = [];
    var parents = $(target).parents();
    for(var i=0;i<parents.length;i++){
      var el = parents.eq(i);
      var id = el.attr("id");
      var selector = _20p.domSelector.getUniqueSelector(el);
      var tagName  = el.get(0).tagName;
      parentsInfo.push([selector,tagName,id]);
    }
    return parentsInfo;
  };

  _20p.showPickedSelector = function(target, selector){
    selector = selector || _20p.domSelector.getUniqueSelector(target);
    this.elementSelected = true;
    this.selectedElem = {};
    this.selectedElem.selector = selector;
    this.selectedElem.el = target;
    this.mine_highlighter.hide();
    this.show_selected_highlighter.highlight(target);
    this.showTooltip(selector, target);
  };
  _20p.hideTooltip = function(target){
    $(".__root_tooltip_content").off("mousemove.parents");
    $(".__root_tooltip_content").off("click.parents");
    $(".ct-wrapper").each(function(){
      $(this).remove();
    });
  }
  _20p.getFriendlyTagName = function(tagName,id){
    tagName = tagName.toLowerCase();
    var tagType = this.__HtmlTagType[tagName];
    tagType || (tagType=tagName.charAt(0).toUpperCase()+tagName.slice(1));
    return id? tagType + " " + id : tagType + " &lt;" + tagName + "&gt;";
  };


  _20p.getParentsListHtml= function(target) {
    var parents = this.getTargetParents(target);
    var parentsList = [];
    for(var len=Math.min(parents.length,10),i=0;i<len;i++){
      var tagName  = parents[i][1];
      var id     = parents[i][2];
      var selector = parents[i][0] || '';
      var li = "<li ";
      var anchor = "";
      if("HTML"===tagName||"BODY"===tagName){
        li += " class='disabled'";
        anchor = "<span select-container='"+ selector + "' tabindex='-1'>" + _20p.getFriendlyTagName(tagName,id) + '</span>';
      }else{
        anchor = "<a select-container='"+ selector + "' href='#' tabindex='-1'>" + _20p.getFriendlyTagName(tagName,id) + '</a>';
      }
      li += ">" + anchor + "</li>";
      parentsList.push(li);
    }
    return "<ul class='__parents_list'>" + parentsList.join("") + "</ul>";
  };

  _20p.handleParentMouseMove = function(evt){
    var el = $(evt.target).closest("a[select-container]");
    if(el.length && $(evt.target).closest("li.disabled").length==0){
      var selector = el.attr("select-container");
      if(selector){
        this.show_selected_highlighter.highlight($(selector));
      }else {
        this.show_selected_highlighter.highlight($(this.selectedElem.selector));
      }
    }else {
      this.show_selected_highlighter.highlight($(this.selectedElem.selector));
    }
  };
  _20p.handleParentClick = function(evt){
    evt.preventDefault();
    var el = $(evt.target).closest("a[select-container]");
    if(el.length && $(evt.target).closest("li.disabled").length==0){
      var selector = el.attr("select-container");
      if(selector){
        _20p.hideTooltip();
        _20p.showPickedSelector($(selector), selector);
      }
    }
  };

  _20p.showTooltip = function(selector, target){
    var playerzIndex  = this.domHigherIndex + 4;
    // //console.log("Selected selector", selector, target);
    var position = 'most';
    var tooltip_content = "<div class='__root_tooltip_content'>";
    tooltip_content += "Selected Element Selector:<br/><div style='font-weight:bold;font-size:16px;border:1px solid #999;padding:5px;'>" + selector + "</div>";
    var parentsList = this.getParentsListHtml(target);
    tooltip_content += parentsList;
    tooltip_content += "</div>";
    $(target).ct(tooltip_content, {
      trigger: 'none',
      offsetParent: 'body',
      clickAnywhereToClose: false,
      wrapperzIndex:playerzIndex,
      fill: '#FFF',
      shrinkToFit:true,
      cornerRadius: 10,
      strokeWidth: 0,
      shadow: true,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 8,
      shadowColor: 'rgba(0,0,0,.9)',
      shadowOverlap: false,
      noShadowOpts: {strokeStyle: '#999', strokeWidth: 2},
      positions: position
    });
    $(target).ctOn();
    $(".__root_tooltip_content").on("mousemove.parents", this.handleParentMouseMove.bind(this));
    $(".__root_tooltip_content").on("click.parents", this.handleParentClick.bind(this));
  };

  _20p.stopApp = function(){
     this.isStarted = false;
     this.hideTooltip();
     this.mine_highlighter.hide();
     this.show_selected_highlighter.hide();
     this.elementSelected = false;
     this.selectedElem = null;
     $(document).off("keydown.main");
     $(document).off("mousemove.main");
     $(document).off("mouseup.main");
  };
  _20p.startApp = function(){
    if(this.isStarted){
      _20p.stopApp();
      return false;
    }
    this.isStarted = true;
    var self  = this;
    //init hightlighter here
    this.domHigherIndex = _20p.getLastZindex();
    var highlightZindex = this.domHigherIndex + 2;
    this.mine_highlighter = _20p.Highlighter.get('mine_highlighter', {
      type: 'frame',
      // hole: true,
      // allowEventsOnAllSides:true,
      // cancelClick: true,
      className: 'mouse_over_highlighter',
      zIndex: highlightZindex,
      styles: {
        sides: {
          backgroundColor: 'blue',
          opacity: 0.7
        },
        center: {
          backgroundColor: 'blue',
          opacity: 0.1
        }
      }
    });
    this.show_selected_highlighter = _20p.Highlighter.get('show_selected_highlighter', {
      type: 'shine',
      hole: false,
      centerxborderWidth: 0,
      className: 'show_selected_highlighter',
      zIndex: highlightZindex,
      styles: {
        sides: {
          backgroundColor: '#000',
          opacity: 0.7
        },
        center: {
          xborderWidth: '0px',
          backgroundColor: '#000',
          opacity: 0.1
        }
      }
    });

    $(document).bind("keydown.main","shift+s", function(evt) {
      if (self.elementSelected == false) {
        evt.preventDefault();
        //console.log("picker keydown selection");
        var target = $(self.mine_highlighter.overEl);
        self.showPickedSelector(target);
      };
    });
    $(document).on("mousemove.main", function(evt) {
      if (self.elementSelected == false) {
        var target = $(evt.target);
        var highlight_el = target;
        var highlight_options = {};
        if(evt.shiftKey){
          highlight_options  = {
            bgcolor:"green",
            hole: true,
            allowEventsOnAllSides:true,
            cancelClick:true,
            cancelClickOnAllSides:true
          };
          if(self.mine_highlighter.overEl == target.get(0)){
            self.mine_highlighter.hide();
          }
        }else{
          self.mine_highlighter.hide();
          var target_el = document.elementFromPoint(evt.clientX, evt.clientY);
          //console.log("***target",target_el, highlight_el.get(0));
          self.mine_highlighter.highlight();
          if(highlight_el.get(0)!=target_el){
            highlight_el = target_el;
          }
        }
        //console.log("runtime highlighter options", highlight_options);
        self.mine_highlighter.highlight(highlight_el, highlight_options);
      }
    });
    // click not added due to anchor
    // if mousedown on anchor and mouseup on diffrent element the
    // body click does not fired
    // the hack is register our work on mouseup
    $(document).on("mouseup.main", function(evt) {
      //console.log("document click", evt.target);
      if ($(evt.target).hasClass('show_selected_highlighter')) {
        self.elementSelected = false;
        self.selectedElem = null;
        self.mine_highlighter.highlight();
        self.show_selected_highlighter.hide();
        self.hideTooltip(self.show_selected_highlighter.overEl);
        return false;
      }else{
        evt.preventDefault();
        if ($(evt.target).hasClass('mouse_over_highlighter')) {
          var target = $(self.mine_highlighter.overEl);
          self.showPickedSelector(target);
        }
      }
    });
  };
  // _20p.startApp();
})(_20p_$);