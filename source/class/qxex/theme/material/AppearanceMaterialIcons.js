/**
 * All available icons: https://marella.me/material-icons/demo/
 *
 * qooxdoo/framework/source/class/qx/theme/tangible/Appearance.js
 * qooxdoo/framework/source/class/qx/theme/tangible/Image.js
 */
qx.Theme.define("qxex.theme.material.AppearanceMaterialIcons", {
  include: qxex.theme.commonbase.AppearanceBase,
  extend: qx.theme.tangible.Appearance,
  appearances: {
    "datefield/button2": {
      style(states) {
        return {
          icon: "@MaterialIcons/delete_forever/14",
          padding: [0, 0, 0, 0],
          backgroundColor: undefined,
          decorator: undefined,
          width: 16
        };
      }
    },

    "multilangtextfield/button": {
      style(states) {
        return {
          icon: "@MaterialIcons/do_not_disturb/14",
          padding: [0, 0, 0, 0],
          backgroundColor: undefined,
          decorator: undefined,
          width: 16
        };
      }
    },

    "multiselectbox/allBtn": {
      include: "button",
      style(states) {
        return {
          icon: qx.theme.tangible.Image.URLS["checkbox-checked"]
        };
      }
    },

    "multiselectbox/noneBtn": {
      include: "button",
      style(states) {
        return {
          icon: qx.theme.tangible.Image.URLS["checkbox-blank"]
        };
      }
    },

    "timechooser/slider/knob": {
      style(states) {
        return {
          source: "@MaterialIcons/access_time/16",
          width: 16,
          height: 16
        };
      }
    },

    "timefield/button": {
      style(states) {
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
