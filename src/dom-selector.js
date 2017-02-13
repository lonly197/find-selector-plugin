var _20p = _20p || {};
(function($){
var domSelector = {
  ignoreClasses: function(className){
    var ignores = ["ui-sortable", "ui-droppable","has-error"];
    return (ignores.indexOf(className)>=0);
  },
  escapeJquerySpecials: function(str){
    str = str.replace(/([\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\`\{\|\}\~])/g, "\\$1");
    return str;
  },
  getSelector: function(el) {
    if (el.length != 1) {
        throw 'Requires one element.';
    }
    var path, node = el;
    while (node.length) {
      var realNode = node[0],
          name = realNode.localName;
      if (!name || name.toLowerCase() == 'html') {
          break;
      }
      node_id = $(realNode).attr("id");
      name = name.toLowerCase();
      if (node_id) {
        // As soon as an id is found, there's no need to specify more.
        var id_selector = name + '#' + this.escapeJquerySpecials(node_id) + (path ? '>' + path : '');
        // check this newly generated selector if not unique then traverse further
        var matches = $(id_selector);
        if (matches.length > 1) {
            // path = id_selector;
        } else {
            return id_selector;
        }
      } else if (realNode.className) {
        //name += '.' + realNode.className.split(/\s+/).join('.');
        // check if any of the class is unique
        var classes = realNode.className.split(/\s+/);
        for (var cindex in classes) {
            if ($.trim(classes[cindex]).length && !this.ignoreClasses(classes[cindex]) && $(name + "." + this.escapeJquerySpecials(classes[cindex])).length == 1) {
                // if unique return that as root
                var classSelector = name + "." + this.escapeJquerySpecials(classes[cindex]) + (path ? '>' + path : '');
                var matches = $(classSelector);
                if (matches.length > 1) {
                    // path = id_selector;
                } else {
                    return classSelector;
                }
            }
        }
      }
      var parent = node.parent();
      if (parent.length) {
        var sameTagSiblings = parent.children(name);
        if (sameTagSiblings.length > 1) {
            allSiblings = parent.children();
            var index = allSiblings.index(realNode) + 1;
            if (allSiblings.length > 1) {
                name += ':nth-child(' + index + ')';
            }
        }
        path = name + (path ? '>' + path : '');
        var parentName = parent[0].localName;
        if (parentName.toLowerCase() == 'html') {
            parent = []; //return if html node found
        }
      }
      node = parent;
    }
    return path;
  },
  getUniqueSelector: function(el) {
    el = $(el);
    var selector = this.getSelector(el);
    // //console.log("selector", selector);
    var matched = $(selector);
    if (matched.length > 1) {
      //console.warn("Not unique");
      // alert("Not unique");
    } else {
      if (matched[0] != el[0]) {
          //console.warn("wrong selector el", el[0], " matched", matched[0]);
          // alert("wrong selector");
          //console.warn("wrong selector");
      }
    }
    return selector;
  },
  getLastZindex: function(){
    var maxZ = Math.max.apply(null,$.map($('body > *'), function(e,n){
               if($(e).css('position')=='absolute')
                    return parseInt($(e).css('z-index'))||1 ;
               })
        );
    return maxZ;
  }
};
//export highlighter to root namespace
_20p.domSelector = domSelector;

})(_20p_$);