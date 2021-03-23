/*
 * Handles meta and icon themes
 *
 * based on _getThemeNames and _setThemes from 
 * https://qooxdoo.org/documentation/6.0/#/desktop/gui/theming?id=multi-theme-applications
 */
qx.Class.define("qxex.util.ThemeManager", {
	statics: {
		mergeTheme: function (themeMixin) {
			var themes = qx.Theme.getAll();
			for (var key in themes) {
				var theme = themes[key];
				if (theme.type === themeMixin.type) {
					// qx.Theme.include(theme, themeMixin);
					qx.Theme.patch(theme, themeMixin); //if we overwrite stuff
				}
			}
		},

		mergeThemes: function () {
			var themesA = [qxex.theme.AppearanceMaterialIcons, qxex.theme.AppearanceTangoAndOxygenIcons];
			var themes = qx.Theme.getAll();
			for (var key in themes) {
				var theme = themes[key];
				if (theme.type === themesA[0].type) {
					var themeMixin = theme.name.indexOf("qx.theme.tangible") == 0 ? themesA[0] : themesA[1];
					// qx.Theme.include(theme, themeMixin);
					qx.Theme.patch(theme, themeMixin); //if we overwrite stuff
				}
			}
		},

		getAll: function (type) {
			var type = type || "meta"; //meta or icon
			if (type == "icon") type = "other"; //somehow Oxygen and Tango dont have type defined, thus get other
			var onlyThemesWithCorrectType = [];
			var themes = qx.Theme.getAll();
			for (var key in themes) {
				var theme = themes[key];
				if (theme.type === type) {
					onlyThemesWithCorrectType.push(theme);
				}
			}
			return onlyThemesWithCorrectType;
		},

		getCurrent: function (type) {
			var type = type || "meta"; //meta or icon
			var Type = type[0].toUpperCase() + type.slice(1);
			return qx.theme.manager[Type].getInstance().getTheme().name;
		},

		setByName: function (theme_name) {
			var theme = qx.Theme.getByName(theme_name);
			if (theme) {
				var type = theme.type;
				if (type == "other") type = "icon"; //somehow Oxygen and Tango dont have type defined, thus get other
				var Type = type[0].toUpperCase() + type.slice(1);
				qx.theme.manager[Type].getInstance().setTheme(theme);
			}
		}
	}
});