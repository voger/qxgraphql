qx.Class.define("qxgraphql.GraphQL",
  {
    extend: qx.core.Object,

    construct: function(address, transport)
    {
      this.base(arguments);
      

      this.initTransport(transport || "qxgraphql.Xhr");

    },

    properties: {


      /* The transport class to be used. Default qxgraphql.Xhr. */
      transport: {
        // for now we hardcode that class. Later, when more transport
        // methods will be added, it will check for an interface
        check: "qxgraphql.Xhr",
        nullable: false,
        transform: "_transformTransport",
        deferredInit: true
      }


    },

    members: {


      // TODO: Add support for GET requests
      /**
       * Create a new request. 
       *
       */
      createRequest: function(){
        var request = new qx.io.request.Xhr(this.getUrl(), "POST");
        request.setAccept('application/json');
        return request;
      },

      createQuery: function(query_string, variables){

        query = {query: query_string}
        if (qx.lang.Type.isObject(variables) && )

      },

      _transformTransport: function(){

      }

    }
  });
