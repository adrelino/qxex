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
 */
qx.Class.define("qxex.ui.form.TimeField",
{
  extend : qxex.ui.form.DateField,
  
  properties : {
    // overridden
    appearance :
    {
      refine : true,
      init : "watcheetimefield"
    }
  },
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  statics :
  {
    __timeFormat : null,
    __formatterTime : null,

    /**
     * Get the shared default date formatter
     *
     * @return {qx.util.format.DateFormat} The shared date formatter
     */
    getDefaultTimeFormatter : function()
    {
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


  members :
  {

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
    _setDefaultDateFormat : function() {
      this.setDateFormat(qxex.ui.form.TimeField.getDefaultTimeFormatter());
    },
  	

    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */

    // /**
    // * This method sets the time, which will be formatted as hh:mm to the 
    // * time field. It will also select the date, rounded to the nearest 15 minute
    // * interval in the TimeChooser slider popup
    // * 
    // * @param value {Date} The time to set.
    // */
    // setValue : function(date)
    // {
    //   // set the date to the textfield
    //   var textField = this.getChildControl("textfield");
      
    //   if (date == null) {
    //     textField.setValue("");
    //     return;
    //   }

    //   var m=date.getMinutes();
    //   if (m == 0) {
    //     m = "00";
    //   }
      
    //   var sec=date.getSeconds();
    //   var secStr = "";
    //   if (sec != 0) {
    //     if (sec < 10)
    //       secStr = ":0" + sec;
    //     else
    //       secStr = ":" + sec;
    //   }
      
    //   textField.setValue(date.getHours() + ":" + m + secStr);

    //   // set the date in the daytimeslider
    //   var daytimeslider = this.getChildControl("list");
    //   daytimeslider.setValue(date);
    // },


    // /**
    //  * Returns the current set time, parsed from the time field as hh:mm.
    //  * If the given text could not be parsed, the Date Object with 0 Millis will be returned
    //  *
    //  * @return {Date} The currently set time.
    //  */
    // getValue : function()
    // {
    //   // get the value of the textfield  and  replace . with :
    //   var text = this.getChildControl("textfield").getValue().replace(/\./g,":");
    //   //create js Date Object
    //   var date=new Date(0);
      
    //   //regex to see if it is a valid date
    //   if( text.search(/(([01])?[0-9]|2[0-3]):[0-5][0-9]/) > -1 ||
    //       text.search(/(([01])?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/) > -1){
      	
    //   	 * initializaiton possibilities of js native Date Object:
    //   	 * Objektname = new Date();
    //   	 * Objektname = new Date("Monat Tag, Jahr Stunden:Minuten:Sekunden");   note: only variant with strings, inti with //Date("0 0, 0 "+text+":00");
    //   	 * Objektname = new Date(Jahr, Monat, Tag);
    //   	 * Objektname = new Date(Jahr, Monat, Tag, Stunden, Minuten, Sekunden);
    //   	 * Objektname = new Date(Millisekunden);
    //   	 * 
      	 
    //     var array = text.split(":");
    //   	date.setHours(array[0]);
    //   	date.setMinutes(array[1]);
    //     if (array.length > 2)
    //       date.setSeconds(array[2]);
      	
    //   	//this.info(date.getHours()+":"+date.getMinutes());
    //   	return date;
    //   }else{
    //     date.setHours(0);
    //     date.setMinutes(0);
    //   	return date;
    //   }
    // },


    // /**
    //  * Resets the TimeField. The textfield and the TimeChooser slider will be 0:00
    //  */
    // resetValue: function()
    // {
    //   // set the date to the textfield
    //   var textField = this.getChildControl("textfield");
    //   textField.setValue("0:00");

    //   // set the date in the daytimeslider
    //   var daytimeslider = this.getChildControl("list");
    //   daytimeslider.setValue(0);
    // },


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
          control = new qxex.ui.control.TimeChooser();
//           control = new qx.ui.control.DateChooser(); 
          control.setFocusable(false);
          control.setKeepFocus(true);
          control.addListener("execute", this._onChangeDate, this);
          break;
      }

      return control || this.base(arguments, id);
    },

   /*
   ---------------------------------------------------------------------------
     EVENT LISTENERS
   ---------------------------------------------------------------------------
   */
    
   /**
    * Handler method which handles the click on the slider popup.
    *
    * @param e {qx.event.type.Mouse} The mouse event of the click.
    */
//     _onChangeDate : function(e)
//     {
//       var textField = this.getChildControl("textfield");
//       var date = this.getChildControl("list").getValue(); // list is instanceof qxex.ui.control.TimeChooser
//       var min= date.getMinutes();
//       if(min==0) min="00";
//       textField.setValue(date.getHours()+":"+min); // currently ignore seconds when from slider
//       this.__closePopup();
//     }
  }
});
