/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * @asset(qx/icon/${qx.icontheme}/16/apps/preferences-clock.png)
 */
qx.Theme.define("qxex.theme.Appearance",
{
  extend : qx.theme.modern.Appearance,

  appearances :
  {
  	"watcheetimefield" : "combobox",

    "watcheetimefield/button" :
    {
      alias : "combobox/button",
      include : "combobox/button",

      style : function(states)
      {
      	//http://manual.qooxdoo.org/current/pages/desktop/ui_resources.html
        return {
          // icon : "qxex/preferences-clock.png", //TODO: use qooxdoo's original resource (themed), not copied one
          // icon : "qx/icon/Tango/16/apps/preferences-clock.png",
          icon : "icon/16/apps/preferences-clock.png",
          padding : [0, 3],
          decorator : undefined
        };
      }
    },

    "watcheetimefield/textfield" : "combobox/textfield",

    "watcheetimefield/list" :
    {
      alias : "datechooser",
      include : "datechooser",

      style : function(states)
      {
        return {
          decorator : undefined
        }
      }
    }

  }
});