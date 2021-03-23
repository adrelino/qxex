/**
 * A SelectBox that allows for multiple selection.
 * Modeled after the jQuery UI MultiSelect Widget: http://www.erichynds.com/examples/jquery-ui-multiselect-widget/demos/
 *
 * @asset(qx/decoration/Modern/form/checkbox-checked-focused.png)
 * @asset(qx/decoration/Modern/form/checkbox-focused-invalid.png)
 */
qx.Class.define("qxex.ui.form.MultiSelectBox",
{
  extend : qxex.ui.form.AbstractSelectBoxSimpler,
  implement : [
     qx.ui.core.IMultiSelection,
     qx.ui.form.IModelSelection
  ],
  include : [
    //qx.ui.core.MMultiSelectionHandling, 
    qx.ui.form.MModelSelection,
    qxex.ui.form.MSelectBoxSyncButtonStyle
  ],

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    this.addListener("keyinput", this._onKeyInput, this);
 
    //ALL AND NONE BUTTONS
    this.__buttonContainer=new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
    
    var labelAll="<b style='color:green;'>"+this.trc("Label","All")+"<b>";
    this.allBtn = new qx.ui.form.Button(labelAll,"decoration/form/checkbox-checked-focused.png").set({
        focusable: false, rich: true, padding : 2, margin : 0
    });
    this.allBtn.addListener("execute", function(e){
      this.setSelection(this.getSelectables());
    },this);
    this.__buttonContainer.add(this.allBtn,{flex : 1});
    
    var labelNone="<b style='color:red;'>"+this.trc("Label","None")+"<b>";
    this.noneBtn = new qx.ui.form.Button(labelNone,"decoration/form/checkbox-focused-invalid.png").set({
        focusable: false, rich: true, padding : 2, margin : 0
    });
    this.noneBtn.addListener("execute", function(e){
      this.setSelection(null);
    },this);
    this.__buttonContainer.add(this.noneBtn,{flex : 1});

    //STATUSLABEL
    this.__statusLabel=new qx.ui.basic.Label(
        //this.trc("label","Shift or Crtl for multi select")
        this.trc("statusLine", "Use Shift-click or Crtl-click for multiple selection")
       ).set({rich : true, wrap:true, allowGrowX: true, width: 80, backgroundColor: "#DFDFDF"}); //rich for multiline
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */


  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "selectbox"
    }
  },

  //ISingleSelection events
  events :
  {
    changeSelection : "qx.event.type.Data"
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */


  members :
  {  

    __buttonContainer : null,
    __statusLabel : null,
    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "list":
          control = this.base(arguments, id);
          control.setQuickSelection(false);
          control.setSelectionMode("multi");
          control.getChildControl("pane").removeListener("tap", this.close, this);  //needed since qooxdoo 5.0.1: they changed the container structure
          break;

        case "popup":
          //POPUP window config
          control = this.base(arguments, id);
          control.addBefore(this.__buttonContainer,this.getChildControl("list"));
          control.add(this.__statusLabel, {flex:1});
      }

      return control || this.base(arguments, id);
    },

    /*
    ---------------------------------------------------------------------------
      HELPER METHODS FOR SELECTION API
    ---------------------------------------------------------------------------
    */

    //ISingleSelection Methods

    getSelectables : function() {
      return this.getChildrenContainer().getChildren();
    },

    getSelection : function(){
      return this.getChildrenContainer().getSelection();
    },
    
    
    getSelectionAsModelArr: function() {
      return this.getSelection().map(function(listItem){
          return listItem.getModel();
      });
    },

    isSelected : function(widget){
      return this.getChildrenContainer().isSelected(widget);
    },

    isSelectionEmpty : function(){
      return this.getChildrenContainer().isSelectionEmpty();
    },

    resetSelection : function(){
      var ret =  this.getChildrenContainer().resetSelection();
      this.update();
      return ret;
    },

    setSelection : function(listItems)
    {
      var list = this.getChildrenContainer();

      if (list.getSelection() != listItems) { //TODO equals instead of == ??
        if(listItems) {
          list.setSelection(listItems);
        } else {
          list.resetSelection();
        }
        
        this.update();
      }
    },
    
    /**
     * Adrians Convenience Helper Method
     * @param modelArr {String[]}
     */
    setSelectionByModelArr: function(modelArr) {
      //return null !!??
      //var list = this.getChildrenContainer();
      //return list.findItem(loginName); // searches getLabel()

      var selection=[];

      var listItems = this.getChildren();
      for (var i=0, l=listItems.length; i<l; i++) {
        var listItem = listItems[i];
        var curr = listItem.getModel();
        if (modelArr.indexOf(curr) >= 0)
          selection.push(listItem);
      }
      this.setSelection(selection);
    },

    //IMultiSelection Methods
    addToSelection: function(item){
      return this.getChildrenContainer().addToSelection(item);
    },

    removeFromSelection: function(item){
      return this.getChildrenContainer().removeFromSelection(item);
    },

    selectAll: function(){
      return this.getChildrenContainer().selectAll();
    },
    

    __prettyPrintLabel : function(listItem){
        var label = listItem ? listItem.getLabel() : "";
        var format = this.getFormat();
        if (format != null) {
          label = format.call(this, listItem);
        }

        // check for translation
        if (label && label.translate) {
          label = label.translate();
        }

        return label;
    },

    /**
     * Sets the label and icon inside the list to match the selected ListItem.
     * needs to be called if items are added after the selection was set, so that the total of items is correctly displayed in the label
     */
    update : function()
    {
      var list=this.getChildrenContainer();
      var atom = this.getChildControl("atom");

      var listItems = list.getSelection();
      var items=this.getSelectables();

      var hasIcons=items.some(function(listItem){
        return listItem.getIcon();
      });

      var total=items.length;
      var iconFun = function(listItem){
        return listItem.getIcon();
      };

      this.synchronizeButtonWithSelection(atom, listItems, total, this.__prettyPrintLabel.bind(this), hasIcons, iconFun);
    },


    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    /**
     * Toggles the popup's visibility.
     *
     * @param e {qx.event.type.Mouse} Mouse event
     */
    _onTap : function(e) {
      var isListOpen = this.getChildControl("popup").isVisible();
      if (isListOpen) {
         //when tapping on multiselectbox to close it again, we want an event fired, even though it doesnt loose focus
         this.fireDataEvent("changeSelection", this.getSelection());
      }
      this.toggle();
      //closing is done by the popup.setAutoHide(true); property whenever we click anywhere outside the popup

    },

    /**
     * Forwards key event to list widget.
     *
     * @param e {qx.event.type.KeyInput} Key event
     */
    _onKeyInput : function(e)
    {
      // clone the event and re-calibrate the event
      var clone = e.clone();
      clone.setTarget(this._list);
      clone.setBubbles(false);

      // forward it to the list
      this.getChildControl("list").dispatchEvent(clone);
    },

    // overridden
    _onListPointerDown : function(e)
    {
      //dont do anything, unlike in singleSelectBox, where we close the popup immediately
    },

    // overridden
    _onListChangeSelection : function(e)
    {
      var current = e.getData();
      var old = e.getOldData();

      // Remove old listeners for icon and label changes.
      if (old && old.length > 0)
      {
        old[0].removeListener("changeIcon", this.update, this);
        old[0].removeListener("changeLabel", this.update, this);
      }

      if (current.length > 0){
        // Add listeners for icon and label changes
        current[0].addListener("changeIcon", this.update, this);
        current[0].addListener("changeLabel", this.update, this);
      }

      this.update();
    }
  }
});