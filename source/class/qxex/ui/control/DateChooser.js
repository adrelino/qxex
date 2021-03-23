/**
 * @asset(qxex/region-flags/pngWx12px/*)
 */
qx.Class.define("qxex.ui.control.DateChooser",
{
  extend: qx.ui.control.DateChooser,

  construct: function (date) {
    this.base(arguments, date);
    qxex.util.HolidayDateManager.getInstance().runAsync(function(){
      this.__init();
    },this);
  },

  events: {
      "daytap" : "qx.event.type.Event"
  },

  members: {

    __initialized : false,
    __locationHierarchy : null,
    __locationFunction: null,

    __init : function(){
      var man = qxex.util.HolidayDateManager.getInstance();
      this.__locationHierarchy = ["country", "state", "region"];
      this.__locationFunction = {
        "country": man.hd.getCountries,
        "state": man.hd.getStates,
        "region": man.hd.getRegions
      };
      this._createChildControl("location-bar");
      this.__initialized = true;
      this.__updateMonthHolidays();
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
        var man = qxex.util.HolidayDateManager.getInstance();
        var i = man.setLocation(id,key);
        var arrFiltered = man.hd.getHolidays().filter(function (h) { return h.type == "public"; });
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

      var man = qxex.util.HolidayDateManager.getInstance();
      var fun = this.__locationFunction[id];
      var args = [];
      for (var i = 0; i < this.__locationHierarchy.length; i++) {
        if (this.__locationHierarchy[i] == id) break;  //if country need no args
        args.push(man.getLocation(this.__locationHierarchy[i])); //state needs country, region needs state and country
      }

      var obj = fun.apply(man.hd, args);  //getCountries(), getStates(country) or getRegions(country,state)
      var keys = [];
      if (obj){ //} && id != "country") {
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
        var icon = (key && id!="region") ? "qxex/region-flags/pngWx12px/" + args.concat([key]).join("-") + ".png" : null;
        var item = new qx.ui.form.ListItem(obj[key] || "", icon, key).set({rich:true});
        item.setUserData("label",obj[key]);
        control.add(item);
        if (key == man.getLocation(id)) {
          control.setSelection([item]);
        }
      }
    },

    __getHolidayType: function(opt_key){
      var obj = {
        "public" :    {color: "#a60000", label: this.tr("Public holiday")}, //red  //gestzlicher Feiertag
        "bank" :      {color: "#a67f00", label: this.tr("Bank holiday")}, //orange
        "school" :    {color: "#00a62a", label: this.tr("School holiday")},//green  //Schulfrei
        "optional" :  {color: "#0045a6", label: this.tr("Optional holiday")},//blue
        "observance" :{color: "#6c00a6", label: this.tr("Observance day")}//magenta  //Gedenktag / Aktionstag / Kirchenfest / kirchlicher Feiertag
      };
      if(opt_key){
        return obj[opt_key];
      }
      return obj;
    },

    /*
     * Translations based on corresponding German wiki
     * https://en.wikipedia.org/wiki/ISO_3166-2:AU
     * https://www.iso.org/obp/ui/#iso:code:3166:AU
     */
    __getStateName: function(key){
      switch(key){
        case "AT":
        case "DE":
          return this.tr("federated states");//Bundesländer
        case "AU": 
          return this.tr("states and territories");//Bundesstaaten und Territorien
        case "BE":
        case "IT":
          return this.tr("regions");
        case "CA":
          return this.tr("provinces and territories");//Provinzen und Territorien
        case "CH":
          return this.tr("cantons");//Kantone
        case "ES":
          return this.tr("autonomous communities");//autonome Gemeinschaften
        case "FR":
          return this.tr("departments and overseas regions");//Départements und 5 Übersee-Regionen 
        case "GB":
          return this.tr("countries and provinces");//Landesteile   //alternative: constituent countries
        case "US":
          return this.tr("U.S. states");
        default:
          return this.tr("states");
      }
    },

    __getHolidayLocation: function(id, opt_key){
      var obj = {
        "country" :   {label: this.tr("Country")},
        "state" :     {label: this.tr("All") + " " + this.__getStateName(opt_key)},
        "region" :    {label: this.tr("All") + " " + this.tr("Regions")}
      };
      if(id){
        return obj[id];
      }
      return obj;
    },

    __updateMonthHolidays: function () {
      var chosenTypes = this.getChildControl("type").getSelectionAsModelArr();

      var man = qxex.util.HolidayDateManager.getInstance();

      for (var week = 0; week < 6; week++) {
        for (var i = 0; i < 7; i++) {
          var dayLabel = this.getChildControl("day#" + ((week*7)+i));
          var helpDate = new Date(dayLabel.dateTime);
          var dayOfMonth = helpDate.getDate();

          var text = "" + dayOfMonth;

          var hs = man.hd.isHoliday(helpDate);

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