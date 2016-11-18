/**
 * MultiSelectBox with filter.
 * 
 * overrides add method and introduces getChildByModel method 
 * that allows to retreive a child in constant time. TODO: move to mixin
 */
qx.Class.define("qxex.ui.form.FilterMultiSelectBox", {
  extend : qxex.ui.form.MultiSelectBox,
  include : qxex.ui.form.MSelectBoxFilter,

  members : {
    _childrenByModelHash : null,

    // overridden
    _onKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();
      if(iden == "Space"){
        e.preventDefault(); //otherwise SelectBox.js _onKeypress calls this.toggle();
      }else{
        this.base(arguments, e);
      }
    },

    //overridden from http://www.qooxdoo.org/current/apiviewer/#qx.ui.form.AbstractSelectBox
    add : function(listItem, options){
      this.base(arguments,listItem, options);
      if(!this._childrenByModelHash) this._childrenByModelHash={};
      this._childrenByModelHash[listItem.getModel()]=listItem;
    },

    /**
     * Alternative to getChildren() and linear search if we have a model for the listItem
     */
    getChildByModel(model){
      return this._childrenByModelHash ? this._childrenByModelHash[model] : null;
    }
  }
});