/* ************************************************************************

   Authors:
     * Adrian Haarbach (adrelino)

************************************************************************ */

/**
 * A *text field* wich can handle strings in multiple languages. Useful to define translations.
 */
qx.Class.define("qxex.ui.form.MultiLangTextField",
  {
    extend: qx.ui.form.ComboBox,
    construct: function () {
      this.base(arguments);
      this.__items = {};
      qxex.util.LanguageManager.getInstance().getAll().forEach(function (lang) {
        // var langName = lang[0]; // "Deutsch (de)"
        // var langIconUrl = lang[1]; // "qxex/languageicons/flags/de.png"
        // var localeId = lang[2]; // "de"
        var item = new qx.ui.form.ListItem(null, lang[1], lang[2]);
        item.setToolTipText(lang[0]);
        this.__items[lang[2]] = item;
        this.add(item);
      }, this, this);
      qx.locale.Manager.getInstance().addListener("changeLocale", this._updateLocale, this);
      this._updateLocale();
      var textField = this.getChildControl("textfield");
      textField.addListener("input", function (e) {
        var item = this.__items[this.__currentLang];
        if(item) item.setLabel(textField.getValue());
      }, this);
    },

    properties: {
      appearance:
      {
        refine: true,
        init: "multilangtextfield"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members:
    {
      __items : null,
      __currentLang : null,
      /**
       * Set the value in the language lang.
       * @param value {String} The value in the language lang
       * @param lang {String ? 'none'}
       */
      setValue: function (value, lang) {
        var lang = lang || qxex.util.LanguageManager.none;
        if (this.__items[lang]) {
          this.__items[lang].setLabel(value);
        }
        if (this.__currentLang == lang) {
          this.getChildControl("textfield").setValue(value);
        }
      },

      /**
       * Get the value in the language lang.
       * @param lang {String ? 'none'}
       * @return {String} The value in the language lang.
       */
      getValue: function (lang) {
        var lang = lang || qxex.util.LanguageManager.none;
        if (this.__items[lang]) {
          return this.__items[lang].getLabel();
        }
      },

      _onListChangeSelection: function (e) {
        var current = e.getData();
        if (current.length > 0) {
          var item = current[0];
          var label = item.getLabel();
          var name = item.getModel();
          this.__currentLang = name;
          var icon = item.getIcon();
          this.getChildControl("button").setIcon(icon);
          this.setToolTipText(item.getToolTipText());
          this.getChildControl("textfield").setValue(label);
        }
      },

      _updateLocale: function () {
        var lang = qxex.util.LanguageManager.getInstance().getCurrent();
        var item = this.__items[lang];
        if(item){
          this.getChildControl("list").setSelection([]);
        }
      }
    }
  });