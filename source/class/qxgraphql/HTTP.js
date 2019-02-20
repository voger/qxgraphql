qx.Class.define("qxgraphql.HTTP", {
  extend : qx.io.rest.Resource,

  /**
   * Tailor qx.io.rest.Resource to work as a graphql client 
   */

  construct : function(url) {
    // only post is supported for now
    var description = {
      "post": { method: "POST", url: url}
    };

    this.base(arguments, description);

    // set the configureRequest callback
    this.configureRequest(this._getConfigureRequestCallback());
  },

  properties: {
    contentType: {
      check: "String",
      default: "application/json",
      nullable: false,
      event: "changeContentType",
    },

    accept: {
      check: "String",
      default: "application/json",
      nullable: false,
      event: "changeAccept",
    },

    /** The timeout for asynchronous calls in milliseconds.
     * Default (0) means no limit
     */
    timeout: {
      validate: '_validateTimeout',
      nullable: false,
      default: 0

    }
  },

  members: {
    _getConfigureRequestCallback(){
      var resource = this;
      var callback = function(req){
        req.setRequestHeader("Content-Type", resource.getContentType())
        req.setAccept(resource.getAccept());
      }

      return callback;
    },

    // Replace all qx.event.type.Rest with qxgraphql.event.type.GraphQL
    // to make usage feel more consistent.
    _tailorResource: function(resource) {
      // inject different request implementation
      resource.setRequestFactory(this._getRequest);

      // inject different request handling
      resource.setRequestHandler({
        onsuccess: {
          callback: function(req, action) {
            return function() {
              var props = [req.getResponse(), null, false, req, action, req.getPhase()];
              this.fireEvent(action + "Success", qxgraphql.event.type.GraphQL, props);
              this.fireEvent("success", qxgraphql.event.type.GraphQL, props);
            };
          },
          context: this
        },
        onfail: {
          callback: function(req, action) {
            return function() {
              var props = [req.getResponse(), null, false, req, action, req.getPhase()];
              this.fireEvent(action + "Error", qxgraphql.event.type.GraphQL, props);
              this.fireEvent("error", qxgraphql.event.type.GraphQL, props);
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

      return resource;
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
    }
  }

});
