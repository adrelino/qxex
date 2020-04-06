/**
 * A Slider but with a styled knob.
 */
qx.Class.define("qxex.ui.form.KnobIconSlider",{
	extend:qx.ui.form.Slider,

	construct : function(){
		this.base(arguments);
		this.setCursor("pointer");//https://developer.mozilla.org/de/docs/Web/CSS/cursor
	},

	properties : {
		knobIcon :
		{
		  check : "String",
		  apply : "_applyKnobIcon",
		  nullable : true
		},

		knobSize : 
		{
		  check : "Number",
		  apply : "_applyKnobSize",
		  nullable : true
		}
	},
	
	members : {

    _createChildControlImpl : function(id)
    {
      var control;

      switch(id)
      {
        case "knob":
//           control = new qx.ui.core.Widget(); // original widget, scales, but needs "scale" background repeat in decorator
          control = new qx.ui.basic.Image();
//           control = new qx.ui.basic.Atom(null,null); //keeps icon's orginal size

          control.addListener("resize", this._onUpdate, this);
          control.addListener("pointerover", this._onPointerOver);
          control.addListener("pointerout", this._onPointerOut);
          this._add(control);

          break;
      }

      return control || this.base(arguments, id);
    },

    // property apply
    _applyKnobIcon : function(value, old)
    {
      var knob = this.getChildControl("knob");
      
//       var dec = new qx.ui.decoration.Decorator();
//       dec.setBackgroundImage("proto/test.png");
//       dec.setBackgroundRepeat("scale");
//       knob.setDecorator(dec); //Widget

		knob.setSource(value); //Image

//       knob.setIcon(value); //Atom
    },

    _applyKnobSize : function(value,old){
      var knob = this.getChildControl("knob");
      knob.set({
        scale : true,
        width : value,
        height : value
      });
    },

    _onPointerDown: function(e){
    	this.setCursor("ew-resize");//col-resize
    	this.base(arguments,e);
    },

    _onPointerUp: function(e){
    	this.setCursor("pointer");
    	this.base(arguments,e);
    }

	}
});