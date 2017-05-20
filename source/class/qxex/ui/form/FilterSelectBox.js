/**
 * SelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterSelectBox", {
  extend : qx.ui.form.SelectBox,
  include : [qxex.ui.form.MSelectBoxFilter,qxex.ui.form.MSelectBoxSyncListItemStyle],

  members : {
    hideInsteadOfDestroy : false,

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

    //overrridden
    destroy : function(){
      if(this.hideInsteadOfDestroy){
        this.clearFilter();
        this.exclude();
      }else{
        this.base(arguments);
      }
    }
  }
});