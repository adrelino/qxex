/**
 * Switch languages via a select box control.
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

    //var props = { width : 40, height: 30, scale : true};
    //this.getChildControl("atom").getChildControl("icon").set(props);

    qxex.util.LanguageManager.getInstance().getAll().forEach(function(lang){
      var item = new qx.ui.form.ListItem(lang[0],lang[1],lang[2]);
      //item.getChildControl("icon").set(props);
      this.add(item);
    },this);

    this._updateLocale();

    this.addListener("changeSelection",function(e){
      var name = e.getData()[0].getModel();
      //if(qx.core.Environment.get("qx.dynlocale")){
        qxex.util.LanguageManager.getInstance().setByName(name);
      //}
      this.fireDataEvent("changeValue",name);
    },this);

    // listen for locale changes made somewhere else
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().addListener("changeLocale", this._updateLocale, this);
    }
  },

  members : {
    _updateLocale : function(){
      this.setModelSelection([qxex.util.LanguageManager.getInstance().getCurrent()]);
    },

    /**
     * Get the current language
     * @return {String} language like "de", "en", etc.
     */
    getCurrentLanguage : function(){
      return this.getSelection()[0].getModel();
    },
    
    /**
     * Set the current language.
     * @param key {String} language like "de", "en", etc.
     */
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