/**
 * SelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterSelectBox", {
  extend : qx.ui.form.SelectBox,
  include : [qxex.ui.form.MSelectBoxFilter,qxex.ui.form.MSelectBoxSyncListItemStyle],

  construct : function(){
    this.base(arguments);
    this.addFilterTextField();
    var control = this.getChildControl("popup");
    qxex.ui.core.Widget.registerLogicalChild(control,this);//we treat this=selectBox as "child" of popup. This avoids closing and immediate reopening of popup on click on this=selectBox
    control.setAutoHide(true);
  },

  members : {
    hideInsteadOfDestroy : false,

    //overridden: do nothing when selectBox looses focus to e.g. textfield inside popup. Closing is handled via popup Manager and autohide
    _onBlur : function(e)
    {
    },

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