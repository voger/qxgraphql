qx.Mixin.define("qxgraphql.demo.views.widgets.MHeadersListModel", {
  members: {

    // returns true if the `key` property is null or 
    // empty string
    isEmpty: function() {
      const falseys = [null, ""];
      const key = this.getKey();
      const value = this.getValue();
      return (falseys.includes(key) && falseys.includes(value));
    }
  }
});
