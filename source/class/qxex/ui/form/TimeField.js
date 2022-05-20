/* ************************************************************************
   Authors:
     * Adrian Haarbach (adrelino)
************************************************************************ */

/**
 * A *time field* is like a combo box with the time slider as popup.
 * It is complementary to qooxdoo's built-in *date field*.
 * As button to open the slider a watch icon is shown at the right to the textfield.
 *
 * The following example creates a time field and sets the current
 * time as selected.
 *
 * <pre class='javascript'>
 * var timeField = new qxex.ui.form.TimeField();
 * this.getRoot().add(timeField, {top: 20, left: 20});
 * timeField.setValue(new Date());
 * </pre>
 *
 * @childControl list {qxex.ui.control.TimeChooser} time chooser component
 * @childControl popup {qx.ui.popup.Popup} popup which shows the list control
 * --asset(qx/icon/${qx.icontheme}/16/apps/preferences-clock.png)
 */
qx.Class.define("qxex.ui.form.TimeField", {
  extend: qxex.ui.form.DateField,

  properties: {
    // overridden
    appearance: {
      refine: true,
      init: "timefield"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  statics: {
    __timeFormat: null,
    __formatterTime: null,

    /**
     * Get the shared default date formatter
     *
     * @return {qx.util.format.DateFormat} The shared date formatter
     */
    getDefaultTimeFormatter() {
      var format = qx.locale.Date.getTimeFormat("short").toString(); //todo add "medium" with seconds

      if (format == this.__timeFormat) {
        return this.__formatterTime;
      }

      if (this.__formatterTime) {
        this.__formatterTime.dispose();
      }

      this.__formatterTime = new qx.util.format.DateFormat(format, qx.locale.Manager.getInstance().getLocale());
      this.__timeFormat = format;

      return this.__formatterTime;
    }
  },

  members: {
    /*
    ---------------------------------------------------------------------------
      PROTECTED METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Sets the default date format which is returned by
     * {@link #getDefaultTimeFormatter}. You can overrride this method to
     * define your own default format.
     */
    _setDefaultDateFormat() {
      this.setDateFormat(qxex.ui.form.TimeField.getDefaultTimeFormatter());
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
          control = new qxex.ui.control.TimeChooser();
          control.setFocusable(false);
          control.setKeepFocus(true);
          control.addListener("execute", this._onChangeDate, this);
          break;

        //         case "button":
        //           control = this.base(arguments, id);
        //           control.setIcon("icon/16/apps/preferences-clock.png");
        //           break;
      }

      return control || super._createChildControlImpl(id);
    }
  }
});
