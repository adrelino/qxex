/**
 * MultiSelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterMultiSelectBox", {
  extend : qxex.ui.form.MultiSelectBox,
  include : qxex.ui.form.MSelectBoxFilter,

  members : {
    // overridden
    _onKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();
      if(iden == "Space"){
        e.preventDefault(); //otherwise SelectBox.js _onKeypress calls this.toggle();
      }else{
        this.base(arguments, e);
      }
    }
  }
});