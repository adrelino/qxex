qx.Class.define("qxex.util.ThemeManager",
{
	statics : {
		mergeTheme : function(themeMixin){
	      var themes = qx.Theme.getAll();
	      for (var key in themes) {
	      	var theme = themes[key];
	      	if(theme.type === themeMixin.type){
	          // qx.Theme.include(theme, themeMixin);
	          qx.Theme.patch(theme,themeMixin); //if we overwrite stuff
	        }
	      }
	  },

	  	getAll : function() {
	  	  var onlyMetaThemes = [];
	      var themes = qx.Theme.getAll();
	      for (var key in themes) {
	        var theme = themes[key];
	        if (theme.type === "meta") {
	          onlyMetaThemes.push(theme);
	        }
	      }
	      return onlyMetaThemes;
	    },

	    getCurrent : function(){
	    	return qx.theme.manager.Meta.getInstance().getTheme().name;
	    },

	    setByName : function(theme_name) {
	      var theme = qx.Theme.getByName(theme_name);
	      if (theme) {
	        qx.theme.manager.Meta.getInstance().setTheme(theme);
	      }
	    }
	}
});