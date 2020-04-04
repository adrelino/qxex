qx.Class.define("qxex.util.LanguageManager",
{
	statics : {

		/**
		 * https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
		 */
		names : {
			"da" : "dansk",
			"de" : "Deutsch",
			"en" : "English",
			"es" : "español",
			"fr" : "français",
			"it" : "italiano",
			"ja" : "日本語",
			"pt" : "português",
			"ru" : "Русский",
			"vi" : "Tiếng Việt",
			"zh" : "中文"
		},


		getAll : function() {
			var locales = qx.locale.Manager.getInstance().getAvailableLocales();
			var languages = [];
			locales.forEach(function(name){
				if(name.length==2) languages.push({ title: this.names[name], name: name});
			},this);
			return languages;
	    },

	    getCurrent : function(){
	    	return qx.locale.Manager.getInstance().getLocale();
	    },

	    setByName : function(name) {
	    	qx.locale.Manager.getInstance().setLocale(name);
	    }
	}
});