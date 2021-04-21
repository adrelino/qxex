/**
 * Switch themes easily
 * //asset(qxex/themes/96x48/*)
 * //asset(qx/icon/Tango/16/apps/preferences-clock.png)
 * //asset(qx/icon/Oxygen/16/apps/preferences-clock.png)
 */
qx.Class.define("qxex.ui.control.ThemeSelector",{
  extend : qx.ui.form.SelectBox,

  events :{
    /**
     * Fired after the new theme has been set.
     * Get the new theme with e.getData() (e.g. "qx.theme.Simple").
     */
    "changeTheme" : "qx.event.type.Data"
  },

  /**
   * @param availableThemes {String[] ?}  The names of the themes to hide.
   * @param type {String ? 'meta'} Whether 'meta' or 'icon' theme.
   */
  construct : function(availableThemes, type){
    this.base(arguments);

    var type = type || "meta";
    this.__type = type;

    var themesSet = new Set(availableThemes || []);
    
    var themes = qxex.util.ThemeManager.getAll(type);

    for(var i=0; i<themes.length; i++){
      var theme = themes[i];
      var name = theme.name;
      var title = theme.title;

      if(themesSet.size > 0 && !themesSet.has(name)){
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
        this.add(new qx.ui.form.ListItem(title,/*"qxex/themes/96x48/"+name+".png"*/null,name));
      }else if(type=="icon"){
        this.add(new qx.ui.form.ListItem(title,/*"qx/icon/"+title+"/16/apps/preferences-clock.png"*/null,name));
      }
    }

    this._updateTheme();

    this.addListener("changeSelection",function(e){
      var name = e.getData()[0].getModel();
      qxex.util.ThemeManager.setByName(name);
      this.fireDataEvent("changeTheme",name);
    },this);

    //listen for theme changes made somewhere else
    if (qx.core.Environment.get("qx.dyntheme")) {
      qx.theme.manager.Meta.getInstance().addListener("changeTheme", this._updateTheme, this);
    }
  },

  members : {
    __type : "",

    _updateTheme : function(){
      var children = this.getChildren();
      if(children.length){
        this.setModelSelection([qxex.util.ThemeManager.getCurrent(this.__type)]);
      }
    }
  },

  destruct : function() {
    if (qx.core.Environment.get("qx.dyntheme")) {
      qx.locale.Manager.getInstance().removeListener("changeTheme", this._updateTheme, this);
    }
  }
});