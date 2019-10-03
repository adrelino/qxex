/** 
 * Mixin which adds syncing capability to (Multi) SelectBox so that the icon and label of the button matches the selection
 */
qx.Mixin.define("qxex.ui.form.MSelectBoxSyncButtonStyle", {
    properties :
    {
      //Icon to display when multiple items are selected but have different icons
      someIcon :
      {
        init : null
      }
    },
    members : {
      synchronizeButtonWithSelection : function(atom,listItems,total,labelFun,hasIcons,iconFun){
        var length=listItems.length;
    
        var label = length+"/"+total;
        if (length != 1) {
          label = this.trc("Label", "%1/%2 chosen", length, total);
        }
        
        if(length==0){
          label = "<b style='color:red;'>"+label+"<b>";
          this.setToolTipText(this.trc("Tooltip","Please select at least one item"));
          if(hasIcons) atom.setIcon("icon/32/actions/edit-delete.png");
        }else if(length==1){
          label+=" : "+labelFun(listItems[0]);
          this.setToolTipText(this.trc("Tooltip","You can select multiple items"));
           if(hasIcons) atom.setIcon(iconFun(listItems[0]));
        }else{
          var labels = listItems.map(function(listItem){
            return labelFun(listItem);
          },this);
          this.setToolTipText(labels.join(","));
          
          if(hasIcons){
              var icon=iconFun(listItems[0]);
              
              var allHaveSameIcon = listItems.every(function(listItem){
                  return icon==iconFun(listItem);
              });
              
              if(!allHaveSameIcon){
                 if(this.getSomeIcon()) icon=this.getSomeIcon(); //icon that displays that items have different icons
                 else{
                   listItems.forEach(function(listItem){
                        var otherIcon = iconFun(listItem);
                        if(otherIcon>icon) icon=otherIcon; //lexicographic higher icon is selected, schoses online over offline for buddy icons, so if at least one is online, green icon is displayed
                      },this);
                 }
              }
                  
              atom.setIcon(icon); //TODO: which icon to display when we have selected multiple (not all) items
          }
        }
        
        if(length==total){ //all selected
            label = "<b style='color:green;'>"+label+"<b>";
            //if(length > 1 && hasIcons) atom.setIcon("qx/icon/Oxygen/32/actions/dialog-apply.png"); //otherwise we dont see the only icon if total is just one
        }
    
        atom.setLabel(label || "");
      }
    }
});