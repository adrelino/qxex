/**
 * Provides holiday dates for specific country, region and subregion names + flags.
 * 
 * 2 letter country codes and regions from https://en.wikipedia.org/wiki/ISO_3166-2
 * currently Europe + US, CA, AU:
 * AT,BE,HR,BG,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,GB,US,CA,AU
 */
qx.Class.define("qxex.util.HolidayDateManager", {
	type: "singleton",
	extend: qx.core.Object,
	include: qx.locale.MTranslation,

	construct: function(){
		this.__init();
	},

	statics: {
		dynScriptUrls: ["resource/qxex/date-holidays/dist/umd.min.js"] //https://unpkg.com/date-holidays@2.0.0/dist/umd.min.js"]
	},

	members: {
		__libraryLoaded: false,
		__location : null,

		lazyLoadLibrary: function (callback, tthis) {
			var urls = this.self(arguments).dynScriptUrls;
			if (!this.__libraryLoaded) {
				var dynLoader = new qx.util.DynamicScriptLoader(urls);
				dynLoader.addListenerOnce('ready', function (e) {
					console.log("all scripts have been loaded!");
					this.__libraryLoaded = true;
					callback.call(tthis); //1st call
				}, this);
				dynLoader.addListener('failed', function (e) {
					var data = e.getData();
					console.log("failed to load " + data.script);
				});
				dynLoader.start();
			} else {
				callback.call(tthis); //all other calls
			}
		},

		__init: function(){
			var country = qx.locale.Manager.getInstance().getTerritory().toUpperCase();
			this.__location = { country: country, state: "", region: "" };
		},

		setLocation: function(id, value){
			this.__location[id] = value;
		},

		getLocation: function(id){
			return this.__location[id];
		}
	}
});