/**
 * Resource management:
 * https://qooxdoo.org/documentation/6.0/#/desktop/gui/resources?id=using-qooxdoo-icons-with-widgets
 *
 * @asset(qx/icon/${qx.icontheme}/16/apps/preferences-clock.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/edit-delete.png)
 */
qx.Theme.define("qxex.theme.standard.AppearanceTangoAndOxygenIcons", {
  include: qxex.theme.commonbase.AppearanceBase,
  extend: qx.theme.modern.Appearance,
  appearances: {
    "datefield/button2": {
      style(states) {
        return {
          icon: "icon/16/actions/edit-delete.png",
          padding: [0, 3],
          decorator: undefined
        };
      }
    },

    "multilangtextfield/button": {
      style(states) {
        return {
          icon: "icon/16/actions/edit-delete.png",
          padding: [0, 3],
          decorator: undefined
        };
      }
    },

    "multiselectbox/allBtn": {
      include: "button",
      style(states) {
        return {
          icon: "decoration/form/checkbox-checked-focused.png"
        };
      }
    },

    "multiselectbox/noneBtn": {
      include: "button",
      style(states) {
        return {
          icon: "decoration/form/checkbox-focused-invalid.png"
        };
      }
    },

    "timechooser/slider/knob": {
      style(states) {
        return {
          source: "icon/16/apps/preferences-clock.png"
        };
      }
    },

    "timefield/button": {
      style(states) {
        return {
          // icon : "qxex/preferences-clock.png",					//copied
          // icon : "qx/icon/Tango/16/apps/preferences-clock.png",	//icon theme fixed
          icon: "icon/16/apps/preferences-clock.png", //using qooxdoo's original resource (themed), not copied one
          padding: [0, 3],
          decorator: undefined
        };
      }
    }
  }
});
