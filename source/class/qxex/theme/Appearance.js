/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

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
        return {
          icon : "qx/icon/Oxygen/16/apps/preferences-clock.png",
          // icon : "qx/icon/Tango/16/apps/preferences-clock.png",
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