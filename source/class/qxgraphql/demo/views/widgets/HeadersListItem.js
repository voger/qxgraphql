qx.Class.define("qxgraphql.demo.views.widgets.HeadersListItem", {
  extend: qx.ui.core.Widget,

  implement: [
    qx.ui.form.IModel
  ],

  include: [
    qx.ui.form.MModelProperty
  ],

  construct: function(model) {
    this.base(arguments, model);

    if (model) {
      this.setModel(model);
    }

    const layout = new qx.ui.layout.Grid(10);
    layout.setColumnFlex(0, 4);
    layout.setColumnFlex(1, 4);
    layout.setColumnFlex(2, 1);

    this._setLayout(layout);

    // create the widgets
    this._createChildControl("key");
    this._createChildControl("value");
    this._createChildControl("delete");
  },

  events: {
    "changeKey": "qx.event.type.Data",
    "changeValue": "qx.event.type.Data",
    "delete": "qx.event.type.Data"
  },

  properties: {
    key: {
      nullable: true,
      init: null,
      event: "changeKey"
    },

    value: {
      nullable: true,
      init: null,
      event: "changeValue"
    }
  },

  members: {
    _createChildControlImpl: function(id) {
      var control;
      switch (id) {
        case "key": 
          control = new qx.ui.form.TextField();
          control.set({
            placeholder: "Header",
            liveUpdate: true
          });
          this.bind("key", control, "value");
          control.bind("changeValue", this, "key");
          this._add(control, {row: 0, column: 0});
          break;

        case "value":
          control = new qx.ui.form.TextField();
          control.set({
            placeholder: "Value",
            liveUpdate: true
          });
          this.bind("value", control, "value");
          control.bind("changeValue", this, "value");
          this._add(control, {row: 0, column: 1});
          break;

        case "delete":
          control = new qx.ui.form.Button("\u2717");
          control.setFont(qx.bom.Font.fromString("16px sans-serif bold"));
          control.setCenter(true);

          control.addListener("execute", function(e) {
            this.fireDataEvent("delete", this);
          }, this); 


          this._add(control, {row: 0, column: 2});
      }

      return control || this.base(arguments, id);
    }
  }
});
