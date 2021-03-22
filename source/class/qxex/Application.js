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

      qx.Class.include(qx.ui.form.AbstractField, qxex.ui.form.MNativeContextMenu);

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

      container.addWidgetWithLabel = function(widget, additional){
        var href = '<a href="../api/#'+widget.classname+'" target="qxex_api">'+widget.classname+'</a>';
        if(additional) href+=" "+additional;
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
        container.addWidgetWithLabel(widget,"(meta)");
      }

      {
        var excludedThemes = [];
        var widget = new qxex.ui.control.ThemeSelector(excludedThemes,"icon");
        container.addWidgetWithLabel(widget,"(icon)");
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
//       {
//         var widget = new qx.ui.control.DateChooser();
//         container.addWidgetWithLabel(widget);
//       }

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
      var singleSelect2 = new qx.ui.form.SelectBox();
      container.addWidgetWithLabel(singleSelect2);

      var multiSelect2 = new qxex.ui.form.MultiSelectBox();
      container.addWidgetWithLabel(multiSelect2);

      var singleSelect = new qxex.ui.form.FilterSelectBox();
      singleSelect.setSyncListItemStyle(true);
      container.addWidgetWithLabel(singleSelect,"<br>(syncListItemStyle:true)");
      singleSelect.addListener("changeSelection",this.changeSelectionLogger,this);

      var multiSelect = new qxex.ui.form.FilterMultiSelectBox();
      container.addWidgetWithLabel(multiSelect);

      var comboBox = new qxex.ui.form.FilterComboBox();
      container.addWidgetWithLabel(comboBox);

      singleSelect.setToolTipText("original tooltip");

      var arr = [singleSelect,singleSelect2,multiSelect,multiSelect2,comboBox];
      for (var j=0; j< arr.length; j++){
      for (var i = 0; i < 200; i++) {
        var text = this.getText();
        var item = new qx.ui.form.ListItem(text+i,null,i);
        item.set({toolTipText: text+i+" tooltip"});
        item.setTextColor("red");
        arr[j].add(item);
      }
      arr[j].addListener("changeSelection",this.changeSelectionLogger,this);
      }
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

      function foo(){
        var widget = new qxex.ui.control.DateChooser();
        container.addWidgetWithLabel(widget);
        
        var label = new qx.ui.basic.Label();
        label.setRich(true);
        container.add(label);
        widget.addListener("changeValue",function(e){
          var date = e.getData();
          qxex.util.HolidayDateManager.getInstance().formatDateAsync(date,function(str){
            label.setValue(str);
          },this);
        },this);

        qxex.util.HolidayDateManager.getInstance().addListener("changeLocation",function(){
          var date = widget.getValue();
          qxex.util.HolidayDateManager.getInstance().formatDateAsync(date,function(str){
            label.setValue(str);
          },this);
        },this);

        widget.setValue(new Date("2021-01-01"));
      }foo();

      {
        var widget = new qxex.ui.form.DateField();
        container.addWidgetWithLabel(widget);
      }
      {
        var widget = new qxex.ui.form.MultiLangTextField();
        container.addWidgetWithLabel(widget);
      }

      // var button = new qx.ui.form.Button(null,"icon/16/apps/preferences-clock.png");
      // doc.add(button,{left:2,top:800-17});

      // var textfield = new qx.ui.form.TextField();
      // textfield.setWidth(200);
      // doc.add(textfield,{left:2,top:900-18});

      {
        var arr = [new qxex.ui.form.TreeSelectBox(),new qxex.ui.form.FilterTreeSelectBox()];

        for (var k=0; k< arr.length; k++){
        var tree = arr[k];
        container.addWidgetWithLabel(tree);

        for(var i=0; i<5; i++){
          var foo = new qx.ui.tree.TreeFolder(this.getText() + i);
          tree.add(foo);

          
          var parent = foo;
          var depth = 3;
          for(var j=0; j<depth; j++){
            var C = j==depth-1 ? qx.ui.tree.TreeFile : qx.ui.tree.TreeFolder;
            var bar = new C(this.getText() + " " +j);
            if(j==depth-1) bar.isSelectable = function(){return true};
            foo.add(bar);
            parent.add(bar);
            if(j%2==1) parent=bar;
          }
        }
        tree.setSelection([foo]);
        tree.addListener("changeSelection",this.changeSelectionLogger,this);
        }
      }


    },

    getText : function(){
        var abc = "abcdefghijklmnopqrstuvwxyz";
        var l = abc.length;
        var ll = 3 + Math.round(Math.random()*7);
        var str = "";
        for(var i=0; i<ll; i++){
          str += abc[Math.round(Math.random()*(l-1))];
        }
        return str;
    },


    changeSelectionLogger : function(e){
      this.debug(e.getData().map(function(item){return item.getLabel()}));
    }
  }
});
