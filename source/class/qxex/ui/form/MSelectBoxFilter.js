/** 
 * Mixin which adds basic filtering functionality to SelectBox and MultiSelectBox
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxFilter", {

  properties : {

    displayFilterCheckBox :
    {
      check : "Boolean",
      init : false,
      apply : "_applyDisplayFilterCheckBox"
    },

    textFilterExcludeItems : // setTextFilterExcludeItems(false);
    {
      check : "Boolean",
      init : true
    },

    groupFilter :
    {
      check : "Function",
      init  : function(item) {
        return item && item.getUserData("filter") && item.getUserData("filter").indexOf("47") > 0;
      },
      apply : "_applyGroupFilter"
    },

    searchFilter :
    {
      check : "Function",
      init  : function(item, filterTextLower) {
        return item.getLabel().toLowerCase().indexOf(filterTextLower) > -1
      }
    }
  },

  members : { 

    addFilterTextField : function(textField, filterListFun){

    if(filterListFun) this.__filterList = filterListFun;

    //child controls
    var list = this.getChildControl("list");
    var popup = this.getChildControl("popup");

    this.__filterTextField = textField || new qx.ui.form.TextField();
    this.__filterTextField.addListener("changeValue", this._onFilterTextFieldChangeValue, this);
    
    //search as you type -> fire event on every keystroke
    this.__filterTextField.addListener("input",function(e){
        var newVal = this.__filterTextField.getValue() || "";
        this.__filterTextField.fireDataEvent("changeValue", newVal);
    },this);

    this.__filterLabel = new qx.ui.basic.Label();

    var box = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
    if(!textField){
        box.add(this.__filterTextField,{flex:1});
        this.__filterTextField.addListener("appear",function(e){
          this.__filterTextField.focus();
          this.__filterTextField.selectAllText();
        },this);
    }else{
        box.add(new qx.ui.basic.Label(this.tr("Search filter") + ": "));
    }
    box.add(this.__filterLabel);

    this.__filterTextField.setPlaceholder(this.tr("type to filter, backspace to clear"));
    box.setToolTipText(this.trc("tooltip","Start typing to filter list entries. Use backspace to undo filtering character-wise."))

    popup.addBefore(box,list);

    this.__helpLabelEmpty = new qx.ui.basic.Label(this.tr("Press backspace to clear the filter"));
    this.__helpLabelEmpty.setTextColor("red");
    this.__helpLabelEmpty.exclude();

    popup.addBefore(this.__helpLabelEmpty,list);

    popup.addListener("changeVisibility",function(e){
      var l = this.getChildren().length;
      if(l>=this.MIN_LIST_ITEMS_TO_SHOW_FILTER){
        this.__showFilter=true;
        box.show();
      }else{
        this.__showFilter=false;
        box.exclude();
      }
    },this);

    },

    addFilterCheckBox : function(){
      var list = this.getChildrenContainer();
      var popup = this.getChildControl("popup");
      this.__filterCheckBox = new qx.ui.form.CheckBox(this.tr("Group filter") + ": ");
      this.__filterCheckBox.setKeepFocus(true);
      this.__filterCheckBox.addListener("changeValue",this._onFilterCheckBoxChangeValue, this);
      this.__filterCheckBox.setToolTipText(this.trc("tooltip","Check to filter out entries based on group filter"));

      this.__filterLabelGroup = new qx.ui.basic.Label();
      var box = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
      box.add(this.__filterCheckBox,{flex:1});
      box.add(this.__filterLabelGroup);
      popup.addBefore(box,list);
    },

    _onFilterCheckBoxChangeValue : function(val){
      this.__filterList(this.__filterTextField.getValue() || "",val.getData());
    },

    _onFilterTextFieldChangeValue : function(val){
      this.__filterList(val.getData() || "",this.__filterCheckBox && this.__filterCheckBox.getValue());
    },

    _applyDisplayFilterCheckBox : function(value, old){
      if(value){
        this.__filterCheckBox ? this.__filterCheckBox.show() : this.addFilterCheckBox();
      }else{
        this.__filterCheckBox && this.__filterCheckBox.exclude();
      }
    },

    _applyGroupFilter : function(){
       this.__filterCheckBox && this.__filterCheckBox.fireDataEvent("changeValue",this.__filterCheckBox.getValue());   
    },

    //PUBLIC
    MIN_LIST_ITEMS_TO_SHOW_FILTER : 6, //we only display filter for 6 or more items

    setFilterText : function(filterText){
      this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 0; //if we set programmatically, we want to be able to remove filter again even if we have less than 5 entries!
      this.__filterTextField.setValue(filterText);
    },

    clearFilter : function(){
      this.__filterTextField.setValue("");
    },

    setGroupFilterCheckBoxValue : function(value){
      this.__filterCheckBox && this.__filterCheckBox.setValue(value);
    },

    open : function(){
      var popup = this.getChildControl("popup");
      //popup.setPlaceMethod("widget");
      //popup.setPosition("bottom-center");
      popup.setMaxWidth(Math.round(window.innerWidth*0.7));
      popup.placeToWidget(this, true);
      popup.show();
    },

    //PRIVATE
    __filterCheckBox : null,
    __filterTextField : null,
    __filterLabel : null,
    __filterLabelGroup : null,
    __showFilter : false,
    __helpLabelEmpty : null,

    __filterList : function(filterText, filterCheckBoxValue){
      if(!this.__showFilter && !this.__filterCheckBox) return;
      var filterTextLower = filterText.toLowerCase();
      var count=0;
      var countSearch=0;
      var countGroup=0;
      var children = this.getChildren();
      var selection = [];

      for(var i=0, l=children.length; i<l; i++){

          var item = children[i];

          var showText = filterTextLower.length == 0 || this.getSearchFilter()(item, filterTextLower);
          if(showText) countSearch++;

          var showFilter = (this.__filterCheckBox == null || filterCheckBoxValue == false) || this.getGroupFilter()(item);
          if(showFilter) countGroup++;


          if(showFilter){
            item.show();
            if (showText) {
              count++;
              selection.push(item);
            }else{
              this.isTextFilterExcludeItems() && item.exclude();
            }
          } else {
            item.exclude();
          }
      };

      if(!this.isTextFilterExcludeItems()){
         this.setIgnoreListChangeSelection && this.setIgnoreListChangeSelection(true); //ignore event
         var singleSelection = selection.length ? [selection[0]] : [];
         this.setSelection ? this.setSelection(singleSelection) : this.getChildControl("list").setSelection(singleSelection);
         this.setIgnoreListChangeSelection && this.setIgnoreListChangeSelection(false);
      }

      var all=children.length;

      this.__filterLabel.setValue(count + "/" + countGroup);
      this.__filterLabelGroup && this.__filterLabelGroup.setValue(countGroup + "/" + all);
      if(countSearch==0){
        this.__helpLabelEmpty.show();
      }else{
        this.__helpLabelEmpty.exclude();
      }
    }
  }
});