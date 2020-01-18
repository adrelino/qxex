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

    groupFilter :
    {
      check : "Function",
      init  : function(item) {
        return item.getUserData("filter").indexOf("47") > 0;
      }
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

    addFilterTextField : function(textField){

    //child controls
    var list = this.getChildrenContainer(); //same as this.getChildControl("list"); , is in AbstractSelectBox
    var popup = this.getChildControl("popup");

    this.__filterTextField = textField || new qx.ui.form.TextField();
    this.__filterTextField.addListener("changeValue", this._onFilterTextFieldChangeValue, this);
    
    // we fill the textfield by forwarding keyinputs and keypress (delete) to it so we dont have to give it focus,
    // which would interfere with the blur events
    if(!textField){
        this.addListener("keyinput", this._onInput, this);
        this.addListener("keydown", this._onKeyDown, this);
        this.__filterTextField.setAnonymous(true);
        this.__filterTextField.setKeepFocus(true);
        var atom = this.getChildControl("atom");
        //atom.setHeight(22);//atom.setMaxHeight(22);
    }

    this.__filterLabel = new qx.ui.basic.Label();

    var box = new qx.ui.container.Composite(new qx.ui.layout.HBox());
    if(!textField) box.add(this.__filterTextField,{flex:1});
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
      this.__filterCheckBox = new qx.ui.form.CheckBox(this.trc("checkbox","Group filter"));
      this.__filterCheckBox.setKeepFocus(true);
      this.__filterCheckBox.addListener("changeValue",this._onFilterCheckBoxChangeValue, this);
      this.__filterCheckBox.setToolTipText(this.trc("tooltip","Check to filter out entries based on group filter"))
      popup.addBefore(this.__filterCheckBox,list);
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

    //PUBLIC
    MIN_LIST_ITEMS_TO_SHOW_FILTER : 6, //we only display filter for 6 or more items

    setFilterText : function(filterText){
      this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 0; //if we set programmatically, we want to be able to remove filter again even if we have less than 5 entries!
      this.__filterTextField.setValue(filterText);
    },

    clearFilter : function(){
      this.__filterTextField.setValue("");
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
    __showFilter : false,
    __helpLabelEmpty : null,

    __filterList : function(filterText, filterCheckBoxValue){
      if(!this.__showFilter && !this.__filterCheckBox) return;
      var filterTextLower = filterText.toLowerCase();
      var count=0;
      var children = this.getChildren();
      children.forEach(function(item){
          var showText = filterTextLower.length == 0 || this.getSearchFilter()(item, filterTextLower);
          var showFilter = (this.__filterCheckBox == null || filterCheckBoxValue == false) || this.getGroupFilter()(item);
          if(showText && showFilter){
            item.show();
            count++;
          }
          else item.exclude();
      },this);

      var all=children.length;

      this.__filterLabel.setValue(count + "/" + all);
      if(count==0){
        this.__helpLabelEmpty.show();
      }else{
        this.__helpLabelEmpty.exclude();
      }
    },

    /**
     * Not called eg for "Shift" key hits
     */
    _onInput : function(e)
    {
      if(!this.__showFilter) return;
      var old = this.__filterTextField.getValue() || "";
      var newVal = old+e.getChar();
      this.__filterTextField.setValue(newVal);
    },

    // overridden
    _onKeyDown : function(e)
    {
      if(!this.__showFilter) return;
      var iden = e.getKeyIdentifier();
      if(iden=="Backspace"){
        var old = this.__filterTextField.getValue() || "";
        var newVal = old.slice(0, -1);
        this.__filterTextField.setValue(newVal);

        e.preventDefault();
        return;
      }
    }
  }
});