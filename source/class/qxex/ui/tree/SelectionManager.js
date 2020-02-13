qx.Class.define("qxex.ui.tree.SelectionManager",
{
  extend : qx.ui.tree.selection.SelectionManager,

  members :
  {
    // overridden
    _isSelectable : function(item) {
      return this.base(arguments,item) && (item.isSelectable ? item.isSelectable() : item instanceof qx.ui.tree.TreeFile);
    }
  }
});