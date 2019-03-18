qx.Class.define("qxgraphql.HTTP", {
  extend : qx.core.Object,


  /**
   * Tailor qx.io.rest.Resource to work as a graphql client 
   */

  construct : function(url) {
    this.base(arguments);

    if (url) { 
      this.setUrl(url);
    }
  },

  events: {
  /**
   * Fired when the request was successful
   */
    "success": "qxgraphql.event.type.GraphQL",

  /**
   * Fired when the request fails
   */
    "error": "qxgraphql.event.type.GraphQL"
    

  },

  properties: {
    contentType: {
      check: "String",
      default: "application/json",
      nullable: false
    },

    accept: {
      check: "String",
      default: "application/json",
      nullable: false
    },

    /** The timeout for asynchronous calls in milliseconds.
     * Default (0) means no limit
     */
    timeout: {
      validate: "_validateTimeout",
      nullable: false,
      default: 0

    },

    url: {
      validate: qx.util.Validate.url,
      init: null
    }
  },

  members: {
    send: function(query, headers) {
      return new qx.Promise(function(resolve, reject) {
        var request = this.__getRequest();
        request.setUrl(this.getUrl());
        // only POST is supported
        request.setMethod("POST");
        request.setAccept(this.getAccept());
        request.setTimeout(this.getTimeout());
        request.setRequestHeader("Content-Type", this.getContentType());


        headers.keys.forEach(function(key) {
          request.setRequestHeader(key, request[key]);
        });

        // add various listeners
        request.addListenerOnce("success", function(request) {
          var props = [request.getResponse(), null, false, request, request.getPhase()];
          this.fireEvent("success", qxgraphql.event.type.GraphQL, props);
          resolve(request);
        }, this);

        request.addListenerOnce("fail", function(request) {
          var props = [request.getResponse(), null, false, request, request.getPhase()];
          this.fireEvent("error", qxgraphql.event.type.GraphQL, props);
          // console.log(request);
          reject(new qx.type.BaseError("Failed"));
        }, this);


        request.addListenerOnce("loadEnd", function(request) {
          request.dispose();
        }, this);
      });
    },


    __getRequest: function() {
      return new qx.io.request.Xhr();
    },


    _validateTimeout: function(value) {
      try {
        qx.core.Assert.assertPositiveInteger(value);
      } catch (e) {
        throw new qx.core.ValidationError("ValidationError: " + value + " must be a positive integer.");
      }
    }
  }
});
