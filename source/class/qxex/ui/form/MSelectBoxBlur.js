/** 
 * Mixin which adds correct blur functionality for popups that get opened below a button by click on a button like SelectBox and MultiSelectBox
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxBlur", {
    construct: function () {
        this.addListener("disappear", this.close);
    },

    members: {
        _fixPopupBlur: function (control) {
            qxex.ui.core.Widget.registerLogicalChild(this, control);
            qxex.ui.core.Widget.registerPopupOpeningButton(this, control);
            control.setAutoHide(true);
        }
    }
});