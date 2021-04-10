/**
 * All available icons: https://marella.me/material-icons/demo/
 * 
 * qooxdoo/framework/source/class/qx/theme/tangible/Appearance.js
 * qooxdoo/framework/source/class/qx/theme/tangible/Image.js
 */
qx.Theme.define("qxex.theme.AppearanceMaterialIcons", {
  extend: qxex.theme.Appearance,
  appearances:
  {
    "datefield/button2":
    {
      style: function (states) {
        return {
          icon: "@MaterialIcons/delete_forever/14",
          padding: [0, 0, 0, 0],
          backgroundColor: undefined,
          decorator: undefined,
          width: 16
        };
      }
    },

    "multilangtextfield/button":
    {
      style: function (states) {
        return {
          icon: "@MaterialIcons/do_not_disturb/14",
          padding: [0, 0, 0, 0],
          backgroundColor: undefined,
          decorator: undefined,
          width: 16
        };
      }
    },

    "timechooser/slider/knob":
    {
      style: function (states) {
        return {
          source: "@MaterialIcons/access_time/16",
          width: 16,
          height: 16
        };
      }
    },

    "timefield/button":
    {
      style: function (states) {
        return {
          icon: "@MaterialIcons/access_time/14",
          padding: [0, 0, 0, 0],
          backgroundColor: undefined,
          decorator: undefined,
          width: 16
        };
      }
    }
  }
});