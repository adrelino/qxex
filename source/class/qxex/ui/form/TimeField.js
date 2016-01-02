/* ************************************************************************
   Authors:
     * Adrian H.
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
  extend : qx.ui.form.ComboBox,
  // extend : qx.ui.form.DateField,
  // implement : [qx.ui.form.IDateForm],
  
  construct : function() {
    this.base(arguments);
    this.getChildControl("textfield").setValue("0:00");
  },
  
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

  members :
  {

    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */
  	
    /**
     * Toggles the popup's visibility.
     *
     * @param e {qx.event.type.Mouse} Mouse click event
     */
    _onTap : function(e)
    {
//    	var isListOpen = this.getChildControl("popup").isVisible();
      var target = e.getTarget();
      this.info("target=" + target);
      if (target == this.getChildControl("button")) {
        this.toggle();
      }
      //else if (target == this.getChildControl("list")) {
      //	var i=1;
      //}
      else {
        this.closePopup();
      }
    },

    toggle : function()
    {
      var isListOpen = this.getChildControl("popup").isVisible();
      if (isListOpen) {
        this.closePopup();
      } else {
        this.open();
        this.getChildControl("list").getChildControl("slider").activate();
      }
    },
    
     /*
     * Handler for the blur event of the current widget.
     *
     * @param e {qx.event.type.Focus} The blur event.
    _onBlur : function(e)
    {
    	// but not for "knob"
    	var target = e.getTarget();
      
      if(target !=this.getChildControl("popup")){
         this.closePopup();
      }
     */
  

    /**
     * Hides the list popup.
     * Overwrite AbstractSelectBox.js close() as we want to have full control!
     */
    close : function() {
    //	var a=1;
    //  //var isListOpen = this.getChildControl("popup").isVisible();
    //  //this.getChildControl("popup").hide();
    },

    /**
     * Hides the list popup.
     */
    closePopup : function() {
      this.getChildControl("popup").hide();
    },

    /**
    * This method sets the time to the textfield and the slider popup
    * 
    * @param value {Date} The date to set.
    */
    setValue : function(date)
    {
      // set the date to the textfield
      var textField = this.getChildControl("textfield");
      
      if (date == null) {
        textField.setValue("");
        return;
      }

      var m=date.getMinutes();
      if (m == 0) {
        m = "00";
      }
      
      var sec=date.getSeconds();
      var secStr = "";
      if (sec != 0) {
        if (sec < 10)
          secStr = ":0" + sec;
        else
          secStr = ":" + sec;
      }
      
      textField.setValue(date.getHours() + ":" + m + secStr);

      // set the date in the daytimeslider
      var daytimeslider = this.getChildControl("list");
      daytimeslider.setValue(date);
    },


    /**
     * Returns the current set time.
     * If the given text could not be parsed, the Date Object with 0 Millis will be returned
     *
     * @return {Date} The currently set date.
     */
    getValue : function()
    {
      // get the value of the textfield  and  replace . with :
      var text = this.getChildControl("textfield").getValue().replace(/\./g,":");
      //create js Date Object
      var date=new Date(0);
      
      //regex to see if it is a valid date
      if( text.search(/(([01])?[0-9]|2[0-3]):[0-5][0-9]/) > -1 ||
          text.search(/(([01])?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/) > -1){
      	/*
      	 * initializaiton possibilities of js native Date Object:
      	 * Objektname = new Date();
      	 * Objektname = new Date("Monat Tag, Jahr Stunden:Minuten:Sekunden");   note: only variant with strings, inti with //Date("0 0, 0 "+text+":00");
      	 * Objektname = new Date(Jahr, Monat, Tag);
      	 * Objektname = new Date(Jahr, Monat, Tag, Stunden, Minuten, Sekunden);
      	 * Objektname = new Date(Millisekunden);
      	 * 
      	 */
        var array = text.split(":");
      	date.setHours(array[0]);
      	date.setMinutes(array[1]);
        if (array.length > 2)
          date.setSeconds(array[2]);
      	
      	//this.info(date.getHours()+":"+date.getMinutes());
      	return date;
      }else{
        date.setHours(0);
        date.setMinutes(0);
      	return date;
      }
    },


    /**
     * Resets the TimeField. The textfield and the daytimeslider will be 0:00
     */
    resetValue: function()
    {
      // set the date to the textfield
      var textField = this.getChildControl("textfield");
      textField.setValue("0:00");

      // set the date in the daytimeslider
      var daytimeslider = this.getChildControl("list");
      daytimeslider.setValue(0);
    },

    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createChildControlImpl : function(id)
    {
      var control;

      switch(id)
      {
        case "list":
          control = new qxex.ui.control.TimeChooser();//qx.ui.control.DateChooser(); 
          control.setFocusable(false);
          control.setKeepFocus(true);
          control.addListener("releaseSlider", this._onChangeDate, this);
          break;

        case "popup":
          control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
          control.setAutoHide(false);
          control.add(this.getChildControl("list"));
          control.addListener("pointerup", this._onChangeDate, this);
          //control.addListener("mouseup", this._onChangeDate, this);
         // control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
          break;
      }

      return control || this.base(arguments, id);
    },

   /*
   ---------------------------------------------------------------------------
     EVENT LISTENERS
   ---------------------------------------------------------------------------
   */
    
    findItem: function(y){
    	
    },

   /**
    * Handler method which handles the click on the slider popup.
    *
    * @param e {qx.event.type.Mouse} The mouse event of the click.
    */
    _onChangeDate : function(e)
    {
      var textField = this.getChildControl("textfield");
      var date = this.getChildControl("list").getValue(); // list is instanceof qxex.ui.control.TimeChooser
      var min= date.getMinutes();
      if(min==0) min="00";
      textField.setValue(date.getHours()+":"+min); // currently ignore seconds when from slider
      this.closePopup();
    },

//    // overridden
//    _onPopupChangeVisibility : function(e)
//    {
//      // Synchronize the chooser with the current value on every
//      // opening of the popup. This is needed when the value has been
//      // modified and not saved yet (e.g. no blur)
//      var popup = this.getChildControl("popup");
//      if (popup.isVisible())
//      {
//        var chooser = this.getChildControl("list");
//        var date = this.getValue();
//        chooser.setValue(date);
//       // this.closePopup();
//      }
//    },


    /**
     * Reacts on value changes of the text field and syncs the
     * value to the combobox.
     *
     * @param e {qx.event.type.Data} Change event
     */
    _onTextFieldChangeValue : function(e)
    {
      // Apply to popup
      var date = this.getValue();
      if (date != null)
      {
        var list = this.getChildControl("list"); // list is instanceof qxex.ui.control.TimeChooser
        list.setValue(date);
      }

      // Fire event
      this.fireDataEvent("changeValue", this.getValue());
    },


    /**
     * Checks if the textfield of the TimeField is empty.
     *
     * @return {Boolean} True, if the textfield of the TimeField is empty.
     */
    isEmpty: function()
    {
      var value = this.getChildControl("textfield").getValue();
      return value == null || value == "";
    }
  }
});
