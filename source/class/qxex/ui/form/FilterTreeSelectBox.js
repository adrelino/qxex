/**
 * TreeSelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterTreeSelectBox", {
  extend : qxex.ui.form.TreeSelectBox,

  construct : function()
  {
    this.base(arguments);

    this.addListener("keyinput", this._MonKeyInput, this);
    this.addListener("keypress", this._MonKeyPress, this);

    this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 0; //we only display filter for 6 or more items

    this.showFilter=false;

    //child controls
    var list = this.getChildControl("list");
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
    // overridden
    _onKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();
      if(iden == "Space"){
        e.preventDefault(); //otherwise SelectBox.js _onKeypress calls this.toggle();
      }else{
        this.base(arguments, e);
      }
    },

    filterList : function(filterText){
      var textField = this.filterTextField;
      var root = this.getChildControl("list").getRoot();
//       textField.addListener("input",function(e){
//          var text = e.getData().toLowerCase();
         var text = filterText.toLowerCase();
         var obj = {count:0, all:0};
         var show = this.setNodeVisibilityAndRecurseIntoChildren(root,text,0,obj);
         if(show){
             textField.setTextColor("green");
         }else{
             textField.setTextColor("red");
         }

         this.filterLabel.setValue(obj.count + "/" + obj.all);
          if(obj.count==0){
            this.helpLabelEmpty.show();
          }else{
            this.helpLabelEmpty.exclude();
          }

//       },this);
    },

    setNodeVisibilityAndRecurseIntoChildren: function(node, text, depth,obj){
        var noFilter = (text == "");

        var showNode = (noFilter && depth==1) ? true : node.getLabel().toLowerCase().indexOf(text) >= 0;

        var children = node.getChildren();

        var showChildren = children.filter(function(childNode){
                return this.setNodeVisibilityAndRecurseIntoChildren(childNode, text, depth+1,obj);
            },this).length>0;

        if(noFilter && depth==1) showChildren = false;

        var show = showNode || showChildren;

        if(show || noFilter){
            node.show();
        }else{
            node.exclude();
        }

        node.setOpen(showChildren || depth == 0);

        if(showNode && (text != "")){
            node.getChildControl("label").setTextColor("green");
        }else{
            node.getChildControl("label").setTextColor("black");

        }
        if(showNode){obj.count++};
        obj.all++;

        return show;
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