/**
 * Switch languages easily
 * @asset(qxex/languageicons/flags/*)
 */
qx.Class.define("qxex.ui.control.LanguageSelector",{
  extend : qx.ui.form.SelectBox,

  events :{
    /**
     * Fired after the new locale has been set.
     * Get the new locale with e.getData() (e.g. "en").
     */
    "changeValue" : "qx.event.type.Data"
  },

  construct : function(){
    this.base(arguments);

    var props = { width : 40, height: 30, scale : true};

    this.getChildControl("atom").getChildControl("icon").set(props);

    qxex.util.LanguageManager.getAll().forEach(function(locale){
      var item = new qx.ui.form.ListItem(locale.title + " ("+locale.name+")","qxex/languageicons/flags/"+locale.name+".png",locale.name);
      item.getChildControl("icon").set(props);
      this.add(item);
    },this,this);

    this._updateLocale();

    this.addListener("changeSelection",function(e){
      var name = e.getData()[0].getModel();
      if(qx.core.Environment.get("qx.dynlocale")){
        qxex.util.LanguageManager.setByName(name);
      }
      this.fireDataEvent("changeValue",name);
    },this);

    // listen for locale changes made somewhere else
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().addListener("changeLocale", this._updateLocale, this);
    }
  },

  members : {
    _updateLocale : function(){
      this.setModelSelection([qxex.util.LanguageManager.getCurrent()]);
    },

    getCurrentLanguage : function(){
      return this.getSelection()[0].getModel();
    },

    setCurrentLanguage : function(key){
      this.setModelSelection([key]);
    }
  },

  destruct : function() {
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().removeListener("changeLocale", this._updateLocale, this);
    }
  }
});