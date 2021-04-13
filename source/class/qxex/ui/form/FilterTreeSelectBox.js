/**
 * TreeSelectBox with filter.
 */
qx.Class.define("qxex.ui.form.FilterTreeSelectBox", {
  extend : qxex.ui.form.TreeSelectBox,
  include : qxex.ui.form.MSelectBoxFilter,

  construct : function()
  {
    this.base(arguments);

    this.MIN_LIST_ITEMS_TO_SHOW_FILTER = 0; //we only display filter for 6 or more items

    this.showFilter=false;
    
    this.addFilterTextField(null,this.filterList);
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
      var textField = this.getFilterTextField();
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

         this.__filterLabel.setValue(obj.count + "/" + obj.all);
//       },this);
    },

    setNodeVisibilityAndRecurseIntoChildren: function(node, text, depth,obj){
        var noFilter = (text == "");

        var showNode = (noFilter && depth==1);
        if(!showNode){
          var labelRaw = qx.lang.String.stripTags(node.getLabel());

          var matchPos = labelRaw.toLowerCase().indexOf(text);
          showNode = matchPos >= 0;
          if(showNode){
            var labelRich = labelRaw.substring(0,matchPos)+"<span style='color:black;font-weight:bold'>"+labelRaw.substr(matchPos,text.length)+"</span>"+labelRaw.substr(matchPos+text.length);
            node.setLabel(labelRich);
          }
        }else{
            var labelRaw = qx.lang.String.stripTags(node.getLabel());
            node.setLabel(labelRaw);
        }

        var children = node.getChildren();

        var showChildren = children.filter(function(childNode){
                return this.setNodeVisibilityAndRecurseIntoChildren(childNode, text, depth+1,obj);
            },this).length>0;

        if(noFilter && depth==1) showChildren = false;

        var show = showNode || showChildren;

        if((show || noFilter) && (depth > 0 || !this.getChildControl("list").getHideRoot())){
            node.show();
        }else{
            node.exclude();
        }

        node.setOpen(showChildren || depth == 0);

        /*if(showNode && (text != "")){
            node.getChildControl("label").setTextColor("green");
        }else{
            node.getChildControl("label").setTextColor("black");
        }*/
        showNode && obj.count++;
        obj.all++;

        return show;
    }
  }
});