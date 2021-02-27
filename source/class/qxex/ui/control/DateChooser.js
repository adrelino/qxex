qx.Class.define("qxex.ui.control.DateChooser",
{
  extend: qx.ui.control.DateChooser,

  construct: function (date) {
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
    this.base(arguments, date);
    this._createChildControl("location-bar");
  },

  events: {
      "daytap" : "qx.event.type.Event"
  },

  members: {

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
          control.add(this.getChildControl("country").set({width:100}),{row:0, column:0});
          control.add(this.getChildControl("state"),{row:0, column:1});
          control.add(this.getChildControl("region"),{row:1, column:0, colSpan:2});
          this._add(control);
          break;

        case "country":
        case "state":
        case "region":
          control = this.__initLocation(id);
          break;
      }

      return control || this.base(arguments, id);
    },

    // overridden
    _updateDatePane: function () {
      this.base(arguments);
      this.__updateMonthHolidays();
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
        var public = this.hd.getHolidays().filter(function (h) { return h.type == "public"; });
        console.log(public.length);

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
      if (obj && id != "country") {
        keys.push("");
      }
      for (var key in obj) keys.push(key);
      control.removeAll();
      if(keys.length<=1){
        control.exclude();
      }else{
        control.show();
      }
      for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        var icon = (key && id!="region") ? "resource/qxex/region-flags/pngWx12px/" + args.concat([key]).join("-") + ".png" : null;
        var item = new qx.ui.form.ListItem(obj[key] || "", icon, key);
        control.add(item);
        if (key == this.location[id]) {
          control.setSelection([item]);
        }
      }
    },

    __updateMonthHolidays: function () {
      for (var week = 0; week < 6; week++) {
        for (var i = 0; i < 7; i++) {
          var dayLabel = this.__dayLabelArr[week * 7 + i];
          var helpDate = new Date(dayLabel.dateTime);
          var dayOfMonth = helpDate.getDate();

          var text = "" + dayOfMonth;

          var hs = this.hd.isHoliday(helpDate);

          if (hs) {
            var h = hs[0];
            var tooltipText = h.name + " (" + h.type + ")";
            if (h.note) tooltipText += " " + h.note;
            dayLabel.setToolTipText(tooltipText);
            //https://github.com/commenthol/date-holidays#types-of-holidays
            var color = "red";
            switch (h.type) {
              case "public": color = "red"; break;
              case "bank": color = "orange"; break;
              case "school": color = "yellow"; break;
              case "optional": color = "magenta"; break;
              case "observance": color = "blue"; break;
            }
            //text = "<div style='color:"+color+"'>"+text+"</div>";
            dayLabel.setTextColor(color);
            //dayLabel.addState("today");
          } else {
            dayLabel.setTextColor(null);
            //dayLabel.removeState("today");
            dayLabel.setToolTipText("");
          }

          dayLabel.setValue(text);
        }
      }
    }
  }
});