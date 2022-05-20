/**
 * A filter header cell composed of a TextField and optionally a CheckBox.
 */
qx.Class.define("qxex.ui.table.headerrenderer.FilterHeaderCell", {
  extend: qx.ui.table.headerrenderer.HeaderCell,

  construct() {
    super();
    this.getLayout().setColumnFlex(2, 0); //the sort icon should be right aligned, so no flex
  },

  events: {
    headerFilterTextFieldBlur: "qx.event.type.Data",
    filterTextChanged: "qx.event.type.Data",
    exactMatchChanged: "qx.event.type.Data"
  },

  properties: {
    filterVisible: {
      check: "Boolean",
      init: true,
      apply: "_applyFilterVisible"
    },

    renderCheckbox: {
      check: "Boolean",
      init: false,
      apply: "_applyRenderCheckbox"
    },

    exactMatchVisible: {
      check: "Boolean",
      init: true,
      apply: "_applyExactMatchVisible"
    }
  },

  members: {
    // property modifier
    _applyFilterVisible(value) {
      if (value) this._showChildControl("filter");
      else this.getChildControl("filter").hide(); //_excludeChildControl("filter");
    },

    // property modifier
    _applyExactMatchVisible(value) {
      if (value) this._showChildControl("exactMatchCheckBox");
      else this.getChildControl("exactMatchCheckBox").hide(); //_excludeChildControl("filter");
    },

    // property modifier
    _applyRenderCheckbox(value, old) {
      if (value == old) return;
      var stack = this.getChildControl("filter");
      stack.setSelection([value ? this.getChildControl("checkbox") : this.getChildControl("textfield")]);
    },

    setFilterText(text) {
      //triggered kein event, ist für das kopieren bei colmove
      this.getChildControl("filter").getSelection()[0].setValue(text);
    },

    getFilterText() {
      return this.getChildControl("filter").getSelection()[0].getValue();
    },

    setExactMatch(value) {
      //triggered kein event, ist für das kopieren bei colmove
      this.getChildControl("exactMatchCheckBox").setValue(value);
    },

    getExactMatch() {
      return this.getChildControl("exactMatchCheckBox").getValue();
    },

    // overridden
    _createChildControlImpl(id) {
      var control;

      switch (id) {
        case "filter":
          control = new qx.ui.container.Stack();
          control.add(this.getChildControl("checkbox"));
          var textField = this.getChildControl("textfield");
          control.add(textField);
          control.setSelection([textField]);
          this._add(control, {row: 1, column: 0, colSpan: 3});
          break;

        case "checkbox":
          control = new qx.ui.container.Composite(new qx.ui.layout.HBox(0).set({alignX: "center", alignY: "middle"})).set({
            focusable: true,
            height: 19
          });

          control.setToolTipText(this.trc("label", "click to toggle between 3 states: true, false, both"));

          var checkbox = new qxex.ui.form.TristateCheckBox().set({value: null});
          control.add(checkbox);

          // propagate focus
          control.addListener("focus", function () {
            checkbox.focus();
          });

          // propagate active state
          control.addListener("activate", function () {
            checkbox.activate();
          });

          control.setValue = function (val) {
            checkbox.setValue(val);
          };

          control.getValue = function () {
            return checkbox.getValue();
          };

          control.addListener("click", () => {
            checkbox.execute();
          });

          checkbox.addListener("changeValue", event => {
            var text = event.getData();
            this.fireDataEvent("filterTextChanged", text);
          });
          break;

        case "textfield":
          control = new qx.ui.form.TextField().set({
            anonymous: false,
            allowShrinkX: true
          });

          control.setPlaceholder(this.tr("[search]"));
          control.setToolTipText(this.trc("label", "Enter texts which must match appropriate column:"));
          control.addListener("input", event => {
            var text = event.getData();
            this.fireDataEvent("filterTextChanged", text);
          });
          break;

        case "exactMatchCheckBox":
          control = new qx.ui.form.CheckBox().set({
            anonymous: false //,
            //allowShrinkX: true
          });
          //control.setPadding(0, 0, 0, 0);

          control.setToolTipText(this.trc("label", "Whether text must match exactly"));
          control.addListener("input", event => {
            var value = event.getData();
            this.fireDataEvent("exactMatchChanged", value);
          });

          control.addListener("click", e => {
            e.stop(); //otherwise, the sorted state would change
          });

          this._add(control, {row: 1, column: 3});
          break;
      }

      if (id == "checkbox" || id == "textfield") {
        control.setPadding(0, 0, 0, 0);

        var events = ["pointerdown", "tap", "pointerup"];
        for (var i = 0; i < events.length; i++) {
          control.addListener(
            events[i],
            function (e) {
              e.stop(); //otherwise, the sorted state would change and column move would start
            },
            this
          );
        }

        control.addListener("blur", e => {
          this.fireDataEvent("headerFilterTextFieldBlur", e);
        });
      }

      return control || super._createChildControlImpl(id);
    }
  }
});
