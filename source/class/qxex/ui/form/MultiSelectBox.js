/**
 * A SelectBox that allows for multiple selection.
 * Modeled after the jQuery UI MultiSelect Widget: http://www.erichynds.com/examples/jquery-ui-multiselect-widget/demos/
 *
 * @asset(qx/decoration/Modern/form/checkbox-checked-focused.png)
 * @asset(qx/decoration/Modern/form/checkbox-focused-invalid.png)
 */
qx.Class.define("qxex.ui.form.MultiSelectBox", {
  extend: qxex.ui.form.AbstractSelectBoxSimpler,
  implement: [qx.ui.core.IMultiSelection, qx.ui.form.IModelSelection],

  include: [
    //qx.ui.core.MMultiSelectionHandling,
    qx.ui.form.MModelSelection,
    qxex.ui.form.MSelectBoxSyncButtonStyle
  ],

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct() {
    super();

    this.addListener("keyinput", this._onKeyInput, this);

    //STATUSLABEL
    this.__statusLabel = new qx.ui.basic.Label(
      //this.trc("label","Shift or Crtl for multi select")
      this.trc("statusLine", "Use Shift-click or Crtl-click for multiple selection")
    ).set({rich: true, wrap: true, allowGrowX: true, width: 80, backgroundColor: "#DFDFDF"}); //rich for multiline
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties: {
    // overridden
    appearance: {
      refine: true,
      init: "multiselectbox"
    }
  },

  //ISingleSelection events
  events: {
    changeSelection: "qx.event.type.Data"
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    __statusLabel: null,

    __makeButton(text, textColor, callback, callbackThisPtr) {
      var control = new qx.ui.form.Button(text).set({
        focusable: false,
        padding: 2,
        margin: 0
      });

      var label = control.getChildControl("label");
      label.setTextColor(textColor);
      control.addListener("execute", e => {
        callback.call(callbackThisPtr);
      });
      return control;
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
        case "list":
          control = super._createChildControlImpl(id);
          control.setQuickSelection(false);
          control.setSelectionMode("multi");
          control.getChildControl("pane").removeListener("tap", this.close, this); //needed since qooxdoo 5.0.1: they changed the container structure
          break;

        case "popup":
          //POPUP window config
          control = super._createChildControlImpl(id);
          control.addBefore(this.getChildControl("buttonContainer"), this.getChildControl("list"));
          control.add(this.__statusLabel, {flex: 1});
          break;

        //ALL AND NONE BUTTONS
        case "buttonContainer":
          control = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
          control.add(this.getChildControl("allBtn"), {flex: 1});
          control.add(this.getChildControl("noneBtn"), {flex: 1});
          break;

        case "allBtn":
          control = this.__makeButton(
            this.trc("Label", "All"),
            "green",
            function (e) {
              this.setSelection(this.getSelectables());
            },
            this
          );

          break;

        case "noneBtn":
          control = this.__makeButton(
            this.trc("Label", "None"),
            "red",
            function (e) {
              this.setSelection(null);
            },
            this
          );

          break;
      }

      return control || super._createChildControlImpl(id);
    },

    /*
    ---------------------------------------------------------------------------
      HELPER METHODS FOR SELECTION API
    ---------------------------------------------------------------------------
    */

    //ISingleSelection Methods

    getSelectables() {
      return this.getChildrenContainer().getChildren();
    },

    getSelection() {
      return this.getChildrenContainer().getSelection();
    },

    getSelectionAsModelArr() {
      return this.getSelection().map(function (listItem) {
        return listItem.getModel();
      });
    },

    isSelected(widget) {
      return this.getChildrenContainer().isSelected(widget);
    },

    isSelectionEmpty() {
      return this.getChildrenContainer().isSelectionEmpty();
    },

    resetSelection() {
      var ret = this.getChildrenContainer().resetSelection();
      this.update();
      return ret;
    },

    setSelection(listItems) {
      var list = this.getChildrenContainer();

      if (list.getSelection() != listItems) {
        //TODO equals instead of == ??
        if (listItems) {
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
    setSelectionByModelArr(modelArr) {
      //return null !!??
      //var list = this.getChildrenContainer();
      //return list.findItem(loginName); // searches getLabel()

      var selection = [];

      var listItems = this.getChildren();
      for (var i = 0, l = listItems.length; i < l; i++) {
        var listItem = listItems[i];
        var curr = listItem.getModel();
        if (modelArr.indexOf(curr) >= 0) selection.push(listItem);
      }
      this.setSelection(selection);
    },

    //IMultiSelection Methods
    addToSelection(item) {
      return this.getChildrenContainer().addToSelection(item);
    },

    removeFromSelection(item) {
      return this.getChildrenContainer().removeFromSelection(item);
    },

    selectAll() {
      return this.getChildrenContainer().selectAll();
    },

    __prettyPrintLabel(listItem) {
      var label = listItem ? listItem.getLabel() : "";
      var format = this.getFormat();
      if (format !== null) {
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
    update() {
      var list = this.getChildrenContainer();
      var atom = this.getChildControl("atom");

      var listItems = list.getSelection();
      var items = this.getSelectables();

      var hasIcons = items.some(function (listItem) {
        return listItem.getIcon();
      });

      var total = items.length;
      var iconFun = function (listItem) {
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
    _onTap(e) {
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
    _onKeyInput(e) {
      // clone the event and re-calibrate the event
      var clone = e.clone();
      clone.setTarget(this._list);
      clone.setBubbles(false);

      // forward it to the list
      this.getChildControl("list").dispatchEvent(clone);
    },

    // overridden
    _onListPointerDown(e) {
      //dont do anything, unlike in singleSelectBox, where we close the popup immediately
    },

    // overridden
    _onListChangeSelection(e) {
      var current = e.getData();
      var old = e.getOldData();

      // Remove old listeners for icon and label changes.
      if (old && old.length > 0) {
        old[0].removeListener("changeIcon", this.update, this);
        old[0].removeListener("changeLabel", this.update, this);
      }

      if (current.length > 0) {
        // Add listeners for icon and label changes
        current[0].addListener("changeIcon", this.update, this);
        current[0].addListener("changeLabel", this.update, this);
      }

      this.update();
    }
  }
});
