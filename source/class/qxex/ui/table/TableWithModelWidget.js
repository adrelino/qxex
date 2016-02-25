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
    "changeSelectionData" : "qx.event.type.Data"
  },

  members : {

  	__primaryKeyColumnIdx : -1,

    _table : null,
    _model : null,
    _tcm : null,

    _columns : {

    },

    /**
     * array, will be filled with the objects in columns after a call to __setUpColumns();
     */
    __columnsArr : null,


    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */


    /**
     * Must be called after _columns contains all needed columns!
     */
    create : function(){

      this._model = new this.__ModelConstructor();
      this.__setUpColumns();
      this._table = new this.__TableConstructor(this._model);
      this._tcm = this._table.getTableColumnModel();

      // Set up column renderers
      for (key in this._columns){
        var col = this._columns[key];
        col.configure && col.configure(col.idx, this._model, this._tcm, this);
      }
      this.__addListeners();

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
      CRUD							SQL-92		REST
      -----------------------------------------
      Create						INSERT		PUT oder POST
			Read (Retrieve)		SELECT		GET
			Update						UPDATE		PATCH oder PUT
			Delete (Destroy)	DELETE		DELETE

			Access based on Primary Key!
    ---------------------------------------------------------------------------
    */

    insertData : function(primaryKey, data){
      var view = 0;

      var overwritingExistingData = this.deleteData(primaryKey);

      var row = this.__makeRowFromData(data);
      this._model.addRows([row],false);

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
        var result = fun(data);
        row.push(result);
      }
      this.__insertDataIntoRow(row,data);
      return row;
    },

    __insertDataIntoRow : function(row,data){
      row.__data = data;
    },

    __extractDataFromRow : function(row){
      return row.__data;
    },

    __getDataFromRowIdx : function(rowIdx, view){
      var row = this._model.getRowReference(rowIdx,view);
      return this.__extractDataFromRow(row);
    },

    __getRowIdxFromPrimaryKey : function(primaryKey,view){
    	if(this.__primaryKeyColumnIdx==-1){
    		//no primary key column configured
    	}
      var rowIdx = this._model.locate(this.__primaryKeyColumnIdx,primaryKey,view);
      if(rowIdx==null){
      	//no row with this primary key exists
      }
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
          label=col.headerLabel(this);
        }
        column_names[col.idx] = key;
	    column_labels[col.idx] = label;
	    this.__columnsArr[col.idx] = col; //so we can reference by idx and not by id. Needed in event listeners
      }
      this._model.setColumns(column_labels,column_names);
    },

    __addListeners : function(){
    	// Add cell click listeners
      this._table.addListener("cellTap",function(e){
        var iCol = e.getColumn();
//         var colName = column_names[iCol];
        var iRow = e.getRow();
        //TODO: modifiers
//         var isShiftPressed = e.isShiftPressed();
//         var isCtrlPressed = e.isCtrlPressed();

        //TODO: make sure we never make a copy of the row, then __data is gone
        var view = undefined; // click from gui -> iRow is that of current view, not unfiltered view (0).
        var data = this.__getDataFromRowIdx(iRow,view);

        console.log("cellTapData",data,iRow);
        this.fireDataEvent("cellTapData",data);

        if(this.__columnsArr[iCol].onTap){
          console.log("cellTapData - calling column onTap function handler");
          this.__columnsArr[iCol].onTap.call(this,data);
        }

      },this);

      // Add selection change listeners
      this._table.getSelectionModel().addListener("changeSelection", function(e){
        var sel = [];
        var rowIndexe = [];

        this._table.getSelectionModel().iterateSelection(function(iRow) {
          var view = undefined; // click from gui -> iRow is that of current view, not unfiltered view (0).
          var data = this.__getDataFromRowIdx(iRow,view);
          sel.push(data);
          rowIndexe.push(iRow);
        },this);
        console.log("changeSelectionData",sel,rowIndexe);
        this.fireDataEvent("changeSelectionData",sel);
      },this);

    }
  }
});
