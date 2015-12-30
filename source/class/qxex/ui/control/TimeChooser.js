/**
 * A slider to choose the time from 0h to 24h in 15min steps
 */
qx.Class.define("qxex.ui.control.TimeChooser", {
  extend :qx.ui.core.Widget,
  // include : [
  //   qx.ui.core.MExecutable,
  //   qx.ui.form.MForm
  // ],
  // implement : [
  //   qx.ui.form.IExecutable,
  //   qx.ui.form.IForm,
  //   qx.ui.form.IDateForm
  // ],
  
  /**
   * @param time {Date ? null} The initial time to show. The date part is ignored.
   */
  construct : function(time) {
    this.base(arguments);
    
    //set the layout
    var layout = new qx.ui.layout.Grid();
    layout.setSpacing(1);
    layout.setColumnFlex(0, 1);
    layout.setColumnFlex(1, 1);
    layout.setColumnFlex(2, 1);
    layout.setColumnAlign(0, "left", "bottom");
    layout.setColumnAlign(1, "center", "bottom");
    layout.setColumnAlign(2, "right", "bottom");
//     console.log(layout.getRowHeight(0));
//     layout.setRowHeight(1,12);
//     layout.setRowFlex(0,0);
//     layout.setRowFlex(1,2);
    this._setLayout(layout);

    this.hourAbrev = this.trc("hour abbreviation", "h");
    this.minValue = 0;
    this.maxValue = 95; // 24h*4=96 (for 15min steps)
    this.minAllowed = this.minValue;
    this.maxAllowed = this.maxValue;

    //create the child controls
    this.slider = this._createChildControl("slider");
    this._createChildControl("minLabel");
    this._createChildControl("maxLabel");
    
    this.setDecorator("button-pressed");

    if(!time){
      time = new Date(0);
      time.setHours(0); //date with hour 0
    }
    this.setValue(time);

  },

 
  properties : {
    /**
     * @param knobIcon {String} xbGetIcon("12/sliderKnobUntil.png");
     */
    knobIcon : {
      check : "String",
      apply : "_applyKnobIcon",
      nullable : true
    },

    label : {
      init : "",
      check : "String",
      apply : "_applyLabel",
      nullable : true
    }
  },
  
  events :
  {
  	"releaseSlider" : "qx.event.type.Event"
  },

  members : {

    _createChildControlImpl : function(id, hash){
      var control;

      switch(id)
      {
        case "slider" :
          control = new qxex.ui.form.KnobIconSlider();

          control.set({
            minimum :this.minValue,
            maximum :this.maxValue,
            singleStep :1,
            pageStep :4,
            minHeight : 16
//             ,value :initHour * 4
          });

          control.addListener("pointerup", function(){ // "mouseup"
              this.fireEvent("releaseSlider");
          },this);

          control.addListener("keypress", function(e){
            if (e.getKeyIdentifier()=="Escape"){
              this.fireEvent("releaseSlider");
            }
          },this);

          control.addListener("changeValue", function(e) {
            this.updateCurrLabel();
          }, this);
          
          this._add(control,{row:1, column:0, colSpan:3});
          break;

        case "minLabel" :
          control = new qx.ui.basic.Label("00:00" + this.hourAbrev);
          control.setTextColor("#808080"); // "grey"

          this._add(control,{row:0, column:0});
          break;

        case "currLabel" :
          control = new qx.ui.basic.Label("");
          this._add(control,{row:0, column:1});
          break;

        case "maxLabel" :
          control = new qx.ui.basic.Label("23:45" + this.hourAbrev);
          control.setTextColor("#808080");

          this._add(control,{row:0, column:2});
          break;
      }

      return control || this.base(arguments, id);
    },

    // property apply
    _applyKnobIcon : function(value, old)
    {
      this.getChildControl("slider").setKnobIcon(value || null);
    },
    
    // property apply
    _applyLabel : function(value, old)
    {
      var descr = value || "";
      descr += this.getTimeStrFormatted();
      this.getChildControl("currLabel").setValue(descr);
    },

    moveSliderTo: function(hours, minutes) {
      this.getChildControl("slider").setValue(hours*4 + Math.floor(minutes/15.0));
    },
    
    /**
     * @param {String} currValue 25 (value of slider)
     * @return {String} " 6:45"
     */
    __format : function(currValue, align) {
      var align = align || true;
      var fValue = parseFloat(currValue);
      var hours = Math.floor( fValue / 4.0 );
      var hoursStr = new String(hours);
      if (align && hoursStr.length < 2)
        hoursStr = "0" + hoursStr;  // " " has a different width than numbers!!! TODO: find somewthing in html (/b) and set label to rich so we get equal spacing
      var minutes = Math.round((fValue / 4.0 - hours) * 60);
      var minStr = ((minutes == 0) ? "00" : "" + minutes);
      var time = ("" + hoursStr + ":" + minStr);
      var ret = {
          hours: hours,
          minutes: minutes,
          time: time
      };
      return ret;
    },

    /**
     * @return {Number} 0-96 the slider value (easy to compare to other slider)
     */
    getNumericTimeValue : function() {
      if (this.slider == null)
        return 0;
      return this.slider.getValue();
    },
    
     /**
     * @param val {Number} 0-96 the slider value (easy to compare to other slider)
     */
    setNumericTimeValue : function(val) {
      if (this.slider != null){
         this.slider.setValue(val);
         }
    },

    /**
     * @return {String} from "0" to "59"
     */
    getMinuteStr : function() {
      if (this.slider == null)
        return "";
      return this.__format(this.slider.getValue(), false).minutes;
    },
    
    /**
     * @return {String} from "0" to "23"
     */
    getHourStr : function() {
      if (this.slider == null)
        return "";
      return this.__format(this.slider.getValue(), false).hours;
    },
    
    /**
     * @return {String} for example "16:45" or "5:00"
     */
    getTimeStr : function() {
      if (this.slider == null)
        return "";
      return this.__format(this.slider.getValue(), false).time;
    },

    getTimeStrFormatted : function(){
      var number = this.getChildControl("slider").getValue();
      var ret=this.__format(number);
      return ret.time+this.hourAbrev;
    },

    updateCurrLabel : function(){
      this.getChildControl("currLabel").setValue(this.getLabel()+this.getTimeStrFormatted());
    },

    /**
     * get Minutes and Hours in an js Date Object
     * 
     * @return {Date} date
     */
    getValue : function() {
    	var date=new Date(0);
    	date.setHours(parseInt(this.getHourStr()));
    	date.setMinutes(parseInt(this.getMinuteStr()));
    	//this.info("DayTimeSlider getValue: "+date.getHours()+":"+date.getMinutes());
    	return date;
    },

    /**
     * Moves slider to the position corresponding to the Minutes and Hours in the Date Object
     * 
     * @param {Date} time
     */
    setValue : function(time) {
    	this.moveSliderTo(time.getHours(), time.getMinutes());
    	this.updateCurrLabel();
    }
  },

  destruct : function() {
    this._disposeObjects();
  }
});