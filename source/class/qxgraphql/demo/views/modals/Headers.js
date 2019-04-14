qx.Class.define("qxgraphql.demo.views.modals.Headers", {
  extend: qx.ui.window.Window,

  construct: function(service) {
    this.base(arguments, "Headers");

    this.setService(service);

    this.set({
      layout: new qx.ui.layout.HBox(10),
      modal: true,
      height: 270,
      width: 450,
      allowMaximize: false,
      allowMinimize: false,
      allowClose: true,
      allowStretchX: false,
      allowStretchY: false,
      allowGrowX: false,
      allowGrowY: false,
      showMaximize: false,
      showMinimize: false
    });

    this._init();

    this.addListener("appear", function() {
      this.center();
      const headers = this.getService().getRequestHeaders();
      this.__headersListWidget.setModel(headers);
    }); 
  },

  members: {
    __service: null,
     
    __headersListWidget: null,

    __headersListArray: null,

    _init: function() {
      this.setLayout(new qx.ui.layout.VBox(10));

      // create the UI elements
      const headersList = new qxgraphql.demo.views.widgets.HeadersList(null);
      this.__headersListWidget = headersList;

      const buttonOk = new qx.ui.form.Button("Ok");
      buttonOk.setWidth(80);
      buttonOk.addListener("execute", this._onOk, this);

      const buttonCancel = new qx.ui.form.Button("Cancel");
      buttonCancel.addListener("execute", this._onCancel, this);
      buttonCancel.setWidth(80);

      const buttonsLayout = new qx.ui.layout.HBox(10).set({
        alignX: "center",
        alignY: "middle"
      });
      const buttonContainer = new qx.ui.container.Composite(buttonsLayout);

      buttonContainer.add(buttonOk);
      buttonContainer.add(buttonCancel);

      this.add(headersList, {flex: 1});
      this.add(buttonContainer);
    },

    _onOk: function(e) {
      this.close();
    },

    _onCancel: function(e) {
      this.close();
      this.destroy();
    },

    setService: function(service) {
      this.__service = service;
    },

    getService: function() {
      return this.__service;
    }
  },
    destruct: function() {
      this.disposeObjects("__headersListArray");
      this.__headersListWidget.destroy();
    }
});
