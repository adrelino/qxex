qx.Class.define("qxex.ui.tree.Tree",
{
  extend : qx.ui.tree.Tree,
  members :
  {
    SELECTION_MANAGER : qxex.ui.tree.SelectionManager,

    //copied from qx.ui.form.List
    handleKeyPress : function(e){
      if (!this._onKeyPress(e)) {
        this._getManager().handleKeyPress(e);
      }
    },


    _onKeyPress : function(e)
    {
      switch(e.getKeyIdentifier())
      {
        case "Escape":
          this.fireEvent("close");
          return;

        case "Enter":
          var item = this._getLeadItem();
          if(!item) break;
          this.fireEvent("close");
          return;
      }
      return this.base(arguments,e);
    }
  }
});