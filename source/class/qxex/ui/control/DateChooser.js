qx.Class.define("qxex.ui.control.DateChooser",
{
  extend: qx.ui.control.DateChooser,

  construct: function (date) {
    this.base(arguments, date);
    var urls = this.self(arguments).dynScriptUrls;
    if(urls && urls.length){
      var dynLoader = new qx.util.DynamicScriptLoader(urls);
      dynLoader.addListenerOnce('ready',function(e){
        console.log("all scripts have been loaded!");
        this.__init();
      },this);
      dynLoader.addListener('failed',function(e){
        var data = e.getData();
        console.log("failed to load "+data.script);
      });
      dynLoader.start();
    }else{
      this.__init(); //assume Holiday object is already available
    }
  },

  events: {
      "daytap" : "qx.event.type.Event"
  },

  statics: {
    dynScriptUrls : ["resource/qxex/date-holidays/dist/umd.min.js"] //https://unpkg.com/date-holidays@2.0.0/dist/umd.min.js"]
  },

  members: {

    __initialized : false,
    __locationHierarchy : null,
    __locationFunction: null,

    __init : function(){
    var country = qx.locale.Manager.getInstance().getTerritory().toUpperCase();
    this.location = { country: country, state: "", region: "" };
    this.lang = qx.locale.Manager.getInstance().getLanguage();
    //https://github.com/commenthol/date-holidays#holiday-object
    //https://github.com/commenthol/date-holidays-parser/blob/master/docs/Holidays.md
    this.hd = new Holidays(this.location["country"]);
    this.__locationHierarchy = ["country", "state", "region"];
    this.__locationFunction = {
      "country": this.hd.getCountries,
      "state": this.hd.getStates,
      "region": this.hd.getRegions
    };
    this._createChildControl("location-bar");
    this.__initialized = true;
    },

    _onDayTap : function(evt)
    {
      this.base(arguments,evt);
      this.fireEvent("daytap");
    },

    // overridden
    _createChildControlImpl: function (id, hash) {
      var control;

      switch (id) {
        case "day":
          control = this.base(arguments, id);
          control.setRich(true);
          break;

        case "location-bar":
          control = new qx.ui.container.Composite(new qx.ui.layout.Grid());
          control.add(new qx.ui.basic.Label(this.tr("Holiday")).set({width:100,textAlign:"center"}),{row:0, column:0});
          control.add(this.getChildControl("type"),{row:0, column:1});
          control.add(this.getChildControl("country").set({width:100}),{row:1, column:0});
          control.add(this.getChildControl("state"),{row:1, column:1});
          control.add(this.getChildControl("region"),{row:2, column:0, colSpan:2});
          this._add(control);
          break;

        case "country":
        case "state":
        case "region":
          control = this.__initLocation(id);
          break;

        case "type":
          control = new qxex.ui.form.MultiSelectBox();
          var types = this.__getHolidayType();
          for (var key in types){
            var item = new qx.ui.form.ListItem(types[key].label, null, key);//.set({rich:true});
            item.setTextColor(types[key].color);
            control.add(item);
          }
          control.setModelSelection(["public"]);
          control.addListener("changeSelection", function (e) {
            this.__updateMonthHolidays();
          },this);


      }

      return control || this.base(arguments, id);
    },

    // overridden
    _updateDatePane: function () {
      this.base(arguments);
      this.__initialized && this.__updateMonthHolidays();
    },

    __initLocation: function (id) {
      //id is country, state or region
      var control = new qxex.ui.form.FilterSelectBox();
      this.__updateLocation(id, control);

      control.addListener("changeSelection", function (e) {
        var item = e.getData();
        if (!item || item.length == 0) return;
        var key = item[0].getModel();
        this.location[id] = key;
        var args = [];
        for (var i = 0; i < this.__locationHierarchy.length; i++) {
          args.push(this.location[this.__locationHierarchy[i]]);
          if (this.__locationHierarchy[i] == id) break;
        }
        this.hd.init.apply(this.hd, args);
        var arrFiltered = this.hd.getHolidays().filter(function (h) { return h.type == "public"; });
        var color = this.__getHolidayType("public").color;
        var text = "<span style='color:"+color+"'>"+arrFiltered.length+"</span>";
        item[0].setLabel((item[0].getUserData("label") || "") + " ("+text+")");

        this.__updateMonthHolidays();
        for (var j=i+1; j<this.__locationHierarchy.length; j++){
          var nextLocationId = this.__locationHierarchy[j];
          nextLocationId && this.__updateLocation(nextLocationId);
        }
        
      }, this);

      return control;
    },

    __updateLocation: function (id, control) {
      var control = control || this.getChildControl(id);

      var fun = this.__locationFunction[id];
      var args = [];
      for (var i = 0; i < this.__locationHierarchy.length; i++) {
        if (this.__locationHierarchy[i] == id) break;  //if country need no args
        args.push(this.location[this.__locationHierarchy[i]]); //state needs country, region needs state and country
      }

      var obj = fun.apply(this.hd, args);  //getCountries(), getStates(country) or getRegions(country,state)
      var keys = []
      if (obj){//} && id != "country") {
        keys.push("");
      }
      for (var key in obj) keys.push(key);
      if(keys[0]=="") obj[""] = this.__getHolidayLocation(id,args[0]).label;
      control.removeAll();
      if(keys.length<=1){
        control.exclude();
      }else{
        control.show();
      }
      for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        var icon = (key && id!="region") ? "resource/qxex/region-flags/pngWx12px/" + args.concat([key]).join("-") + ".png" : null;
        var item = new qx.ui.form.ListItem(obj[key] || "", icon, key).set({rich:true});
        item.setUserData("label",obj[key]);
        control.add(item);
        if (key == this.location[id]) {
          control.setSelection([item]);
        }
      }
    },

    __getHolidayType: function(opt_key){
      var obj = {
        "public" :    {color: "#a60000", label: this.tr("Public holiday")}, //red  //gestzlicher Feiertag
        "bank" :      {color: "#a67f00", label: this.tr("Bank holiday")}, //orange
        "school" :    {color: "#00a62a", label: this.tr("School holiday")},//green
        "optional" :  {color: "#0045a6", label: this.tr("Optional holiday")},//blue
        "observance" :{color: "#6c00a6", label: this.tr("Observance day")}//magenta  //Gedenktag / Aktionstag
      }
      if(opt_key){
        return obj[opt_key];
      }
      return obj;
    },

    __getStateName: function(key){
      switch(key){
        case "US":
          return this.tr("U.S. states");
        case "CH":
          return this.tr("Cantons");//Kantone
        case "DE":
        case "AT":
        default:
          return this.tr("States");//Bundesländer
      }
    },

    __getHolidayLocation: function(id, opt_key){
      var obj = {
        "country" :   {label: this.tr("Country")},
        "state" :     {label: this.tr("All") + " " + this.__getStateName(opt_key)},
        "region" :    {label: this.tr("All") + " " + this.tr("Regions")}
      }
      if(id){
        return obj[id];
      }
      return obj;
    },

    __updateMonthHolidays: function () {
      var chosenTypes = this.getChildControl("type").getSelectionAsModelArr();

      for (var week = 0; week < 6; week++) {
        for (var i = 0; i < 7; i++) {
          var dayLabel = this.getChildControl("day#" + ((week*7)+i));
          var helpDate = new Date(dayLabel.dateTime);
          var dayOfMonth = helpDate.getDate();

          var text = "" + dayOfMonth;

          var hs = this.hd.isHoliday(helpDate);

          if (hs && chosenTypes.indexOf(hs[0].type)>=0) {
            var h = hs[0];
            var t = this.__getHolidayType(h.type);

            var tooltipText = h.name + " (" + t.label + ")";
            if (h.note) tooltipText += " " + h.note;
            dayLabel.setToolTipText(tooltipText);
            //https://github.com/commenthol/date-holidays#types-of-holidays
            dayLabel.setTextColor(t.color);
            dayLabel.addState("today");
          } else {
            dayLabel.setTextColor(null);
            dayLabel.removeState("today");
            dayLabel.setToolTipText("");
          }

          dayLabel.setValue(text);
        }
      }
    }
  }
});