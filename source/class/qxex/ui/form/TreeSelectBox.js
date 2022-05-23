/**
 * SelectBox with a tree of items to select when tapping on it.
 *
 * @childControl list {qx.ui.tree.Tree} tree component of the selectbox
 * @childControl popup {qx.ui.popup.Popup} popup which shows the list
 */
qx.Class.define("qxex.ui.form.TreeSelectBox", {
  extend: qxex.ui.form.AbstractSelectBoxSimpler,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct() {
    super();

    //     this.addListener("keyinput", this._onKeyInput, this);
    //     this.addListener("changeSelection", this.__onChangeSelection, this);

    //this.removeListener("keydown", this._onKeyPress);
    this.addListener("keyinput", function (e) {
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
    changeSelection: "qx.event.type.Data"
  },

  properties: {
    // overridden
    appearance: {
      refine: true,
      init: "selectbox"
    },

    selection: {
      init: [],
      apply: "_applySelection",
      event: "changeSelection"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    _applySelection(sel) {
      //       this.getChildControl("list").setSelection(sel);

      var listItem = sel[0]; //e.getData()[0];

      var list = this.getChildControl("list");

      if (list.getSelection()[0] != listItem) {
        if (listItem) {
          list.setSelection([listItem]);
        } else {
          list.resetSelection();
        }
      }

      this.__updateIcon();
      this.__updateLabel();
    },

    // overridden
    _onKeyPress(e) {
      var iden = e.getKeyIdentifier();
      if (iden == "Enter" || iden == "Space") {
        this.toggle();
      } else {
        super._onKeyPress(e);
      }
    },

    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createChildControlImpl(id, hash) {
      var control;

      switch (id) {
        case "root":
          control = new qx.ui.tree.TreeFolder("Root").set({
            open: true
          });

          break;

        case "list":
          control = new qxex.ui.tree.Tree().set({
            focusable: false,
            keepFocus: true,
            height: null,
            width: null,
            maxHeight: this.getMaxListHeight(),
            openMode: "tap",
            rootOpenClose: true
            //             selectionMode: "one",
            //             quickSelection: true
          });

          control.setRoot(this.getChildControl("root"));
          control.setHideRoot(true);

          control.addListener("changeSelection", this._onListChangeSelection, this);
          control.addListener("pointerdown", this._onListPointerDown, this);
          /*control.addListener("close",function(){
            this.close();
          },this);*/
          //           control.getChildControl("pane").addListener("tap", this.close, this);
          break;
      }

      return control || super._createChildControlImpl(id);
    },

    //  * The including class must implement the method <code>getChildrenContainer</code>,
    //  * which has to return the widget, to which the child widgets should be added.
    //  */
    // qx.Mixin.define("qx.ui.core.MRemoteChildrenHandling",
    getChildrenContainer() {
      return this.getChildControl("root");
    },

    add(item) {
      var root = this.getChildrenContainer();
      root.add(item);
      if (root.getChildren().length == 1) this.setSelection([item]); //mimic single selection where an item always has to be selected
    },

    /**
     * Return the formatted label text from the <code>ListItem</code>.
     * The formatter removes all HTML tags and converts all HTML entities
     * to string characters when the rich property is <code>true</code>.
     *
     * @param {ListItem} item The list item to format.
     * @return {String} The formatted text.
     */
    _defaultFormat(item) {
      var valueLabel = item ? item.getLabel() : "";
      //       var rich = item ? item.getRich() : false;

      //       if (rich) {
      //         valueLabel = valueLabel.replace(/<[^>]+?>/g, "");
      //         valueLabel = qx.bom.String.unescape(valueLabel);
      //       }

      return valueLabel;
    },

    /**
     * Sets the icon inside the list to match the selected ListItem.
     */
    __updateIcon() {
      var listItem = this.getChildControl("list").getSelection()[0];
      var atom = this.getChildControl("atom");
      var icon = listItem ? listItem.getIcon() : "";
      icon === null ? atom.resetIcon() : atom.setIcon(icon);
    },

    /**
     * Sets the label inside the list to match the selected ListItem.
     */
    __updateLabel() {
      var listItem = this.getChildControl("list").getSelection()[0];
      var atom = this.getChildControl("atom");
      var label = listItem ? listItem.getLabel() : "";
      var format = this.getFormat();
      if (format !== null) {
        label = format.call(this, listItem);
      }

      // check for translation
      if (label && label.translate) {
        label = label.translate();
      }
      label === null ? atom.resetLabel() : atom.setLabel(label);
    },

    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    // overridden
    _onListPointerDown(e) {
      //       this.close();
    },

    // overridden
    _onListChangeSelection(e) {
      var current = e.getData();
      var old = e.getOldData();

      // Remove old listeners for icon and label changes.
      if (old && old.length > 0) {
        old[0].removeListener("changeIcon", this.__updateIcon, this);
        old[0].removeListener("changeLabel", this.__updateLabel, this);
      }

      if (current.length > 0) {
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
      } else {
        this.resetSelection();
      }
    }
  }
});
