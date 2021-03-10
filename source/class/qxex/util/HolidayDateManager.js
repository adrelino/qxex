/**
 * Provides holiday dates for specific country, region and subregion names + flags.
 * 
 * 2 letter country codes and regions from https://en.wikipedia.org/wiki/ISO_3166-2
 * currently Europe + US, CA, AU:
 * AT,BE,HR,BG,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,GB,US,CA,AU
 *
 * https://github.com/commenthol/date-holidays#holiday-object
 * https://github.com/commenthol/date-holidays-parser/blob/master/docs/Holidays.md 
 *
 * @asset(qxex/date-holidays/dist/umd.min.js)
 */
qx.Class.define("qxex.util.HolidayDateManager", {
	type: "singleton",
	extend: qx.core.Object,
	include: qx.locale.MTranslation,

	construct: function(){
		this.__idToIdx = {
			"country" : 0,
			"state" : 1,
			"region" : 2
		};
		this.__args = [];
		this.__lazyLoadLibrary(this.__init,this);
	},

	statics: {
		dynScriptUrls: ["qxex/date-holidays/dist/umd.min.js"] //https://unpkg.com/date-holidays@2.0.0/dist/umd.min.js"]
	},

	events: {
		"initialized": "qx.event.type.Event",
		"changeLocation": "qx.event.type.Event"
	},


	members: {
		__libraryLoaded: false,
		__args : null,
		__idToIdx : null,
		hd : null,

		__lazyLoadLibrary: function (callback, tthis) {
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
			var territory = qx.locale.Manager.getInstance().getTerritory().toUpperCase();
			this.__args = [territory];
			//if(typeof Holidays == "undefined") return;
			this.hd = new Holidays();
			var countries = this.hd.getCountries();
			var chosenCountry = countries[territory];
			if(!chosenCountry){
			  console.log(territory + "does not exist in holidays");
			}else{
			  console.log("getting holidays for " + territory +  " " + chosenCountry);
			}
			this.hd.init(this.getLocation("country"));
			this.fireEvent("initialized");
		},

		setLocation: function(id, value){
			var idx = this.__idToIdx[id];
			this.__args[idx] = value;
			for (var i = idx+1; i < this.__args.length; i++) {
				//if id==country, set state and region = null
				//if id==state, set region = null
				this.__args[i] = null; 
			}
			this.hd.init.apply(this.hd, this.__args);
			this.fireEvent("changeLocation");
			return idx;
		},

		getLocation: function(id){
			return this.__args[this.__idToIdx[id]];
		},

		__formatDate: function(date){
			var fmt = qx.locale.Date.getDateFormat("medium", qx.locale.Manager.getInstance().getLocale());
			fmt = "EE " + fmt;
			var df = new qx.util.format.DateFormat(fmt);
			var str = df.format(date);

			if(typeof Holidays == "undefined") return str;
			var holiday = this.hd.isHoliday(date);
			if(holiday){
			  str = "<b>" + str + " (" + holiday[0].name + ")<b/>";
			}
			return str;
		},

		runAsync: function(callback, tthis){
			if(this.__libraryLoaded){
				callback.call(tthis);
			}else{
				this.addListenerOnce("initialized",function(){
					callback.call(tthis);
				},this);
			}
		},

		formatDateAsync: function(date,callback,tthis){
			if(this.__libraryLoaded){
				callback.call(tthis,this.__formatDate(date));
			}else{
				this.addListenerOnce("initialized",function(){
					callback.call(tthis,this.__formatDate(date));
				},this);
			}
		}
	}
});