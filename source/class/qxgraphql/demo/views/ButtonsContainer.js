qx.Class.define("qxgraphql.demo.views.ButtonsContainer", {
  extend: qx.ui.container.SlideBar,
  /**
   * @param page {qxgraphql.demo.views.pages.FreeQueries} The page where
   * the container will be included
   *
   */
  construct: function(page) {
    this.base(arguments);

    this.setPage(page);
    qx.data.SingleValueBinding.bind(page, "service", this, "service");

    this.setLayout(new qx.ui.layout.HBox(5));

    this.add(this.__createHeadersButton());
  },

  events: {
    "changeService" :  "qx.event.type.Data"
  },

  properties: {
    service: {
      init: null,
      event: "changeService" 
    }
  },

  members : {

    __page: null,

    __createHeadersButton: function() {
      const button = this.__createGenericButton("Headers");
      button.addListener("execute", function() {
        const win = new qxgraphql.demo.views.modals.Headers(this.getService());
        win.open();
      }, this);
      return button;
    },

    __createGenericButton: function(title, icon) {
      return new qx.ui.form.Button(title, icon).set({
        allowStretchX: false,
        allowStretchY: false,
        alignX: "center",
        alignY: "middle"
      }); 
    },

    setPage: function(page) {
      this.__page = page;
    },

    getPage: function() {
      return this.__page;
    }
  }
});
