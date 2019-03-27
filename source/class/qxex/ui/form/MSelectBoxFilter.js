/** 
 * Mixin which adds basic filtering functionality to SelectBox and MultiSelectBox
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxFilter", {

  construct : function()
  {

    //this.addListener("input", this._onInput, this);
    //var name = qx.core.Environment.get("browser.name");
    //var version = qx.core.Environment.get("browser.version");
    //fix in qooxdoo 2019-03-25 for Firefox 66
    this.hasInputEvent = true;//!(name=="firefox" && version=="66.0");
    if (this.hasInputEvent)
      this.addListener("keyinput", this._onInput, this); // OK in chrome, not fired in Firefox 66
    this.addListener("keydown", this._onKeyDown, this);

    //child controls
    var list = this.getChildrenContainer(); //same as this.getChildControl("list"); , is in AbstractSelectBox
    var popup = this.getChildControl("popup");

    this.__filterTextField = new qx.ui.form.TextField();
    // input: The event is fired on every keystroke modifying the value of the field.
    //this.__filterTextField.addListener("keyinput", this._onInput, this); // Does not help Firefox 66
    //this.__filterTextField.addListener("input", this._onInput, this); // Does not help Firefox 66
    //this.__filterTextField.addListener("changeValue", this._onInput, this); // Does not help Firefox 66
    
    // we fill the textfield by forwarding keyinputs and keypress (delete) to it so we dont have to give it focus,
    // which would interfere with the blur events
    this.__filterTextField.setAnonymous(true);
    this.__filterTextField.setKeepFocus(true);
    
    /*
    // is this ever called??
    this.__filterTextField.addListener("input",function(e){
      //this._onInput(e); ´
      var filterText = e.getData();
      this.__filterList(filterText);
    },this);
    */

    this.__filterLabel = new qx.ui.basic.Label();

    var box = new qx.ui.container.Composite(new qx.ui.layout.HBox());
    box.add(this.__filterTextField,{flex:1});
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

  members : { 

    //PUBLIC
    MIN_LIST_ITEMS_TO_SHOW_FILTER : 6, //we only display filter for 6 or more items

    setFilterText : function(filterText){
      this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 0; //if we set programmatically, we want to be able to remove filter again even if we have less than 5 entries!
      this.__filterTextField.setValue(filterText);
      this.__filterList(filterText);
    },

    clearFilter : function(){
      this.__filterTextField.setValue("");
      this.__filterList("");
    },

    open : function(){
      var popup = this.getChildControl("popup");
      //popup.setPlaceMethod("widget");
      //popup.setPosition("bottom-center");
      popup.setMaxWidth((window.innerWidth*0.7));
      popup.placeToWidget(this, true);
      popup.show();
    },

    //PRIVATE
    __filterTextField : null,
    __filterLabel : null,
    __showFilter : false,
    __helpLabelEmpty : null,

    __filterList : function(filterText){
      if(!this.__showFilter) return;
      var filterTextLower = filterText.toLowerCase();
      var count=0;
      var children = this.getChildren();
      children.forEach(function(item){
          var show = item.getLabel().toLowerCase().indexOf(filterTextLower) > -1;
          if(show){
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
      var old = this.__filterTextField.getValue() || "";
      var newVal = old+e.getChar();
      this.__filterTextField.setValue(newVal);
      this.__filterList(newVal);
      //forward to the filter:

      //       var clone = e.clone();
      //       clone.setTarget(this.__filterTextField);
      //       clone.setBubbles(false);
      //       this.__filterTextField.dispatchEvent(clone);
    },

    // overridden
    _onKeyDown : function(e)
    {
      var iden = e.getKeyIdentifier();
      if(iden=="Backspace"){
        var old = this.__filterTextField.getValue() || "";
        var newVal = old.slice(0, -1);
        this.__filterTextField.setValue(newVal);
        this.__filterList(newVal);

        e.preventDefault();
        return;
      }

      if (this.hasInputEvent)
        return;

      //var keyCode = e.getKeyCode();
      //if (keyCode < 32) {
      //  // _identifier: "Shift" _keyCode: 16
      //  return;
      //}
      var charEntered = e.getKeyIdentifier();
      if (charEntered.length > 1) {
        return; // "Shift" or "Meta" "AltGraph" etc
      }
      var old = this.__filterTextField.getValue() || "";
      //var charEntered = e.getChar();
      var newVal = old+charEntered;
      this.__filterTextField.setValue(newVal);
      this.__filterList(newVal);      

    }
  }
});