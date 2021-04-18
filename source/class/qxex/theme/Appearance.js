/* ************************************************************************

  Theme Additions for qxex

  Copyright:
      2021 Adrian Haarbach

  License:
     MIT

  Authors:
   * Adrian Haarbach (adrelino)

************************************************************************ */

/**
 * qxex theme.
 * 
 * Applications that use qxex.ui.form.TimeField should extend this theme in their Appearance.js
 */
qx.Theme.define("qxex.theme.Appearance", {
  appearances:
  {
    "watcheecaptionbar": "window/captionbar",
    "watcheeclosebutton": "window/close-button",
    "popup/close-button" : "watcheeclosebutton",

    "multiselectbox": "selectbox",

    "datechooser/type" : "multiselectbox",
    "datechooser/country" : "selectbox",
    "datechooser/state" : "selectbox",
    "datechooser/region" : "selectbox",

    "timechooser": "datechooser",
    "timechooser/slider": "slider",
    "timechooser/slider/knob": "image",

    "multilangtextfield": "combobox",

    "timefield": "datefield",
    "timefield/list": "timechooser"
  }
});