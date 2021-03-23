/**
 * A header renderer which displays a filter header cell and allows different sorting on shift-click.
 */
qx.Class.define("qxex.ui.table.headerrenderer.FilterAndShiftSortingRenderer",
{
  extend : qx.ui.table.headerrenderer.Default,

  statics :
  {
    /**
     * @type {String} The state which will be set for header cells of sorted columns when shift is clicked
     */
    STATE_SORTED_SHIFT : "sortedShift"
  },

  properties :
  {
    filterVisible :
    {
      check : "Boolean",
      init: true
    },

    renderCheckbox: {
      check: "Boolean",
      init: false
    },

    shiftPressedSorting:
    {
      check: "Boolean",
      init: false
    }
  },
  
  events :
  {
    "headerCellActivate" :"qx.event.type.Event",
    "headerFilterTextFieldBlur" :"qx.event.type.Data"
  },
  
  members :
  {
    __widget : null,

    /**
     * Get the header cell widget that contains the textfield
     *
     * @param col {Integer}
     *   The column number for which the header cell widget is requested
     *
     * @return {smart.headerrenderer.HeaderCellWithMenu}
     */
    getWidget : function(col)
    {
      if (!this.__widget)
      {
        return null;
      }
      
      return this.__widget[col];
    },

    // overridden
    createHeaderCell : function(cellInfo)
    {
      var widget = new qxex.ui.table.headerrenderer.FilterHeaderCell();
      widget.addListener("headerFilterTextFieldBlur",function(e){
        this.fireDataEvent("headerFilterTextFieldBlur",e.getData());
      },this);

      widget.addListener("activate",function(){
        this.fireEvent("headerCellActivate");
      },this);

      // Update it now, using the given cell information
      this.updateHeaderCell(cellInfo, widget);

      // Is this the first widget we've generated?
      if (!this.__widget)
      {
        // Yup. Create an array for holding the widgets
        this.__widget = [];
      }
      
      var oldWidget = this.__widget[cellInfo.col];
      if(oldWidget) widget.setFilterText(oldWidget.getFilterText());
      else widget.setFilterText(null);
      
      widget.setFilterVisible(this.getFilterVisible());
      
      // Save this widget in association with its column
      this.__widget[cellInfo.col] = widget;
      
      // Create the view button menu for this column
      cellInfo.table.registerFilterListener(cellInfo.col, widget);

      return widget;
    },

    setToolTip : function(text){
      var old = this.getToolTip();
      if(old){
          text = old + "<br>" + text;
      }
      this.base(arguments,text);
    },

    // overridden from headerrenderer.Default, but set ToolTip to rich
    updateHeaderCell : function(cellInfo, cellWidget)
    {
      this.base(arguments,cellInfo, cellWidget);
      
      if(this.getToolTip() !== null){
        var widgetToolTip = cellWidget.getToolTip();
        if(widgetToolTip){
          widgetToolTip.setRich(true);
        }
      }

      cellWidget.setRenderCheckbox(this.getRenderCheckbox());

      this.getShiftPressedSorting() ?
        cellWidget.addState(this.self(arguments).STATE_SORTED_SHIFT) :
        cellWidget.removeState(this.self(arguments).STATE_SORTED_SHIFT);
    }
  }
});
