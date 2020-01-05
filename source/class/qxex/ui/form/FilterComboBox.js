/**
 * ComboBox with search-as-you type autocomplete filter.
 */
qx.Class.define("qxex.ui.form.FilterComboBox", { //TODO: search as you type
  extend : qx.ui.form.ComboBox,

  construct : function(){
    this.base(arguments);
  },

  members : {
    hideInsteadOfDestroy : false,

    // overridden
    focus : function()
    {
      this.getChildControl("textfield").getFocusElement().focus();
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