/**
 * ComboBox with search-as-you type autocomplete filter.
 */
qx.Class.define("qxex.ui.form.FilterComboBox", {
  extend: qx.ui.form.ComboBox,
  include: qxex.ui.form.MSelectBoxFilter,

  construct() {
    super();
    this._childrenByModelHash = {};
    this._childrenByLabelHash = {};
    this.getChildControl("button").setKeepFocus(true); //keep cursor in textfield when opening list
    this.addFilterTextField(this.getChildControl("textfield"));
  },

  properties: {
    ignoreListChangeSelection: {
      check: "Boolean",
      init: false
    }
  },

  members: {
    _childrenByModelHash: null,
    _childrenByLabelHash: null,

    hideInsteadOfDestroy: false,

    // overridden
    focus() {
      this.getChildControl("textfield").getFocusElement().focus();
    },

    // overridden
    tabFocus() {
      this.focus();
      this.selectAllText();
    },

    //overridden from http://www.qooxdoo.org/current/apiviewer/#qx.ui.form.AbstractSelectBox
    add(listItem, options) {
      super.add(listItem, options);
      this._childrenByModelHash[listItem.getModel()] = listItem;
      this._childrenByLabelHash[listItem.getLabel()] = listItem;
    },

    setModelValue(value) {
      var item = this._childrenByModelHash[value];
      if (item) {
        value = item.getLabel(); //key -> label replacement
      }
      this.setValue(value);
      this.setFilterText(value);
    },

    getModelValue() {
      var value = this.getValue();
      var item = this._childrenByLabelHash[value];
      if (item) {
        value = item.getModel(); //label -> key replacement
      } else {
        //if ignoreListChangeSelection was true, value may not reflect current list selection
        //but e.g. only a substring of it due to search as you type filter.
        //So replace the search string with the selected == first matching item befor cellEditor closes.
        var sel = this.getChildControl("list").getSelection();
        if (sel.length) value = sel[0].getModel();
      }
      //console.log("getModelValue",value);
      return value;
    },

    // overridden
    _onTap() {
      //do not close
    },

    // overridden
    _onKeyPress(e) {
      var popup = this.getChildControl("popup");
      var iden = e.getKeyIdentifier();
      const listIdentifier = ["Up", "Down", "PageUp", "PageDown", "Escape", "Tab"];

      if (iden == "Enter" && !popup.isVisible()) {
        this.open();
        e.stop();
      } else if (iden == "Left" || iden == "Right") {
        //this.getChildControl("textfield").handleKeyPress(e);
      } else if (listIdentifier.includes(iden)) {
        //needed due to https://github.com/qooxdoo/qooxdoo/pull/10284/
        super._onKeyPress(e);
      } else {
        //this.base(arguments, e);  do nothing for keys typed into search field!
      }
    },

    // overridden
    _onListChangeSelection(e) {
      if (this.isIgnoreListChangeSelection()) return;
      super._onListChangeSelection(e);
    },

    /**
     * Puts the cursor after the end of the text
     *
     */
    // overridden
    selectAllText() {
      var text = this.getValue() || "";
      this.getChildControl("textfield").setTextSelection(text.length);
    },

    //overrridden
    destroy() {
      if (this.hideInsteadOfDestroy) {
        this.clearFilter();
        this.exclude();
      } else {
        super.destroy();
      }
    }
  }
});
