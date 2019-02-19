qx.Class.define('qxgraphql.GraphQL', {
  extend: qx.core.Object,

  construct: function(url, transport) {
    this.base(arguments);

    if (address !== undefined) {
      this.setAddress(address);
    }

    if (transport !== undefined) {
      this.setTransport(transport);
    }
  },

  properties: {

    /* The transport class to be used. Default qxgraphql.Xhr. */
    transport: {
      // for now we hardcode that class. Later, when more transport
      // methods will be added, it will check for an interface
      init: 'qxgraphql.Xhr',
      check: 'String',
      nullable: false,
    },

    /** The timeout for asynchronous calls in milliseconds.
     * Default (0) means no limit
     */
    timeout: {
      nullable: false,
      init: 0,
      validate: '_validateTimeout',
    },
  },

  events:
  {
    /**
     * Fired when the request was successful.
     *
     * The request itself, can be retrieved from the event’s properties.
     */
    "success": "qx.event.type.Data",

    /**
     * Fired when the request fails.
     *
     * The request itself, can be retrieved from the event’s properties.
     */
    "error": "qx.event.type.Data"

},

  members: {

    __url: null,
    __accept: "application/json",
    __requestHandler: null,

    setUrl: function(url){
      this.__url = url;
    },

    getUrl: function(){
      return this.__url;
    },

    setAccept: function(accept){
      this.__accept = accept;
    },

    getAccept: function(){
      return this.__accept;
    },

    setRequestHandler: function(handler) {
      this.__requestHandler = handler;
    },


    __createRequest: function() {
      var transportClass = qx.Class.getByName(this.getTansport());
      request = new transportClass(this.getUrl());
    },


      // inject different request handling
      request.setRequestHandler({
        onsuccess: {
          callback: function(req, action) {
            return function() {
              var props = {response: request.getResponse(), 
                request: request, 
                phase: getPhase()};
              this.fireDataEvent("success", props);
            };
          },
          context: this
        },

        onfail: {
          callback: function(req, action) {
            return function() {

              var props = {response: request.getResponse(), 
                request: request, 
                phase: getPhase()};
              this.fireDataEvent("error", props);
            };
          },
          context: this
        },
        onloadend: {
          callback: function(req, action) {
            return function() {
              req.dispose();
            };
          },
          context: this
        }
      });
      return request;
    },


    _validateTimeout: function(value) {
      try {
        qx.core.Assert.assertPositiveInteger(value);
      } 
      catch {
        throw new qx.core.ValidationError(
          'ValidationError: ' + value + ' must be a positive integer.',
        );
      }
    },

  },
});
