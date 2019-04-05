/**
 * Wrapper class for the graphql-query-compress library
 * https://github.com/rse/graphql-query-compress
 * It is used to compress the query by removing extra 
 * whitespace and newline characters
 * @asset(js/gqcpr.js/gqcpr.js)
 */
qx.Class.define("qxgraphql.GraphqlQueryCompress", {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    var dynLoader = new qx.util.DynamicScriptLoader(["js/gqcpr.js/gqcpr.js"]);

    dynLoader.addListenerOnce("ready", function() {
      console.log("all scripts have been loaded!");
    });

    dynLoader.addListener("failed", function(e) {
      var data = e.getData();
      console.log("failed to load " + data.script);
    });

    dynLoader.start();
  },

  members: {
    /**
     * Compresses the query
     * @param query {String} The query to compress
     * @return {String} The compressed string
     */
    compress: function(query) {
      return graphQLCompress(query);
    }
  }
});
