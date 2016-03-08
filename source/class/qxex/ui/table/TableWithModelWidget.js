/**
 * A tree wich displays an overview of all poiConfigs 
 */
qx.Class.define("qxex.ui.table.TableWithModelWidget", {
  extend : qx.ui.core.Widget,
  include : qx.locale.MTranslation, //for this.trc to work

  construct : function(TableConstructor,ModelConstructor){
    this.base(arguments);
    this._setLayout(new qx.ui.layout.Grow());
    this.__TableConstructor = TableConstructor;
    this.__ModelConstructor = ModelConstructor;
  },

  events : {
    "changeSelectionData" : "qx.event.type.Data",
    "cellTapData" : "qx.event.type.Data",
    "cellDbltapData" : "qx.event.type.Data",
    "cellContextmenuData" : "qx.event.type.Data"
  },

  members : {

    __primaryKeyColumnIdx : -1,

    _table : null,
    _model : null,
    _tcm : null,

    /**
     * Must be populated by deriving classes
     *
     * @type {Object}
     */
    _columns : null,

    /**
     * Will be filled with the objects in columns after a call to __setUpColumns();
     *
     * @type {Array} 
     */
    __columnsArr : null,


    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * if we want to further customize the model before a call to create;
     */
    createModel : function(){
      this._model = new this.__ModelConstructor();
    },


    /**
     * Must be called after _columns contains all needed columns!
     */
    create : function(){

      if(!this._model){
        this.createModel();
        this.__setUpColumns();
      }

      this._table = new this.__TableConstructor(this._model);
      this._tcm = this._table.getTableColumnModel();

      // Set up column renderers
      for (key in this._columns){
        var col = this._columns[key];
        col.configure && col.configure.call(this,col.idx, this._model, this._tcm);
      }
      this._addListeners();

      //add children to widget
      this._add(this._table);
      return this;
    },

    setPrimaryKeyColumn : function(idx){
      if(this.__primaryKeyColumnIdx != -1){
        //can only be set once
      }else{
        this.__primaryKeyColumnIdx = idx;
        this._model.addIndex(idx);
      }
    },


    /*
    ---------------------------------------------------------------------------
      PUBLIC CRUD METHODS to modify state of rows. https://de.wikipedia.org/wiki/CRUD
      CRUD              SQL-92    REST
      -----------------------------------------
      Create            INSERT    PUT oder POST
      Read (Retrieve)   SELECT    GET
      Update            UPDATE    PATCH oder PUT
      Delete (Destroy)  DELETE    DELETE

      Access based on Primary Key!
    ---------------------------------------------------------------------------
    */


    insertData : function(primaryKey, data){
      var view = 0;

      var overwritingExistingData = this.deleteData(primaryKey);

      var row = this.__makeRowFromData(data);
      this._model.addRows([row],false,true); //data changed

      return overwritingExistingData;
    },

    readData : function(primaryKey){
      var view = 0;
      var rowIdx = this.__getRowIdxFromPrimaryKey(primaryKey,view);
      if(rowIdx != null){
        return this.__getDataFromRowIdx(rowIdx,view);
      }
      return null;
    },

    updateData : function(primaryKey, colIdx, value){
      var view = 0;
      var rowIdx = this.__getRowIdxFromPrimaryKey(primaryKey,view);
      if(rowIdx != null){
        this._model.setValue(colIdx,rowIdx,value,view);
        return true;
      }else{
        return false;
      }
    },

    deleteData : function(primaryKey){
      var view = 0;
      var rowIdx = this.__getRowIdxFromPrimaryKey(primaryKey,view);
      if(rowIdx != null){
        var retVal = this._model.removeRows(rowId,1,view);
        return true;
      }else{
        return false;
      }
    },

    //Convenience Bulk CRUD interface:
    readAllData : function(){
      var array = [];
      var arrarr = this._model.getData();   //Simple.model.Default points this to __rowData, wich is the currently selected view and not all the data?? do we want this?
      for (var irow=0; irow<arrarr.length; irow++) {
        var row = arrarr[irow];
        var data = this.__extractDataFromRow(row);
        array.push(data);
      }
      return array;
    },

    deleteAllData : function(){
      this._model.clearAllRows();
    },

    /*
    ---------------------------------------------------------------------------
      RRIVATE METHODS
    ---------------------------------------------------------------------------
    */

    __makeRowFromData : function(data){
      var row = [];
      for (var key in this._columns){
        var fun = this._columns[key].fun;
        var result = fun.call(this,data);
        row.push(result);
      }
      this.__insertDataIntoRow(row,data);
      return row;
    },

    __insertDataIntoRow : function(row,data){
      row.__data = data;
    },

    __extractDataFromRow : function(row){
      if(!row) return null;
      return row.__data;
    },

    __getDataFromRowIdx : function(rowIdx, view){
      var row = this._model.getRowReference(rowIdx,view);
      return this.__extractDataFromRow(row);
    },

    /**
     * Lookup the row index of the data entry by using its primary key.
     *
     * @param primaryKey {String} the primaryKey of the data entry.
     * @param view {Number} the view, usually 0 works fine.
     * @return {number | null} if no row with this primary key exists.
     */
    __getRowIdxFromPrimaryKey : function(primaryKey,view){
      if(this.__primaryKeyColumnIdx==-1){
        //no primary key column configured
        this.error("__getRowIdxFromPrimaryKey no primaryKeyColumnIdx configured!");
        return null;
      }
      var rowIdx = this._model.locate(this.__primaryKeyColumnIdx,primaryKey,view);
      return rowIdx;
    },

    __setUpColumns : function(){
    	// Set the columns
      var key, column_names = [], column_labels=[];
      this.__columnsArr = [];
      var idx=0; 
      
      for (key in this._columns){
        var col = this._columns[key]
        col.idx=idx++;

        var label = key;
        if(col.headerLabel){
          label=col.headerLabel.call(this);
        }
        column_names[col.idx] = key;
	    column_labels[col.idx] = label;
	    this.__columnsArr[col.idx] = col; //so we can reference by idx and not by id. Needed in event listeners
      }
      this._model.setColumns(column_labels,column_names);
    },

    _addListeners : function(){
      // Add cell click listeners

      //http://demo.qooxdoo.org/devel/apiviewer/#qx.ui.table.Table~cellTap!event
      var allMouseEvents = ["cellTap","cellDbltap","cellContextmenu"];

      allMouseEvents.forEach(function(mouseEventName){
        this._table.addListener(mouseEventName,function(e){
          var iCol = e.getColumn();
          var iRow = e.getRow();
          var isShiftPressed = e.isShiftPressed();
          var isCtrlPressed = e.isCtrlPressed();

          //TODO: make sure we never make a copy of the row, then __data is gone
          var view = undefined; // click from gui -> iRow is that of current view, not unfiltered view (0).
          var data = this.__getDataFromRowIdx(iRow,view);

          var column = this.__columnsArr[iCol];

          var transferObj = {data : data, column : column, isShiftPressed : isShiftPressed, isCtrlPressed : isCtrlPressed};
          var mouseEventNameWithData = mouseEventName+"Data";

          this.debug(mouseEventNameWithData,iRow);
          this.fireDataEvent(mouseEventNameWithData,transferObj);

          if(this.__columnsArr[iCol][mouseEventNameWithData]){
            this.debug("calling column "+mouseEventNameWithData+" function handler");
            this.__columnsArr[iCol][mouseEventNameWithData].call(this,data,isShiftPressed,isCtrlPressed);
          }
        },this);
      },this);

      // Add selection change listeners
      this._table.getSelectionModel().addListener("changeSelection", function(e){
        var sel = [];
        var rowIndexe = [];

        this._table.getSelectionModel().iterateSelection(function(iRow) {
          var view = 0; // click from gui -> iRow is that of current view, not unfiltered view (0).
          var data = this.__getDataFromRowIdx(iRow,view);
          sel.push(data);
          rowIndexe.push(iRow);
        },this);
        this.debug("changeSelectionData",sel,rowIndexe);
        this.fireDataEvent("changeSelectionData",sel);
      },this);

    }
  }
});
