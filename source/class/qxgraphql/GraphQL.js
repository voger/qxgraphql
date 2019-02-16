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
      createRequest: function(){
        var transportClass = qx.Class.getByName(this.getTansport());
        return new transportClass(this.getAddress());
      },

      performQuery: function(query){
        var request = this.createRequest();



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
