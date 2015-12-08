/**
 * A SelectBox that allows for multiple selection.
 * Modeled after the jQuery UI MultiSelect Widget: http://www.erichynds.com/examples/jquery-ui-multiselect-widget/demos/
 *
 * @asset(qx/icon/Oxygen/16/actions/dialog-apply.png)
 * @asset(qx/icon/Oxygen/32/actions/dialog-apply.png)
 * @asset(qx/icon/Oxygen/16/actions/edit-delete.png)
 * @asset(qx/icon/Oxygen/32/actions/edit-delete.png)
 */
qx.Class.define("qxex.ui.form.MultiSelectBox",
{
  extend : qx.ui.form.AbstractSelectBox,
  implement : [
     qx.ui.core.IMultiSelection,
     qx.ui.form.IModelSelection
  ],
  include : [
  //qx.ui.core.MMultiSelectionHandling, 
  qx.ui.form.MModelSelection
  ],

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    this._createChildControl("atom");
    this._createChildControl("spacer");
    this._createChildControl("arrow");

    this.addListener("mouseover", this._onPointerOver, this);
    this.addListener("mouseout", this._onPointerOut, this);
    this.addListener("tap", this._onTap, this); //was click

    this.addListener("keyinput", this._onKeyInput, this);
  
    //ADDED
    var list = this.getChildrenContainer(); //same as this.getChildControl("list"); , is in AbstractSelectBox
    list.setQuickSelection(false);
    list.setSelectionMode("multi");


    //ALL AND NONE BUTTONS
    var buttonContainer=new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
    
    var labelAll="<b style='color:green;'>"+this.trc("Label","All")+"<b>";
    this.allBtn = new qx.ui.form.Button(labelAll,"qx/icon/Oxygen/16/actions/dialog-apply.png").set({
        focusable: false, rich: true, padding : 2, margin : 0
    });
    this.allBtn.addListener("click", function(e){
      this.setSelection(this.getSelectables());
    },this);
    buttonContainer.add(this.allBtn,{flex : 1});
    
    var labelNone="<b style='color:red;'>"+this.trc("Label","None")+"<b>";
    this.noneBtn = new qx.ui.form.Button(labelNone,"qx/icon/Oxygen/16/actions/edit-delete.png").set({
        focusable: false, rich: true, padding : 2, margin : 0
    });
    this.noneBtn.addListener("click", function(e){
      this.setSelection(null);
    },this);
    buttonContainer.add(this.noneBtn,{flex : 1});
    
    //POPUP window config
    var popup = this.getChildControl("popup");
    popup.setFocusable(false);
    popup.setKeepFocus(true); //so that anything inside the popup (also the buttons) never gets the focus, is needed because when the selectbox looses focus it is closed immediately
    //popup.setAutoHide(true); //not needed, is handled by loosing focus and _onBlur
    popup.addBefore(buttonContainer,list);

//     popup.removeListener("tap", this.close, this);  //to undo effect of closing after single click from AbstractSelectBox._createChildControlImpl
//     popup.removeListener("close", this.close, this);  //to undo effect of closing after single click from AbstractSelectBox._createChildControlImpl
//https://github.com/qooxdoo/qooxdoo/blob/branch_5_0_x/framework/source/class/qx/ui/form/AbstractSelectBox.js#L157
    list.getChildControl("pane").removeListener("tap", this.close, this);  //needed since qooxdoo 5.0.1: they changed the container structure

    //STATUSLABEL
    this.statusLabel=new qx.ui.basic.Label(
        //this.trc("label","Shift or Crtl for multi select")
        this.trc("statusLine", "Use Shift-click or Crtl-click for multiple selection")
       ).set({rich : true, wrap:true, allowGrowX: true, width: 80, backgroundColor: "#DFDFDF"}); //rich for multiline
    popup.add(this.statusLabel, {flex:1});
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
    },
    
    //Icon to display when multiple items are selected but have different icons
    someIcon :
    {
      init : null
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
        case "spacer":
          control = new qx.ui.core.Spacer();
          this._add(control, {flex: 1});
          break;

        case "atom":
          control = new qx.ui.basic.Atom(" ");
          control.setCenter(false);
          control.setAnonymous(true);
          control.setRich(true);

          this._add(control, {flex:1});
          break;

        case "arrow":
          control = new qx.ui.basic.Image();
          control.setAnonymous(true);

          this._add(control);
          break;
      }

      return control || this.base(arguments, id);
    },

    // overridden
    /**
     * @lint ignoreReferenceField(_forwardStates)
     */
    // _forwardStates : {
    //   focused : true
    // },


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
      return this.getChildrenContainer().resetSelection();
      this.update();
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
      var length=listItems.length;
      var items=this.getSelectables();
      
      var hasIcons=items.some(function(listItem){
          return listItem.getIcon();
      });
      
      var total=items.length;

      var label = length+"/"+total;
      if (length != 1) {
        label = this.trc("Label", "%1/%2 chosen", length, total);
      }
      
      if(length==0){
        label = "<b style='color:red;'>"+label+"<b>";
        this.setToolTipText(this.trc("Tooltip","Please select at least one item"));
        if(hasIcons) atom.setIcon("qx/icon/Oxygen/32/actions/edit-delete.png");
      }else if(length==1){
        label+=" : "+this.__prettyPrintLabel(listItems[0]);
        this.setToolTipText(this.trc("Tooltip","You can select multiple items"));
         if(hasIcons) atom.setIcon(listItems[0].getIcon());
      }else{
        var labels = listItems.map(function(listItem){
          return this.__prettyPrintLabel(listItem);
        },this);
        this.setToolTipText(labels.join(","));
        
        if(hasIcons){
            var icon=listItems[0].getIcon();
            
            var allHaveSameIcon = listItems.every(function(listItem){
                return icon==listItem.getIcon();
            });
            
            if(!allHaveSameIcon){
               if(this.getSomeIcon()) icon=this.getSomeIcon(); //icon that displays that items have different icons
               else{
                 listItems.forEach(function(listItem){
                      var otherIcon = listItem.getIcon();
                      if(otherIcon>icon) icon=otherIcon; //lexicographic higher icon is selected, schoses online over offline for buddy icons, so if at least one is online, green icon is displayed
                    },this);
               }
            }
                
            atom.setIcon(icon); //TODO: which icon to display when we have selected multiple (not all) items
        }
      }
      
      if(length==total){ //all selected
          label = "<b style='color:green;'>"+label+"<b>";
          //if(length > 1 && hasIcons) atom.setIcon("qx/icon/Oxygen/32/actions/dialog-apply.png"); //otherwise we dont see the only icon if total is just one
      }

      atom.setLabel(label || "");
      
      
     // this.statusLabel.setWidth(list.getWidth());
    },


    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */


    /**
     * Listener method for "mouseover" event
     * <ul>
     * <li>Adds state "hovered"</li>
     * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
     * </ul>
     *
     * @param e {Event} Mouse event
     */
    _onPointerOver : function(e)
    {
      if (!this.isEnabled() || e.getTarget() !== this) {
        return;
      }

      if (this.hasState("abandoned"))
      {
        this.removeState("abandoned");
        this.addState("pressed");
      }

      this.addState("hovered");
    },

    /**
     * Listener method for "mouseout" event
     * <ul>
     * <li>Removes "hovered" state</li>
     * <li>Adds "abandoned" and removes "pressed" state (if "pressed" state is set)</li>
     * </ul>
     *
     * @param e {Event} Mouse event
     */
    _onPointerOut : function(e)
    {
      if (!this.isEnabled() || e.getTarget() !== this) {
        return;
      }

      this.removeState("hovered");

      if (this.hasState("pressed"))
      {
        this.removeState("pressed");
        this.addState("abandoned");
      }
    },

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

    _onBlur : function(e){
      //TODO: focus handling (especially when including into a table)
      // var hand = qx.ui.core.FocusHandler.getInstance()
      // if(hand.isFocused(this.allBtn) || hand.isFocused(this.noneBtn)) return;
      this.close();

      this.fireDataEvent("changeSelection", this.getSelection());
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
    },

    // overridden
    _onPopupChangeVisibility : function(e)
    {
      this.base(arguments, e);

      // Synchronize the current selection to the list selection
      // when the popup is closed. The list selection may be invalid
      // because of the quick selection handling which is not
      // directly applied to the selectbox
      var popup = this.getChildControl("popup");
      if (!popup.isVisible())
      {
        /*var list = this.getChildControl("list");

        // check if the list has any children before selecting
        if (list.hasChildren()) {
          list.setSelection(this.getSelection());
        }*/
      } else {
        // ensure that the list is never biger that the max list height and
        // the available space in the viewport
        var distance = popup.getLayoutLocation(this);
        var viewPortHeight = qx.bom.Viewport.getHeight();
        // distance to the bottom and top borders of the viewport
        var toTop = distance.top;
        var toBottom = viewPortHeight - distance.bottom;
        var availableHeigth = toTop > toBottom ? toTop : toBottom;

        var maxListHeight = this.getMaxListHeight();
        var list = this.getChildControl("list")
        if (maxListHeight == null || maxListHeight > availableHeigth) {
          list.setMaxHeight(availableHeigth);
        } else if (maxListHeight < availableHeigth) {
          list.setMaxHeight(maxListHeight);
        }
      }
    }
  }
});