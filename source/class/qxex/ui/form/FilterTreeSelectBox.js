/**
 * TreeSelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterTreeSelectBox", {
  extend: qxex.ui.form.TreeSelectBox,
  include: qxex.ui.form.MSelectBoxFilter,

  construct() {
    super();

    this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 0; //we only display filter for 6 or more items

    this.showFilter = false;

    this.addFilterTextField(null, this.filterList);
  },

  members: {
    // overridden
    _onKeyPress(e) {
      var iden = e.getKeyIdentifier();
      if (iden == "Space") {
        e.preventDefault(); //otherwise SelectBox.js _onKeypress calls this.toggle();
      } else {
        super._onKeyPress(e);
      }
    },

    filterList(filterText) {
      var textField = this.getFilterTextField();
      var root = this.getChildControl("list").getRoot();
      //       textField.addListener("input",function(e){
      //          var text = e.getData().toLowerCase();
      var text = filterText.toLowerCase();
      var obj = {count: 0, all: 0};
      var show = this.setNodeVisibilityAndRecurseIntoChildren(root, text, 0, obj);
      if (show) {
        textField.setTextColor("green");
      } else {
        textField.setTextColor("red");
      }

      this.getFilterLabel().setValue(obj.count + "/" + obj.all);
      //       },this);
    },

    /**
     * Used for filtering a tree
     * 
     * @param {object} node 
     * @param {string} text all lowercase, already toLowerCase called before root call
     * @param {number} depth 
     * @param {any} obj 
     * @returns 
     */
    setNodeVisibilityAndRecurseIntoChildren(node, text, depth, obj) {
      var noFilter = text == "";

      var showNode = noFilter && depth == 1;
      var labelSupportsRich = node.getChildControl("label").isRich();
      var labelOriginal = node.__labelOriginal || node.getLabel();
      if (!node.__labelOriginal) node.__labelOriginal = labelOriginal; //on first DFS, save original rich label;

      var labelStrippedLower = node.__labelStrippedLower || qx.lang.String.stripTags(labelOriginal).toLowerCase(); //cache
      if(!node.__labelStrippedLower) node.__labelStrippedLower = labelStrippedLower;

      if (!showNode && !noFilter) {
        var matchPos = labelStrippedLower.indexOf(text);
        showNode = matchPos >= 0;
        if (showNode && labelSupportsRich) {
          let utils = require("utils");
          let labelWithMatchUnderlined = utils.underlineTextInMarkup(labelOriginal,text, matchPos);
          node.setLabel(labelWithMatchUnderlined);
        }
      } else {
        node.setLabel(labelOriginal);
      }

      var children = node.getChildren();

      var showChildren =
        children.filter(function (childNode) {
          return this.setNodeVisibilityAndRecurseIntoChildren(childNode, text, depth + 1, obj);
        }, this).length > 0;

      if (noFilter && depth == 1) showChildren = false;

      var show = showNode || showChildren;

      if ((show || noFilter) && (depth > 0 || !this.getChildControl("list").getHideRoot())) {
        node.show();
      } else {
        node.exclude();
      }

      node.setOpen(showChildren || depth == 0);

      /*if(showNode && (text != "")){
          node.getChildControl("label").setTextColor("green");
      }else{
          node.getChildControl("label").setTextColor("black");
      }*/
      showNode && obj.count++;
      obj.all++;

      return show;
    }
  }
});
