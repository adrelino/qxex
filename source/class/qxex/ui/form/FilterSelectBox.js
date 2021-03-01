/**
 * SelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterSelectBox", {
  extend : qx.ui.form.SelectBox,
  include : [
    qxex.ui.form.MSelectBoxBlur,
    qxex.ui.form.MSelectBoxFilter,
    qxex.ui.form.MSelectBoxSyncListItemStyle
  ],

  construct : function(){
    this.base(arguments);
    this.addFilterTextField();
  },

  members : {
    hideInsteadOfDestroy : false,

    //overridden: do nothing when selectBox looses focus to e.g. textfield inside popup. Closing is handled via popup Manager and autohide
    _onBlur : function(e)
    {
    },

    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "popup":
          control = this.base(arguments,id);
          this._fixPopupBlur(control);
      }

      return control || this.base(arguments, id);
    },

    //overrridden
    destroy : function(){
      var popup = this.getChildControl("popup");
      popup.exclude();
      if(this.hideInsteadOfDestroy){
        this.clearFilter();
        this.exclude();
      }else{
        this.base(arguments);
      }
    }
  }
});