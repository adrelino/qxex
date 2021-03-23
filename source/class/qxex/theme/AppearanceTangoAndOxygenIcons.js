/**
 * Resource management:
 * https://qooxdoo.org/documentation/6.0/#/desktop/gui/resources?id=using-qooxdoo-icons-with-widgets
 * 
 * @asset(qx/icon/${qx.icontheme}/16/apps/preferences-clock.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/edit-delete.png)
 */
qx.Theme.define("qxex.theme.AppearanceTangoAndOxygenIcons", {
  extend: qxex.theme.Appearance,
  appearances:
  {
    "datefield/button2":
    {
      style: function (states) {
        return {
          icon: "icon/16/actions/edit-delete.png",
          padding: [0, 3],
          decorator: undefined
        };
      }
    },

    "multilangtextfield/button":
    {
      style: function (states) {
        return {
          icon: "icon/16/actions/edit-delete.png",
          padding: [0, 3],
          decorator: undefined
        };
      }
    },

    "timechooser/slider/knob":
    {
      style: function (states) {
        return {
          source: "icon/16/apps/preferences-clock.png"
        };
      }
    },

    "timefield/button":
    {
      style: function (states) {
        return {
          // icon : "qxex/preferences-clock.png",					//copied
          // icon : "qx/icon/Tango/16/apps/preferences-clock.png",	//icon theme fixed
          icon: "icon/16/apps/preferences-clock.png",				//using qooxdoo's original resource (themed), not copied one
          padding: [0, 3],
          decorator: undefined
        };
      }
    }
  }
});