/** 
 * Mixin which adds basic filtering functionality to SelectBox and MultiSelectBox
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxFilter", {

  construct : function()
  {

    this.addListener("keyinput", this._MonKeyInput, this);
    this.addListener("keypress", this._MonKeyPress, this);

    //child controls
    var list = this.getChildrenContainer(); //same as this.getChildControl("list"); , is in AbstractSelectBox
    var popup = this.getChildControl("popup");

    this.__filterTextField = new qx.ui.form.TextField();
    
    // we fill the textfield by forwarding keyinputs and keypress (delete) to it so we dont have to give it focus,
    // which would interfere with the blur events
    this.__filterTextField.setAnonymous(true);
    this.__filterTextField.setKeepFocus(true);
    
    this.__filterTextField.addListener("input",function(e){
         var filterText = e.getData();
         this.__filterList(filterText);
    },this);

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

    _MonKeyInput : function(e)
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
    _MonKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();
      if(iden=="Backspace"){
        var old = this.__filterTextField.getValue() || "";
        var newVal = old.slice(0, -1);
        this.__filterTextField.setValue(newVal);
        this.__filterList(newVal);

        e.preventDefault();
      }
    }
  }
});