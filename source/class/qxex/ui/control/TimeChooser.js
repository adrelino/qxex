/**
 * A *time chooser* is a small slider with a header bar to choose the time from 0:00h to 23:25h in 15min steps
 * 
 * The clock icon for the knob is slightly scaled
 * @asset(qx/icon/${qx.icontheme}/16/apps/preferences-clock.png)
 *
 * @childControl slider {qxex.ui.form.KnobIconSlider} knob icon slider component
 * @childControl minLabel {qx.ui.basic.Label} header bar label on the left
 * @childControl currLabel {qx.ui.basic.Label} header bar label center, shows the currently selected time
 * @childControl maxLabel {qx.ui.basic.Label} header bar label right
 */
qx.Class.define("qxex.ui.control.TimeChooser",
{
  extend :qx.ui.core.Widget,
  include : [
    qx.ui.core.MExecutable,
    qx.ui.form.MForm
  ],
  implement : [
    qx.ui.form.IExecutable,
    qx.ui.form.IForm,
    qx.ui.form.IDateForm
  ],

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  
  /**
   * @param time {Date ? null} The initial time to show. The date part is ignored.
   * If <code>null</code> the current day (today) is shown.
   */
  construct : function(time) {
    this.base(arguments);
    
    //set the layout
    var layout = new qx.ui.layout.Grid();
    layout.setSpacing(1);
    layout.setSpacingX(8);
    layout.setColumnFlex(0, 1);
    layout.setColumnFlex(1, 1);
    layout.setColumnFlex(2, 1);
    layout.setColumnAlign(0, "left", "bottom");
    layout.setColumnAlign(1, "center", "bottom");
    layout.setColumnAlign(2, "right", "bottom");
    this._setLayout(layout);

    //create the child controls
    this._createChildControl("slider");
    this._createChildControl("minLabel");
    this._createChildControl("currLabel");
    this._createChildControl("maxLabel");

    // listen for locale changes
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().addListener("changeLocale", this._updateTimePane, this);
    }
    
    this.setDecorator("button-pressed");

    if(!time){
      time = new Date(0);
      time.setHours(0); //date with hour 0
    }
    this.setValue(time);

    //register pointer up and down handler to avoid blur on header label click
    this.addListener("pointerdown", this._onPointerUpDown, this);
    this.addListener("pointerup", this._onPointerUpDown, this);

  },

 
  properties : {
    
    /** The knobIcon to show in the slider. Gets scaled to 14x14 px by default */
    knobIcon : {
      check : "String",
      apply : "_applyKnobIcon",
      nullable : true
    },

    /** The label to show left to the current time */
    label : {
      init : "",
      check : "String",
      apply : "_applyLabel",
      nullable : true
    },

    /** The fime value of the widget. */
    value :
    {
      check : "Date",
      init : null,
      nullable : true,
      event : "changeValue",
      apply : "_applyValue"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members : {

    /*
    ---------------------------------------------------------------------------
      WIDGET INTERNALS
    ---------------------------------------------------------------------------
    */

    //overridden
    _createChildControlImpl : function(id, hash){
      var control;

      switch(id)
      {
        case "slider" :
          control = new qxex.ui.form.KnobIconSlider();
          control.setKnobIcon("icon/16/apps/preferences-clock.png");
          control.setKnobSize(14);

          control.set({
            minimum : 0,
            maximum : 95, // 24h * 60min/h / 15min = 96 (15min steps) from 0..95
            singleStep :1,
            pageStep :4,
            focusable : false //important so blur works correctly
          });

          control.addListener("pointerup", function(){
              this.execute();
          },this);

          control.addListener("changeValue", function(e) {
            var num = e.getData();
            var time = this.__sliderValueToTime(num);
            this.setValue(time);
          }, this);
          
          this._add(control,{row:1, column:0, colSpan:3});
          break;

        case "minLabel" :
          control = this.__makeChildLabel(true);
          this._add(control,{row:0, column:0});
          break;

        case "currLabel" :
          control = this.__makeChildLabel();
          this._add(control,{row:0, column:1});
          break;

        case "maxLabel" :
          control = this.__makeChildLabel(true);
          this._add(control,{row:0, column:2});
          break;
      }

      return control || this.base(arguments, id);
    },

    __makeChildLabel : function(grey){
      var control = new qx.ui.basic.Label();
          control.setSelectable(false);
          if(grey) control.setTextColor("#808080"); // "grey"
      return control;
    },

    // property apply
    _applyKnobIcon : function(value, old)
    {
      this.getChildControl("slider").setKnobIcon(value || null);
    },
    
    // property apply
    _applyLabel : function(value, old)
    {
      this._updateTimePane();
    },

    //property apply
    _applyValue : function(value, old){
      var num = this.__timeToSliderValue(value);

      //Move slider to the position hours + 4 * minutes/15 in the Date Object
      this.getChildControl("slider").setValue(num);
      
      //Show the new time formatted in header pane;
      this._updateTimePane();
    },

    /**
     * Inverse of __sliderValueToTime
     * @param time {Date} hours and minutes set correctly
     * @return {Number} slider value in range 0 - 96
     */
    __timeToSliderValue: function(time){
      if(!time) return 0;
      var hours = time.getHours();
      var minutes = time.getMinutes();
      return hours*4 + Math.floor(minutes/15.0); //floors minutes to lower 15 minute intervals
    },

    /**
     * Inverse of __timeToSliderValue
     * @param num {Number} slider value in range 0 - 96
     * @return {Date} hours and minutes set correctly
     */
    __sliderValueToTime: function(num){
      var hours = Math.floor( num / 4.0 );
      var minutes = Math.round((num / 4.0 - hours) * 60);
      var date=new Date(0);
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    },


    /**
     * Updates the header/time pane with the formatted current time value.
     */
    _updateTimePane : function(){
      var time = this.getValue();

      // Create help times;
      var timeBegin = new Date(0); timeBegin.setHours(0); timeBegin.setMinutes(0);
      var timeEnd   = new Date(0); timeEnd.setHours(23); timeEnd.setMinutes(45);

      var timeFormat = new qx.util.format.DateFormat(qx.locale.Date.getTimeFormat("short")); //todo add "medium" with seconds

      this.getChildControl("minLabel").setValue(timeFormat.format(timeBegin));
      this.getChildControl("currLabel").setValue( (this.getLabel() || "") + (timeFormat.format(time) || "--:--"));
      this.getChildControl("maxLabel").setValue(timeFormat.format(timeEnd));

      timeFormat.dispose();

    },

    /**
     * Handler which stops the propagation of the tap event if
     * the header labels will be tapped.
     *
     * @param e {qx.event.type.Pointer} The pointer up / down event
     */
    _onPointerUpDown : function(e) {
      var target = e.getTarget();

      if (target == this.getChildControl("minLabel") ||
          target == this.getChildControl("currLabel") ||
          target == this.getChildControl("maxLabel")) {
        e.stopPropagation();
        return;
      }
    }

  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().removeListener("changeLocale", this._updateTimePane, this);
    }
  }
});