/**
 * Wrapper class for the graphql-query-compress library
 * https://github.com/rse/graphql-query-compress
 * It is used to compress the query by removing extra 
 * whitespace and newline characters
 * @asset(js/gqcpr.js/gqcpr.js)
 */
qx.Class.define("qxgraphql.GraphqlQueryCompress", {
  extend: qx.core.Object,

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
