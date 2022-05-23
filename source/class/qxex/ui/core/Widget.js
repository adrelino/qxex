qx.Class.define("qxex.ui.core.Widget", {
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics: {
    /**
     * Add a logical child to the parent
     * @param parent
     * @param child
     */
    registerLogicalChild(parent, child) {
      child.setUserData("$$parentLogical", parent);
      //we need to change the singleton's contains method latest on first time use of our logical child functionality
      qx.ui.popup.Manager.getInstance().setContainsFunction(qxex.ui.core.Widget.contains);
    },

    registerPopupOpeningButton(button, popup) {
      popup.setUserData("$$nonBlurSibling", button);
      //we need to change the singleton's contains method latest on first time use of our logical child functionality
      qx.ui.popup.Manager.getInstance().setContainsFunction(qxex.ui.core.Widget.contains);
    },

    /**
     * Whether the "parent" widget contains the "child" widget.
     *
     * @param {qx.ui.core.Widget} parent The parent widget
     * @param {qx.ui.core.Widget} child The child widget
     * @return {Boolean} Whether one of the "child"'s parents is "parent"
     */
    contains(parent, child) {
      while (child) {
        if (parent.getUserData("$$nonBlurSibling") == child) {
          return true;
        }
        var pred = child.getLayoutParent();
        var predLogical = child.getUserData("$$parentLogical");

        //go up hierarchy, logical parents taking precedence over layout ones.
        child = predLogical ? predLogical : pred;

        if (parent == child) {
          return true;
        }
      }

      return false;
    }
  }
});
