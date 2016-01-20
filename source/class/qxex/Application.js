/* ************************************************************************

   Copyright:

   License: EPL

   Authors: Adrian Haarbach

************************************************************************ */

/**
 * This is the main application class of your custom application "qooxdoo-extensions"
 *
 * @asset(qx/icon/${qx.icontheme}/16/apps/preferences-clock.png)
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

      //mix our own theme additions into all available themes
      qxex.util.ThemeManager.mergeTheme(qxex.theme.Appearance);


      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Document is the application root
      var doc = this.getRoot();

      var container = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
      container.setMargin(10);
      doc.add(container);

      container.addWidgetWithLabel = function(widget){
        var href = '<a href="../api/#'+widget.classname+'" target="qxex_api">'+widget.classname+'</a>';
        var label = new qx.ui.basic.Label(href).set({rich:true});

        container.add(label);
        container.add(widget);
      }

      ////////////
      //control

      {
        var widget = new qxex.ui.control.LanguageSelector();
        container.addWidgetWithLabel(widget);
      }

      {
        var excludedThemes = ["qx.theme.Indigo"];
        var widget = new qxex.ui.control.ThemeSelector(excludedThemes);
        // widget.addListener("changeValue",function(e){
        //   textfield.setValue(e.getData());
        //   textfield.focus();
        //   textfield.selectAllText();
        //   document.execCommand('copy');
        // },this);
        container.addWidgetWithLabel(widget);
      }

      {
        var that = this;
        var closure = function(){ //to catch widget
          var widget = new qxex.ui.control.TimeChooser();
          container.addWidgetWithLabel(widget);
          widget.addListener("execute",function(e){
            this.warn(widget.getValue());
          },that);
          widget.addListener("changeValue",function(e){
            this.info(e.getData());
          },that);
        }();
      }

      //only to illustrate effects of changing locale
      {
        var widget = new qx.ui.control.DateChooser();
        container.addWidgetWithLabel(widget);
      }

      ////////////
      //form
      {
        var tristateBox = new qxex.ui.form.TristateCheckBox();
        tristateBox.addListener("changeValue",function(e){
          var value = e.getData();
          tristateBox.setLabel(value+"");
        });
        tristateBox.setValue(true);

        container.addWidgetWithLabel(tristateBox);
      }

      {
      var singleSelect = new qxex.ui.form.FilterSelectBox();
      container.addWidgetWithLabel(singleSelect);

      var multiSelect = new qxex.ui.form.FilterMultiSelectBox();
      container.addWidgetWithLabel(multiSelect);

      for (var i = 0; i < 6; i++) {
        if (i<4) singleSelect.add(new qx.ui.form.ListItem("Item "+i,null,i));
        multiSelect.add(new qx.ui.form.ListItem("Item "+i,null,i));
      };
      multiSelect.setSelectionByModelArr([2,3]);
      singleSelect.MIN_LIST_ITEMS_TO_SHOW_FILTER=2;
      }


      {
        var widget = new qxex.ui.form.KnobIconSlider();
        widget.setKnobIcon("icon/16/apps/preferences-clock.png");
        widget.setKnobSize(14);
        container.addWidgetWithLabel(widget);
      }


      {
        var widget = new qxex.ui.form.TimeField();
        container.addWidgetWithLabel(widget);
      }

       {
        var widget = new qxex.ui.form.DateField();
        container.addWidgetWithLabel(widget);
      }

      // var button = new qx.ui.form.Button(null,"icon/16/apps/preferences-clock.png");
      // doc.add(button,{left:2,top:800-17});

      // var textfield = new qx.ui.form.TextField();
      // textfield.setWidth(200);
      // doc.add(textfield,{left:2,top:900-18});
    }
  }
});
