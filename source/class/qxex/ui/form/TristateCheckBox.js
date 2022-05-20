/**
 * TristateCheckBox that toggles through 3 states by default.
 * Call execute() or toggleValueTriState() and not toggleValue() to toggle through the 3 states, otherwise you only get 2.
 */
qx.Class.define("qxex.ui.form.TristateCheckBox", {
  extend: qx.ui.form.CheckBox,

  construct(label) {
    super(label);
    this.setTriState(true);
  },

  properties: {
    /**
     * Whether the {@link #toggleValue} method also switches through the
     * "tristate" state.
     */
    toggleThruTriState: {
      check: "Boolean",
      init: true
    }
  },

  members: {
    /**
     * Cannot ovwerwrite parent's generated method toggleValue(), thus the different name
     */
    toggleValueTriState() {
      if (this.isToggleThruTriState()) {
        // Toggle through : [false, true, "tristate"]
        var oldVal = this.getValue();
        var newVal = null;
        if (oldVal === null) {
          newVal = true;
        } else if (oldVal === true) {
          newVal = false;
        } else if (oldVal === false) {
          newVal = null;
        }
        this.setValue(newVal);
      } else {
        // 'Normal' behavior
        this.toggleValue();
      }
    },

    //overwritten
    _onExecute() {
      this.toggleValueTriState();
    }
  }
});
