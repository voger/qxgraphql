qx.Class.define("qxgraphql.Query",{
  extend: qx.core.Object,

  construct: function(query, variables){
    this.base(arguments);

    if(query){
      this.setQuery(query);
    }

    if(variables){
      this.setVariables(variables)
    }
  },

  properties: {
    query: {
      check: "String",
      init: null
    },

    variables: {
      check: "Object",
      init: null
    }
  },

  members: {
    toJsonString: function(){
      var query_string = this.getQuery();
      // Query should not be empty
      if (!query) {
        throw new qx.core.ValidationError("Error: Query must be a non empty string.");
      }

      // initialize a new query map
      var query_map = {query: query_string}; 

      // add variables to the query map if available
      var variables = this.getVariables();
      if (variables) {
        query_map["variables"] = variables;
      }

      return qx.lang.Json.stringify(query_map);
    }
  }
});
