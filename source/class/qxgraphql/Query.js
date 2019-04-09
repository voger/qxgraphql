/**
 * The main query object. It holds and transforms the main query as a 
 * String. The query string is minimized using https://www.npmjs.com/package/graphql-query-compress

 *
 */
qx.Class.define("qxgraphql.Query", {
  extend: qx.core.Object,

  construct: function(query = "", variables) {
    this.base(arguments);

    // First load the compressor
    this._compressor = new qxgraphql.GraphqlQueryCompress();

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
      init: "",
      event: "changeQuery",
      transform: "_transformQuery"
    },

    // Can be created from an object literal or a JSON
    variables:
    {
      check: "Object",
      init: null,
      nullable: true,
      event: "changeVariables",
      transform: "_transformVariables",
      validate: "_validateVariables"
    }
  },
  members:
  {

    _compressor: null,
    /**
     * Returns a JSON representation of the current object.
     * This is the method to use when serializing the query
     * object to JSON and send it to the server.
     */
    toJson: function() {
      return JSON.stringify(this, this.__jsonReplacer);
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

    /**
     * @internal
     * The standard toJSON property of the object
     *
     */
    toJSON: function() {
      return {
        query: this.getQuery(),
        variables: this.getVariables()
      };
    },

    __jsonReplacer: function(key, value) {
      // Special case. If the variables key is an object, return it's JSON
      // representation, otherwise remove that key from the final JSON
      if (key === "variables") {
        return value !== null ? qx.util.Serializer.toJson(value) : undefined;
      }
      // everything else s returned as it is
      return value;
    },

    _transformVariables: function(val) {
      var model = null;
      if (![null, undefined].includes(val)) {
        model = qx.data.marshal.Json.createModel(val);
      }
      return model;
    },

    _validateVariables: function(val){
      if (!qx.lang.Type.isObject(val) && (val !== null)){
        throw new qx.core.ValidationError(
          "Validation Error: " + val + " is not an object or null."
        );
      }
    },

    _transformQuery: function(val) {
      return this._compressor.compress(val);
    }
  }
});
