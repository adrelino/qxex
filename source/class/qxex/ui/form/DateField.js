/* ************************************************************************

   Authors:
     * Adrian Haarbach (adrelino)

************************************************************************ */

/**
 * A *date field* with invalid states when we cant parse the date
 */
qx.Class.define("qxex.ui.form.DateField",
{
  extend : qx.ui.form.DateField,

  /**
   * @param withClearButton {Boolean ? false} Whether to add an additional button to clear the date.
   */
  construct : function(withClearButton)
  {
    this.base(arguments);
    if(withClearButton) this._createChildControl("button2");
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "button2":
          control = new qx.ui.form.Button();//null,xbGetQxIcon("16/actions/edit-delete.png"));
          control.setFocusable(false);
          control.setKeepActive(true);
          control.addState("inner");
          control.addListener("execute", function(e){
            this.setValue(null);
          }, this);
          this._add(control);
          break;
      }

      return control || this.base(arguments, id);
    },

    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Call to avoid that the popup closes on blur.
     */
    removeOriginalBlurListener : function (){
      this.removeListener("blur", this._onBlur, this);
    },

    /**
     * Returns the current set date, parsed from the input-field
     * corresponding to the {@link #dateFormat}.
     * If the given text could not be parsed, <code>null</code> will be returned.
     *
     * @return {Date} The currently set date.
     */
    getValue : function()
    {
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
        this.setInvalidMessage(this.trc("tooltip","Invalid format. Correctly formatted example: %1",formatter.format(new Date())));
        return null;
      }
    }
  }
});