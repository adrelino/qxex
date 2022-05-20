/**
 * Mixin to enable context menu for specific classes globally withouth patching qooxdoo code.
 *
 * To enable conextMenu for TextField and TextArea, call at start of application:
 * qx.Class.include(qx.ui.form.AbstractField, qxex.ui.form.MNativeContextMenu);
 */
qx.Mixin.define("qxex.ui.form.MNativeContextMenu", {
  construct() {
    this.set({nativeContextMenu: true});
  }
});
