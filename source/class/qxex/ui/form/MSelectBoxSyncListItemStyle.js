/**
 * Mixin which adds syncing capability to (Single) SelectBox so that
 * the TextColor and ToolTipText of the SelectBox matches the selected item
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxSyncListItemStyle", {
  properties: {
    syncListItemStyle: {
      check: "Boolean",
      init: false,
      apply: "_applySyncListItemStyle"
    }
  },

  members: {
    __defaultToolTipText: null,

    // property modifier
    _applySyncListItemStyle(value, old) {
      if (value) {
        this.addListener("changeSelection", this.__selectionChangedListener, this);
      } else {
        this.removeListener("changeSelection", this.__selectionChangedListener, this);
      }
    },

    __selectionChangedListener(e) {
      if (!this.__defaultToolTipText) {
        //init on first call;
        this.__defaultToolTipText = this.getToolTipText();
      }
      var listItemSelected = e.getData()[0];
      if (listItemSelected) {
        //color
        var color = listItemSelected.getTextColor();
        if (color == "text-selected") color = null; //white -> black
        this.setTextColor(color);
        //tooltipText
        var toolTipText = listItemSelected.getToolTipText();
        if (toolTipText) {
          this.setToolTipText(toolTipText);
        } else {
          this.setToolTipText(this.__defaultToolTipText);
        }
      }
    }
  }
});
