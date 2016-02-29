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
      init : true
    },

    renderCheckbox : {
    	check : "Boolean",
    	init : false
    },

    shiftPressedSorting : 
    {
      check : "Boolean",
      init : false
    }
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
      if (! this.__widget)
      {
        return null;
      }
      
      return this.__widget[col];
    },

    // overridden
    createHeaderCell : function(cellInfo)
    {
      var widget = new qxex.ui.table.headerrenderer.FilterHeaderCell(this.getRenderCheckbox());
      // Update it now, using the given cell information
      this.updateHeaderCell(cellInfo, widget);

      // Is this the first widget we've generated?
      if (! this.__widget)
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

    // overridden from headerrenderer.Default, but set ToolTip to rich
    updateHeaderCell : function(cellInfo, cellWidget)
    {
      var DefaultHeaderCellRenderer = qx.ui.table.headerrenderer.Default;

      // check for localization [BUG #2699]
      if (cellInfo.name && cellInfo.name.translate) {
        cellWidget.setLabel(cellInfo.name.translate());
      } else {
        cellWidget.setLabel(cellInfo.name);
      }

      // Set image tooltip if given
      var widgetToolTip = cellWidget.getToolTip();
      if (this.getToolTip() != null)
      {
        if (widgetToolTip == null)
        {
          // We have no tooltip yet -> Create one
          widgetToolTip = new qx.ui.tooltip.ToolTip(this.getToolTip()).set({rich: true});
          cellWidget.setToolTip(widgetToolTip);
          // Link disposer to cellwidget to prevent memory leak
          qx.util.DisposeUtil.disposeTriggeredBy(widgetToolTip, cellWidget);
        }
        else
        {
          // Update tooltip text
          widgetToolTip.setLabel(this.getToolTip());
        }
      }

      cellInfo.sorted ?
        cellWidget.addState(DefaultHeaderCellRenderer.STATE_SORTED) :
        cellWidget.removeState(DefaultHeaderCellRenderer.STATE_SORTED);

      cellInfo.sortedAscending ?
        cellWidget.addState(DefaultHeaderCellRenderer.STATE_SORTED_ASCENDING) :
        cellWidget.removeState(DefaultHeaderCellRenderer.STATE_SORTED_ASCENDING);

      this.getShiftPressedSorting() ?
      	cellWidget.addState(this.self(arguments).STATE_SORTED_SHIFT) :
      	cellWidget.removeState(this.self(arguments).STATE_SORTED_SHIFT);
    }
  }
});
