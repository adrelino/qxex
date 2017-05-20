/** 
 * Mixin which adds basic filtering functionality to SelectBox and MultiSelectBox
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxFilter", {

  construct : function()
  {

    this.addListener("keyinput", this._MonKeyInput, this);
    this.addListener("keypress", this._MonKeyPress, this);

    this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 6; //we only display filter for 6 or more items

    this.showFilter=false;

    //child controls
    var list = this.getChildrenContainer(); //same as this.getChildControl("list"); , is in AbstractSelectBox
    var popup = this.getChildControl("popup");

    this.filterTextField = new qx.ui.form.TextField();
    
    // we fill the textfield by forwarding keyinputs and keypress (delete) to it so we dont have to give it focus,
    // which would interfere with the blur events
    this.filterTextField.setAnonymous(true);
    this.filterTextField.setKeepFocus(true);
    
    this.filterTextField.addListener("input",function(e){
         var filterText = e.getData();
         this.filterList(filterText);
    },this);

    this.filterLabel = new qx.ui.basic.Label();

    var box = new qx.ui.container.Composite(new qx.ui.layout.HBox());
    box.add(this.filterTextField,{flex:1});
    box.add(this.filterLabel);

    this.filterTextField.setPlaceholder(this.tr("type to filter, backspace to clear"));
    box.setToolTipText(this.trc("tooltip","Start typing to filter list entries. Use backspace to undo filtering character-wise."))

    popup.addBefore(box,list);

    this.helpLabelEmpty = new qx.ui.basic.Label(this.tr("Press backspace to clear the filter"));
    this.helpLabelEmpty.setTextColor("red");
    this.helpLabelEmpty.exclude();

    popup.addBefore(this.helpLabelEmpty,list);

    popup.addListener("changeVisibility",function(e){
      var l = this.getChildren().length;
      if(l>=this.MIN_LIST_ITEMS_TO_SHOW_FILTER){
        this.showFilter=true;
        box.show();
      }else{
        this.showFilter=false;
        box.exclude();
      }
    },this);

  },

  members :
  {
    filterTextField : null,
    helpLabelEmpty : null,

    clearFilter : function(){
      this.filterTextField.setValue("");
      this.filterList("");
    },

    filterList : function(filterText){
      if(!this.showFilter) return;
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

      this.filterLabel.setValue(count + "/" + all);
      if(count==0){
        this.helpLabelEmpty.show();
      }else{
        this.helpLabelEmpty.exclude();
      }
    },

    _MonKeyInput : function(e)
    {
      var old = this.filterTextField.getValue() || "";
      var newVal = old+e.getChar();
      this.filterTextField.setValue(newVal);
      this.filterList(newVal);
      //forward to the filter:

//       var clone = e.clone();
//       clone.setTarget(this.filterTextField);
//       clone.setBubbles(false);
//       this.filterTextField.dispatchEvent(clone);
    },

        // overridden
    _MonKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();
      if(iden=="Backspace"){
        var old = this.filterTextField.getValue() || "";
        var newVal = old.slice(0, -1);
        this.filterTextField.setValue(newVal);
        this.filterList(newVal);

        e.preventDefault();
      }
    }
  }
});