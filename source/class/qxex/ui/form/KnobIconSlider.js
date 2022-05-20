/**
 * A Slider but with a styled knob.
 */
qx.Class.define("qxex.ui.form.KnobIconSlider", {
  extend: qx.ui.form.Slider,

  construct() {
    super();
    this.setCursor("pointer"); //https://developer.mozilla.org/de/docs/Web/CSS/cursor
  },

  properties: {
    knobIcon: {
      check: "String",
      apply: "_applyKnobIcon",
      nullable: true
    },

    knobSize: {
      check: "Number",
      apply: "_applyKnobSize",
      nullable: true
    }
  },

  members: {
    _createChildControlImpl(id) {
      var control;

      switch (id) {
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

      return control || super._createChildControlImpl(id);
    },

    // property apply
    _applyKnobIcon(value, old) {
      var knob = this.getChildControl("knob");

      //var dec = new qx.ui.decoration.Decorator();
      //dec.setBackgroundImage("proto/test.png");
      //dec.setBackgroundRepeat("scale");
      //nob.setDecorator(dec); //Widget

      knob.setSource(value); //Image

      //knob.setIcon(value); //Atom
    },

    _applyKnobSize(value, old) {
      var knob = this.getChildControl("knob");
      knob.set({
        scale: true,
        width: value,
        height: value
      });
    },

    _onPointerDown(e) {
      this.setCursor("ew-resize"); //col-resize
      super._onPointerDown(e);
    },

    _onPointerUp(e) {
      this.setCursor("pointer");
      super._onPointerUp(e);
    }
  }
});
