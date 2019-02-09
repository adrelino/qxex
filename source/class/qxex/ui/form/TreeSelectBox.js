/**
 * SelectBox with a tree of items to select when tapping on it.
 *
 * @childControl list {qx.ui.tree.Tree} tree component of the selectbox
 * @childControl popup {qx.ui.popup.Popup} popup which shows the list
 */
qx.Class.define("qxex.ui.form.TreeSelectBox",
{
  extend : qxex.ui.form.AbstractSelectBoxSimpler,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */


  construct : function()
  {
    this.base(arguments);

//     this.addListener("keyinput", this._onKeyInput, this);
//     this.addListener("changeSelection", this.__onChangeSelection, this);

    this.removeListener("keydown", this._onKeyPress);
    this.addListener("keydown", function(e){
      // clone the event and re-calibrate the event
      var clone = e.clone();
      clone.setTarget(this.getChildControl("list"));
      clone.setBubbles(false);

      // forward it to the list
      this.getChildControl("list").dispatchEvent(clone);
    });

    var popup = this.getChildControl("popup");
    popup.setFocusable(false); //for blur towork
    popup.setKeepFocus(true); 
  },

  events: {
    "changeSelection" : "qx.event.type.Data"
  },

  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "selectbox"
    },

    selection :
    {
      init : [],
      apply : "_applySelection",
      event : "changeSelection"
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */


  members :
  {
    _applySelection: function(sel){
//       this.getChildControl("list").setSelection(sel);
      
      var listItem = sel[0]; //e.getData()[0];

      var list = this.getChildControl("list");
      
      if (list.getSelection()[0] != listItem) {
        if(listItem) {
          list.setSelection([listItem]);
        } else {
          list.resetSelection();
        }
      }

      this.__updateIcon();
      this.__updateLabel();
    },

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
        case "root" :
          control = new qx.ui.tree.TreeFolder("Root").set({
          open : true
        });
        break;

        case "list":
          control = new qx.ui.tree.Tree().set({
            focusable: false,
            keepFocus: true,
            height: null,
            width: null,
            maxHeight: this.getMaxListHeight()
//             selectionMode: "one",
//             quickSelection: true
          });

          control.setRoot(this.getChildControl("root"));
//           control.setHideRoot(true);

          control.addListener("changeSelection", this._onListChangeSelection, this);
          control.addListener("pointerdown", this._onListPointerDown, this);
//           control.getChildControl("pane").addListener("tap", this.close, this);
          break;
      }

      return control || this.base(arguments, id);
    },

//  * The including class must implement the method <code>getChildrenContainer</code>,
//  * which has to return the widget, to which the child widgets should be added.
//  */
// qx.Mixin.define("qx.ui.core.MRemoteChildrenHandling",
    getChildrenContainer : function(){
      return this.getChildControl("list").getChildrenContainer();
    },

    add : function(item){
      return this.getChildControl("root").add(item);
    },

    /**
     * Return the formatted label text from the <code>ListItem</code>.
     * The formatter removes all HTML tags and converts all HTML entities
     * to string characters when the rich property is <code>true</code>.
     *
     * @param item {ListItem} The list item to format.
     * @return {String} The formatted text.
     */
    _defaultFormat : function(item)
    {
      var valueLabel = item ? item.getLabel() : "";
//       var rich = item ? item.getRich() : false;

//       if (rich) {
//         valueLabel = valueLabel.replace(/<[^>]+?>/g, "");
//         valueLabel = qx.bom.String.unescape(valueLabel);
//       }

      return valueLabel;
    },


    /*
    ---------------------------------------------------------------------------
      HELPER METHODS FOR SELECTION API
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the list items for the selection.
     *
     * @return {qx.ui.form.ListItem[]} List itmes to select.
     */
    _getItems : function() {
      return this.getChildControl("list").getItems(true);
    },

    /**
     * Returns if the selection could be empty or not.
     *
     * @return {Boolean} <code>true</code> If selection could be empty,
     *    <code>false</code> otherwise.
     */
    _isAllowEmptySelection: function() {
      return true;
    },

//     add : function(treeItem){
//       this.getChildControl("root").add(treeItem);
//     },

    /**
     * Event handler for <code>changeSelection</code>.
     *
     * @param e {qx.event.type.Data} Data event.
     */
//     __onChangeSelection : function(e)
//     {
//       var listItem = e.getData()[0];

//       var list = this.getChildControl("list");
//       if (list.getSelection()[0] != listItem) {
//         if(listItem) {
//           list.setSelection([listItem]);
//         } else {
//           list.resetSelection();
//         }
//       }

//       this.__updateIcon();
//       this.__updateLabel();
//     },


    /**
     * Sets the icon inside the list to match the selected ListItem.
     */
    __updateIcon : function()
    {
      var listItem = this.getChildControl("list").getSelection()[0];
      var atom = this.getChildControl("atom");
      var icon = listItem ? listItem.getIcon() : "";
      icon == null ? atom.resetIcon() : atom.setIcon(icon);
    },

    /**
     * Sets the label inside the list to match the selected ListItem.
     */
    __updateLabel : function()
    {
      var listItem = this.getChildControl("list").getSelection()[0];
      var atom = this.getChildControl("atom");
      var label = listItem ? listItem.getLabel() : "";
      var format = this.getFormat();
      if (format != null) {
        label = format.call(this, listItem);
      }

      // check for translation
      if (label && label.translate) {
        label = label.translate();
      }
      label == null ? atom.resetLabel() : atom.setLabel(label);
    },

    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    // overridden
    _onListPointerDown : function(e)
    {
//       this.close();
    },

    // overridden
    _onListChangeSelection : function(e)
    {
      var current = e.getData();
      var old = e.getOldData();

      // Remove old listeners for icon and label changes.
      if (old && old.length > 0)
      {
        old[0].removeListener("changeIcon", this.__updateIcon, this);
        old[0].removeListener("changeLabel", this.__updateLabel, this);
      }


      if (current.length > 0)
      {
        // Ignore quick context (e.g. pointerover)
        // and configure the new value when closing the popup afterwards
//         var popup = this.getChildControl("popup");
//         var list = this.getChildControl("list");
//         var context = list.getSelectionContext();

//         if (popup.isVisible() && (context == "quick" || context == "key"))
//         {
//           this.__preSelectedItem = current[0];
//         }
//         else
//         {
          this.setSelection([current[0]]);
//           this.__preSelectedItem = null;
//         }

        // Add listeners for icon and label changes
        current[0].addListener("changeIcon", this.__updateIcon, this);
        current[0].addListener("changeLabel", this.__updateLabel, this);
      }
      else
      {
        this.resetSelection();
      }
    }
  }
});