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

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {

    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
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