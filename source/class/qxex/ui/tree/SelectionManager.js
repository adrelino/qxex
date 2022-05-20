qx.Class.define("qxex.ui.tree.SelectionManager", {
  extend: qx.ui.tree.selection.SelectionManager,

  members: {
    // overridden
    _isSelectable(item) {
      return super._isSelectable(item) && (item.isSelectable ? item.isSelectable() : item instanceof qx.ui.tree.TreeFile);
    }
  }
});
