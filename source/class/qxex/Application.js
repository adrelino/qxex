/* ************************************************************************

   Copyright:

   License: EPL

   Authors: Adrian Haarbach

************************************************************************ */

/**
 * This is the main application class of your custom application "qooxdoo-extensions"
 *
 * @asset(qxex/*)
 */
qx.Class.define("qxex.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Document is the application root
      var doc = this.getRoot();

      var container = new qx.ui.container.Composite(new qx.ui.layout.VBox(2));
      doc.add(container);

      container.addWidgetWithLabel = function(widget){
        container.add(new qx.ui.basic.Label(widget.classname));
        container.add(widget);
      }

      var tristateBox = new qxex.ui.form.TristateCheckBox("toggle me");
      container.addWidgetWithLabel(tristateBox);

      var singleSelect = new qxex.ui.form.FilterSelectBox();
      container.addWidgetWithLabel(singleSelect);

      var multiSelect = new qxex.ui.form.FilterMultiSelectBox();
      container.addWidgetWithLabel(multiSelect);

      for (var i = 0; i < 6; i++) {
        singleSelect.add(new qx.ui.form.ListItem("Item "+i,null,i));
        multiSelect.add(new qx.ui.form.ListItem("Item "+i,null,i));
      };

      multiSelect.setSelectionByModelArr([2,3]);
    }
  }
});
