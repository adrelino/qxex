/**
 * Switch languages via a select box control.
 */
qx.Class.define("qxex.ui.control.LanguageSelector", {
  extend: qx.ui.form.SelectBox,

  events: {
    /**
     * Fired after the new locale has been set.
     * Get the new locale with e.getData() (e.g. "en").
     */
    changeLanguage: "qx.event.type.Data"
  },

  construct(opt_options) {
    super();
    var opt_options = opt_options || {};

    //var props = { width : 40, height: 30, scale : true};
    //this.getChildControl("atom").getChildControl("icon").set(props);

    qxex.util.LanguageManager.getInstance()
      .getAll(opt_options.excludeNone)
      .forEach(function (lang) {
        var item = new qx.ui.form.ListItem(lang[0], lang[1], lang[2]);
        //item.getChildControl("icon").set(props);
        this.add(item);
      }, this);

    this._updateLocale();

    this.addListener("changeSelection", e => {
      var name = e.getData()[0].getModel();
      this.fireDataEvent("changeLanguage", name);
      //if(qx.core.Environment.get("qx.dynlocale")){
      qxex.util.LanguageManager.getInstance().setByName(name);
      //}
    });

    // listen for locale changes made somewhere else
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().addListener("changeLocale", this._updateLocale, this);
    }
  },

  members: {
    _updateLocale(e) {
      this.setModelSelection([qxex.util.LanguageManager.getInstance().getCurrent()]);
    },

    /**
     * Get the current language
     * @return {String} language like "de", "en", etc.
     */
    getCurrentLanguage() {
      return this.getSelection()[0].getModel();
    },

    /**
     * Set the current language.
     * @param key {String} language like "de", "en", etc.
     */
    setCurrentLanguage(key) {
      this.setModelSelection([key]);
    }
  },

  destruct() {
    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().removeListener("changeLocale", this._updateLocale, this);
    }
  }
});
