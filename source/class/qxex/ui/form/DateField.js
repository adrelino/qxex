/* ************************************************************************

   Authors:
     * Adrian Haarbach (adrelino)

************************************************************************ */

/**
 * A *date field* with invalid states when we cant parse the date
 */
qx.Class.define("qxex.ui.form.DateField", {
  extend: qx.ui.form.DateField,

  /**
   * @param withClearButton {Boolean ? false} Whether to add an additional button to clear the date.
   * @param showHoliday
   */
  construct(withClearButton, showHoliday) {
    super();
    this.__showHoliday = showHoliday;
    showHoliday && this.removeListener("blur", this._onBlur, this);
    if (withClearButton) this._createChildControl("button2");
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    // overridden
    _createChildControlImpl(id, hash) {
      var control;

      switch (id) {
        case "button2":
          control = new qx.ui.form.Button(); //null,xbGetQxIcon("16/actions/edit-delete.png"));
          control.setFocusable(false);
          control.setKeepActive(true);
          control.addState("inner");
          control.addListener("execute", e => {
            this.setValue(null);
          });
          this._add(control);
          break;

        case "list":
          if (!this.__showHoliday) break;
          control = new qxex.ui.control.DateChooser();
          control.setFocusable(false);
          control.setKeepFocus(true);
          control.addListener("daytap", this._onChangeDate, this);
          control.addListener("execute", this._onChangeDate, this);
          break;

        case "popup":
          if (!this.__showHoliday) break;
          control = super._createChildControlImpl(id);
          control.setAutoHide(true);
          control.removeListener("pointerup", this._onChangeDate, this);
          break;
      }

      return control || super._createChildControlImpl(id);
    },

    //overridden
    _onTextFieldChangeValue(e) {
      var notcreate = true;
      // Apply to popup
      var date = this.getValue();
      if (date !== null) {
        var list = this.getChildControl("list", notcreate);
        list && list.setValue(date);
      }

      // Fire event
      this.fireDataEvent("changeValue", this.getValue());
    },

    //overridden
    setValue(value) {
      // set the date to the textfield
      var textField = this.getChildControl("textfield");
      textField.setValue(this.getDateFormat().format(value));

      var notcreate = true;

      // set the date in the datechooser
      var dateChooser = this.getChildControl("list", notcreate);
      dateChooser && dateChooser.setValue(value);
    },

    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Call to avoid that the popup closes on blur.
     */
    removeOriginalBlurListener() {
      this.removeListener("blur", this._onBlur, this);
    },

    /**
     * Returns the current set date, parsed from the input-field
     * corresponding to the {@link #dateFormat}.
     * If the given text could not be parsed, <code>null</code> will be returned.
     *
     * @return {Date} The currently set date.
     */
    getValue() {
      // get the value of the textfield
      var textfieldValue = this.getChildControl("textfield").getValue();

      // return the parsed date
      try {
        var val = this.getDateFormat().parse(textfieldValue);
        this.setValid(true);
        return val;
      } catch (ex) {
        this.setValid(false);
        var formatter = this.getDateFormat();
        this.setInvalidMessage(this.trc("tooltip", "Invalid format. Correctly formatted example: %1", formatter.format(new Date())));
        return null;
      }
    }
  }
});
