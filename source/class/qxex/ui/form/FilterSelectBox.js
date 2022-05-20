/**
 * SelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterSelectBox", {
  extend: qx.ui.form.SelectBox,
  include: [qxex.ui.form.MSelectBoxBlur, qxex.ui.form.MSelectBoxFilter, qxex.ui.form.MSelectBoxSyncListItemStyle],

  construct() {
    super();
    this.addFilterTextField();
  },

  members: {
    hideInsteadOfDestroy: false,

    //overridden: do nothing when selectBox looses focus to e.g. textfield inside popup. Closing is handled via popup Manager and autohide
    _onBlur(e) {},

    // overridden
    _createChildControlImpl(id, hash) {
      var control;

      switch (id) {
        case "popup":
          control = super._createChildControlImpl(id);
          this._fixPopupBlur(control);
      }

      return control || super._createChildControlImpl(id);
    },

    //overrridden
    destroy() {
      var popup = this.getChildControl("popup");
      popup.exclude();
      if (this.hideInsteadOfDestroy) {
        this.clearFilter();
        this.exclude();
      } else {
        super.destroy();
      }
    }
  }
});
