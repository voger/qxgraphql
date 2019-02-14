qx.Class.define("qxgraphql.GraphQL",
  {
    extend: qx.core.Object,

    construct: function(address, transport)
    {
      this.base(arguments);

      if (address !== undefined){
        this.setAddress(address);
      }

      if (transport !== undefined) {
        this.setTransport(transport);
      }

    },

    events: {

    }

    properties: {


      /* The transport class to be used. Default qxgraphql.Xhr. */
      transport: {
        // for now we hardcode that class. Later, when more transport
        // methods will be added, it will check for an interface
        init: "qxgraphql.Xhr"
        check: "String",
        nullable: false,
      },

      address: {
        validate: qx.util.Validate.string(),
        nullable: true,
      },


      /** The timeout for asynchronous calls in milliseconds. Default (0) means no limit*/
      timeout :
      {
        nullable : false,
        init: 0,
        validate: "_validateTimeout"
      },


    },

    members: {
      // Create query string. This may be replaced by a dedicated query object
      createQuery: function(query_string, variables){
        var query = {"query": query_string}
        if (qx.lang.Type.isObject(variables) && !qx.lang.Object.isEmpty(variables)){
          query = query["variables"] = variables;
        }

        return qx.lang.Json.stringify(query);
      },

      createRequest: function(){
        var transportClass = qx.Class.getByName(this.getTansport());
        return new transportClass(this.getAddress());
      },

      query: function(){

      },

      _validateTimeout: function(value){
        try {
          qx.core.Assert.assertPositiveInteger(value);
        }
        catch (){
          throw new qx.core.ValidationError("ValidationError: " + value + " must be a positive integer.");
        }
      }
    }
  });
