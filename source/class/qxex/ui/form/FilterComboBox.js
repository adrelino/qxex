/**
 * ComboBox with search-as-you type autocomplete filter.
 */
qx.Class.define("qxex.ui.form.FilterComboBox", { //TODO: search as you type
  extend : qx.ui.form.ComboBox,

  construct : function(){
    this.base(arguments);
    this._childrenByModelHash={};
    this._childrenByLabelHash={};
  },

  members : {
    _childrenByModelHash : null,
    _childrenByLabelHash : null,

    hideInsteadOfDestroy : false,

    // overridden
    focus : function()
    {
      this.getChildControl("textfield").getFocusElement().focus();
    },

    //overridden from http://www.qooxdoo.org/current/apiviewer/#qx.ui.form.AbstractSelectBox
    add : function(listItem, options){
      this.base(arguments,listItem, options);
      this._childrenByModelHash[listItem.getModel()]=listItem;
      this._childrenByLabelHash[listItem.getLabel()]=listItem;
    },

    setModelValue : function(value)
    {
      console.log("setModelValue",value);
      var item = this._childrenByModelHash[value];
      if(item){
        value = item.getLabel(); //key -> label replacement
      }
      this.setValue(value);
    },

    getModelValue : function()
    {
      var value = this.getValue();
      var item = this._childrenByLabelHash[value];
      if(item){
        value = item.getModel(); //label -> key replacement
      }
      //console.log("getModelValue",value);
      return value;
    },

    //overrridden
    destroy : function(){
      if(this.hideInsteadOfDestroy){
        this.exclude();
      }else{
        this.base(arguments);
      }
    }
  }
});