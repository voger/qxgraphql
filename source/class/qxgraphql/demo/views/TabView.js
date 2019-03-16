qx.Class.define("qxgraphql.demo.views.TabView", {
  extend : qx.ui.tabview.TabView,

  construct: function() {
    this.base(arguments);
    this.init();
  },

  members: {
    init: function() {
      this.add(new qxgraphql.demo.views.pages.FreeQueries("Free Queries"));
    }
  }

});
