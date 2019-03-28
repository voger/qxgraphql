qx.Class.define("qxgraphql.Query", {
  extend: qx.core.Object,

  construct: function(query, variables) {
    this.base(arguments);
    if (query) {
      this.setQuery(query);
    }
    if (variables) {
      this.setVariables(variables);
    }
  },
  properties: {
    query:
    {
      check: "String",
      event: "changeQuery",
      init: null
    },

    // Can be created from an object literal or a JSON
    variables:
    {
      check: "Object",
      init: null,
      event: "changeVariables",
      transform: "_transformVariables"
    }
  },
  members:
  {
    /**
     * Returns a JSON representation of the current object
     *
     */
    toJsonString: function() {
      var query_string = this.getQuery();

      // Query must not be empty. This check is done only in development
      if (qx.core.Environment.get("qx.debug")) {
        if (!query_string) {
          throw new qx.core.ValidationError("Error: Query must be a non empty string.");
        }
      }

      // initialize a new query map
      var query_map = {
        query: query_string
      };

      // add variables to the query map if available
      var variables = this.getVariables();
      if (variables) {
        query_map["variables"] = qx.util.Serializer.toJson(variables);
      }
      return qx.lang.Json.stringify(query_map);
    },

    /**
     * Returns a Json representation of the variables
     * If the variables value is null, it returns null
     */
    getVariablesJson: function() {
      var model = this.getVariables();
      var json = null;
      if (model !== null) {
        json = qx.util.Serializer.toJson(model);
      }
      return json;
    },

    _transformVariables: function(val) {
      var model = null;
      if (![null, undefined].includes(val)) {
        model = qx.data.marshal.Json.createModel(val);
      }
      return model;
    }
  }
});
