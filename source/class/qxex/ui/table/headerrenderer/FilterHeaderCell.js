/**
 * A filter header cell composed of a TextField and optionally a CheckBox.
 */
qx.Class.define("qxex.ui.table.headerrenderer.FilterHeaderCell",
{
  extend : qx.ui.table.headerrenderer.HeaderCell,

  construct : function(renderCheckbox)
  {
    this.base(arguments);
    this.renderCheckbox = renderCheckbox;
    this.getLayout().setColumnFlex(2, 0); //the sort icon should be right aligned, so no flex
  },
  
  events : {
    "headerFilterTextFieldBlur" :"qx.event.type.Data",
    "filterTextChanged" :"qx.event.type.Data",
    "exactMatchChanged" :"qx.event.type.Data"
  },
  
  properties :
  {
    filterVisible :
    {
      check : "Boolean",
      init : true,
      apply : "_applyFilterVisible"
    },
    
    exactMatchVisible :
    {
      check : "Boolean",
      init : true,
      apply : "_applyExactMatchVisible"
    }
  },

  members :
  {
  	 // property modifier
    _applyFilterVisible : function(value, old){
    	if(value) this._showChildControl("filter");
    	else this.getChildControl("filter").hide(); //_excludeChildControl("filter");
    },
    
     // property modifier
    _applyExactMatchVisible : function(value, old){
    	if(value) this._showChildControl("exactMatchCheckBox");
    	else this.getChildControl("exactMatchCheckBox").hide(); //_excludeChildControl("filter");
    },
    
  	setFilterText : function(text){ //triggered kein event, ist für das kopieren bei colmove
  		this.getChildControl("filter").setValue(text);
  	},
  	
  	getFilterText : function(){
  		return this.getChildControl("filter").getValue();
  	},
  	
  	setExactMatch : function(value){ //triggered kein event, ist für das kopieren bei colmove
  		this.getChildControl("exactMatchCheckBox").setValue(value);
  	},
  	
  	getExactMatch : function(){
  		return this.getChildControl("exactMatchCheckBox").getValue();
  	},

    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "filter":
          if(this.renderCheckbox){

            control = new qx.ui.container.Composite(new qx.ui.layout.HBox(0).set({alignX: "center", alignY: "middle"})).set({
              focusable: true,
              height : 19
            });
            control.setToolTipText(this.trc("label", "click to toggle between 3 states: true, false, both"));

            var checkbox = new qxex.ui.form.TristateCheckBox().set({value:null});
            control.add(checkbox);

            // propagate focus
            control.addListener("focus", function() {
              checkbox.focus();
            });

            // propagate active state
            control.addListener("activate", function() {
              checkbox.activate();
            });

            control.setValue = function(val){
              checkbox.setValue(val);
            };

            control.getValue = function(){
              return checkbox.getValue();
            };
            
            control.addListener("click",function(){
              checkbox.execute();
            },this);
            
            checkbox.addListener("changeValue", function(event) {
              var text=event.getData();
              this.fireDataEvent("filterTextChanged",text);
            }, this);

          }else{
            control = new qx.ui.form.TextField().set({
              anonymous: false,
              allowShrinkX: true
            });
            control.setToolTipText(this.trc("label", "Enter texts which must match appropriate column:"));
            control.addListener("input", function(event) {
                var text=event.getData();
                this.fireDataEvent("filterTextChanged",text);
            }, this);
          }
          
          control.setPadding(0, 0, 0, 0);  
          this._add(control, {row: 1, column: 0, colSpan: 3});
        
          var events = ["pointerdown","tap","pointerup"];
          for(var i=0; i< events.length; i++){
            control.addListener(events[i], function(e) {
              e.stop(); //otherwise, the sorted state would change and column move would start
            },this);
          }
          
          control.addListener("blur",function(e){
            this.fireDataEvent("headerFilterTextFieldBlur",e);
          },this);

          break;

          
          
         case "exactMatchCheckBox":
          control = new qx.ui.form.CheckBox().set({
            anonymous: false//,
            //allowShrinkX: true
          });
          //control.setPadding(0, 0, 0, 0);
          
          control.setToolTipText(this.trc("label", "Whether text must match exactly"));
            control.addListener("input", function(event) {
          	var value=event.getData();
            this.fireDataEvent("exactMatchChanged",value);
            }, this);
        
          control.addListener("click", function(e) {
          		e.stop(); //otherwise, the sorted state would change   	
              },this);
         
          this._add(control, {row: 1, column: 3});
          break;
          
      }

      return control || this.base(arguments, id);
    }
  }
});