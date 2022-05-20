/**
 * Provides a set of languages and their names + flags.
 * Also has a "none" language.
 *
 * @asset(qxex/languageicons/flags/*.png)
 */
qx.Class.define("qxex.util.LanguageManager", {
  type: "singleton",
  extend: qx.core.Object,
  include: qx.locale.MTranslation,

  statics: {
    /**
     * https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
     */
    names: {
      da: "dansk",
      de: "Deutsch",
      en: "English",
      es: "español",
      fr: "français",
      it: "italiano",
      ja: "日本語",
      pt: "português",
      ru: "Русский",
      vi: "Tiếng Việt",
      zh: "中文"
    },

    none: "none"
  },

  members: {
    getAll(excludeNone) {
      var locales = qx.locale.Manager.getInstance().getAvailableLocales();
      var languages = [];
      if (!excludeNone) languages.push([this.tr("None"), "icon/16/actions/edit-delete.png", qxex.util.LanguageManager.none]);
      locales.forEach(function (name) {
        if (name.length == 2) {
          var label = qxex.util.LanguageManager.names[name] + " (" + name + ")";
          var icon = "qxex/languageicons/flags/" + name + ".png";
          var model = name;
          languages.push([label, icon, model]);
        }
      }, this);
      return languages;
    },

    getCurrent() {
      var locale = qx.locale.Manager.getInstance().getLocale();
      var lang = locale.split("_")[0];
      return lang;
    },

    setByName(name) {
      qx.locale.Manager.getInstance().setLocale(name);
    }
  }
});
