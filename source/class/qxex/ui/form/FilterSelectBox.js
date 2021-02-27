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
    qxex.ui.core.Widget.registerLogicalChild(this, control);//only in this way it works for qxex.form.DateField. Both cannot be set, deadlock
    //qxex.ui.core.Widget.registerLogicalChild(control,this);//we treat this=selectBox as "child" of popup. This avoids closing and immediate reopening of popup on click on this=selectBox
    control.setAutoHide(true);
    this.addListener("disappear",this.close);
  },

  members : {
    hideInsteadOfDestroy : false,

    //overridden: do nothing when selectBox looses focus to e.g. textfield inside popup. Closing is handled via popup Manager and autohide
    _onBlur : function(e)
    {
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