/** ***************************************************************************
 * Simplified version of qx.ui.form.renderer.Single
 * It adds the labels above the widget instead of the left
 * The buttons row is placed on the right of the widgets instead 
 * of the bottom. 
 */
qx.Class.define("qxgraphql.demo.layout.renderer.FreeQueries", {
  extend: qx.ui.form.renderer.AbstractRenderer,

  construct: function(form) {
    // initialize the renderer
    var layout = new qx.ui.layout.HBox(6);
    this._setLayout(layout);
    this.base(arguments, form);
  },

  members: {
    __widgetsColumn: null,
    __buttonsColumn: null,

    /**
     * Add a group of form items with the corresponding names. The names
     * are displayed as label. No support for title or translation
     * as this is a demo application
     */
    addItems: function(items, names, title, options) {
      // initialize the widgets column
      if (!this.__widgetsColumn) {
        var layout = new qx.ui.layout.VBox(5);
        this.__widgetsColumn = new qx.ui.container.Composite(layout);
        this._add(this.__widgetsColumn, {flex: 1});
      }

      for (var i = 0; i < items.length; i++) {
        var label = this._createLabel(names[i], items[i]);
        this.__widgetsColumn._add(label);
        var item = items[i];
        label.setBuddy(item);
        this.__widgetsColumn.add(item, options[i]);
        this._connectVisibility(item, label);
      }
    },

    addButton: function(button) {
      if (!this.__buttonsColumn) {
        // create the buttons column
        this.__buttonsColumn = new qx.ui.container.Composite();
        this.__buttonsColumn.setMargin(5);
        var vbox = new qx.ui.layout.VBox();
        vbox.setAlignY("top");
        vbox.setSpacing(5);
        this.__buttonsColumn._setLayout(vbox);

        // add spacers so the buttons won't be added at the top 
        // of the column.
        this.__buttonsColumn.add(new qx.ui.core.Spacer(0, 50));
        this.__buttonsColumn.add(new qx.ui.core.Spacer(), {flex: 4});
        
        this._add(this.__buttonsColumn, {flex: 0});
      }

      // add the button before the second spacer
      var lastPosition = this.__buttonsColumn.getChildren().length - 1;
      this.__buttonsColumn.addAt(button, lastPosition);
    },

    /**
     * Creates a label for the given form item.
     *
     * @param name {String} The content of the label without the
     *   trailing * and :
     * @param item {qx.ui.core.Widget} The item, which has the required state.
     * @return {qx.ui.basic.Label} The label for the given item.
     */
    _createLabel : function(name, item) {
      var label = new qx.ui.basic.Label(this._createLabelText(name, item));
      // store labels for disposal
      this._labels.push(label);
      label.setRich(true);
      label.setAppearance("form-renderer-label");
      return label;
    },


    /*
     *****************************************************************************
     DESTRUCTOR
     *****************************************************************************
     */
    destruct : function() {
      // first, remove all buttons from the button row because they
      // should not be disposed
      if (this.__buttonsColumn) {
        this.__buttonsColumn.removeAll();
        this._disposeObjects("__buttonsColumn");
      }
    }
  }
});
