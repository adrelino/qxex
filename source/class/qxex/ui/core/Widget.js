qx.Class.define("qxex.ui.core.Widget",
{

  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Add a logical child to the parent
     */
    registerLogicalChild : function(parent, child)
    {
      child.setUserData("$$parentLogical",parent);
      //we need to change the singleton's contains method latest on first time use of our logical child functionality
      qx.ui.popup.Manager.getInstance().setContainsFunction(qxex.ui.core.Widget.contains);
    },

    /**
     * Whether the "parent" widget contains the "child" widget.
     *
     * @param parent {qx.ui.core.Widget} The parent widget
     * @param child {qx.ui.core.Widget} The child widget
     * @return {Boolean} Whether one of the "child"'s parents is "parent"
     */
    contains : function(parent, child)
    {
      while (child)
      {
        var pred = child.getLayoutParent();
        var predLogical = child.getUserData("$$parentLogical");

        //go up hierarchy, logical parents taking precedence over layout ones.
        child = predLogical ? predLogical : pred

        if (parent == child) {
          return true;
        }
      }

      return false;
    }
  }
});