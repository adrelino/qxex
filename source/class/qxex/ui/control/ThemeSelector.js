/**
 * Switch themes easily
 * @asset(qxex/themes/40x30/*)
 * @asset(qx/icon/Tango/16/apps/preferences-clock.png)
 * @asset(qx/icon/Oxygen/16/apps/preferences-clock.png)
 */
qx.Class.define("qxex.ui.control.ThemeSelector",{
  extend : qx.ui.form.SelectBox,

  events :{
    /**
     * Fired after the new theme has been set.
     * Get the new theme with e.getData() (e.g. "qx.theme.Simple").
     */
    "changeValue" : "qx.event.type.Data"
  },

  construct : function(excludedThemeNamesArr, type){
    this.base(arguments);

    var type = type || "meta";
    this.__type = type;

    var excludedThemeNamesArr = excludedThemeNamesArr || [];
    
    var themes = qxex.util.ThemeManager.getAll(type);

    for(var i=0; i<themes.length; i++){
      var theme = themes[i];
      var name = theme.name;
      var title = theme.title;

      if(excludedThemeNamesArr.indexOf(name)>=0){
        continue; // theme excluded and not supported (e.g) qooxdoo intrinsic themes
      }

      if(!title){ //title was not set in meta theme description
        var components = name.split(".");
        title = components[components.length-1];
        if(title == "Theme"){ //lowest level namespace is nondescriptice, so use Uppercased first component
          title = components[0];
          title = title[0].toUpperCase() + title.substr(1);
        }
      }

      if(type=="meta"){
        this.add(new qx.ui.form.ListItem(title,"qxex/themes/40x30/"+name+".png",name));
      }else if(type=="icon"){
        this.add(new qx.ui.form.ListItem(title,"qx/icon/"+title+"/16/apps/preferences-clock.png",name));
      }
    }

    this._updateTheme();

    this.addListener("changeSelection",function(e){
      var name = e.getData()[0].getModel();
      qxex.util.ThemeManager.setByName(name);
      this.fireDataEvent("changeValue",name);
    },this);

    //listen for theme changes made somewhere else
    if (qx.core.Environment.get("qx.dyntheme")) {
      qx.theme.manager.Meta.getInstance().addListener("changeTheme", this._updateTheme, this);
    }
  },

  members : {
    _updateTheme : function(){
      this.setModelSelection([qxex.util.ThemeManager.getCurrent(this.__type)]);
    }
  },

  destruct : function() {
    if (qx.core.Environment.get("qx.dyntheme")) {
      qx.locale.Manager.getInstance().removeListener("changeTheme", this._updateTheme, this);
    }
  }
});