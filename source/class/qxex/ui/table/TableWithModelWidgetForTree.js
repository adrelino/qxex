/**
 * A tree wich displays an overview of all poiConfigs 
 */
qx.Class.define("qxex.ui.table.TableWithModelWidgetForTree", {
  extend : qxex.ui.table.TableWithModelWidget,

  events : {
    "cellTapOnAtomData" : "qx.event.type.Data"
  },
  members : {
    //overwritten
    _addListeners : function(){
      this.base(arguments);
      var selectionManager = this._table.getSelectionManager();

      selectionManager.addListener("cellTapOnAtom",function(e){
//         var foo = e.getData();
//         var iRow = foo.__rowIndex; //4
        var rowIdx2 = this._table.getFocusedRow(); //3
//         var rowId = foo.rowId;//9

        // click from gui -> iRow is that of current view, not unfiltered view (0).
        var view = undefined; 
        var data = this._getDataFromRowIdx(rowIdx2,view);

        var transferObj = {data : data};
        this.debug("cellTapOnAtomData",rowIdx2);
        this.fireDataEvent("cellTapOnAtomData",transferObj);

      },this);
    }
  }
});
