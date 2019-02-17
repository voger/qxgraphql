qx.Class.define('qxgraphql.GraphQL', {
  extend: qx.core.Object,

  construct: function(address, transport) {
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

    address: {
      validate: qx.util.Validate.string(),
      nullable: true,
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

  members: {
    createRequest: function() {
      var transportClass = qx.Class.getByName(this.getTansport());
      return new transportClass(this.getAddress());
    },

    performQueryCallback: function(query, callback) {
      var request = this.createRequest();

      request.addListener("success", function(evt){
        this.__onSuccess(evt, this, callback);
      });

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


    _onSuccess: function(evt, context, callback){
      response = evt.getContent();

    },

    _makeException: function(origin, code, message){
      var exception = new Object();
      exception.code = code;
      addToStringToObject(exception)
    }
  },
});
