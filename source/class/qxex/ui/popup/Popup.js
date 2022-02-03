qx.Class.define("qxex.ui.popup.Popup",
{
  extend : qx.ui.popup.Popup,
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(layout)
  {
    this.base(arguments);//, layout);

    this._setLayout(new qx.ui.layout.Canvas());

    this.__childrenBox = new qx.ui.container.Composite(layout || new qx.ui.layout.VBox());
    this._add(this.__childrenBox,layout ? null : {top:0,left:0,right:0,bottom:0});

    //this.setAppearance("watcheepopup");
    this.addState("active");

    // force creation of captionbar
    this._createChildControl("captionbar");
    
    // Update captionbar
    this._updateCaptionBar();
  },

  properties : {
    /** Should the close button be shown */
    showClose :
    {
      check : "Boolean",
      init : true,
      apply : "_updateCaptionBar",
      themeable : true
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __childrenBox : null,

    // overridden
    /**
     * @lint ignoreReferenceField(_forwardStates)
     */
    _forwardStates :
    {
      active : true
    },

    // overridden
    add : function(child){
      this.__childrenBox.add(child);
    },
    
    // overridden
    addBefore : function(child,child2){
      this.__childrenBox.addBefore(child,child2);
    },

    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "captionbar":
          var layout = new qx.ui.layout.Grid();
          layout.setRowFlex(0, 1);
          layout.setColumnFlex(1, 1);
          control = new qx.ui.container.Composite(layout);
          control.setAppearance("watcheecaptionbar");
          control.set({minHeight : 0, padding: 2});
          this._add(control, {top:0, right:0});
          break;

        case "close-button":
          control = new qx.ui.form.Button();//null, "decoration/window/close-active.png");
          control.setFocusable(false);
          control.addListener("execute", this.exclude, this);
          control.setAppearance("watcheeclosebutton");
          control.set({margin : [ 4, 4, 4, 4]});
          this.getChildControl("captionbar").add(control, {row: 0, column:0});
          break;
      }

      return control || this.base(arguments, id);
    },

    _updateCaptionBar : function()
    {
      if (this.getShowClose())
      {
        this._showChildControl("close-button");
      }
      else
      {
        this._excludeChildControl("close-button");
      }
    }
  }
});
