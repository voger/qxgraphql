qx.Class.define("qxgraphql.HTTP", {
  extend : qx.core.Object,


  /**
   * Basic HTTP GraphQL client
   */

  construct : function(url) {
    this.base(arguments);

    if (url) { 
      this.setUrl(url);
    }

    this.__requestHeaders = new Map();

    // force _apply
    this.initAccept();
    this.initContentType();
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
      init: "application/json",
      apply: "_applyContentType",
      nullable: true
    },

    accept: {
      check: "String",
      init: "application/json",
      apply: "_applyAccept",
      nullable: true
    },

    /** The timeout for asynchronous calls in milliseconds.
     * Default (0) means no limit
     */
    timeout: {
      validate: "_validateTimeout",
      nullable: false,
      init: 0

    },

    /**
     * Number of communication attempts. Default is 5
     *
     */
    attempts: {
      validate: "_validateAttempts",
      nullable: false,
      init: 5
    },

    url: {
      validate: qx.util.Validate.url(),
      check: "String",
      event: "changeUrl",
      init: null
    }
  },

  members: {

    __requestHeaders: null,

    /**
     * Returns a javascript Map() object with the headers that will be set
     * to the request
     *
     */
    getRequestHeaders: function() {
      return this.__requestHeaders;
    },


    /**
     * Returns the value of the header or `undefined` if the 
     * header is not set
     *
     */
    getRequestHeader: function(key) {
      this.getRequestHeaders().get(key);
    },


    /**
     * Adds a request key to the requests. Case sensitive. Keys with different 
     * casing will produce duplicate entries.
     * @param key {String} The name of the header whose value is to be set.
     * @param value {String}  The value to set as the body of the header.
     */
    setRequestHeader: function(key, value) {
      let upperCase = key.toUpperCase();

      // If the header is set from one of `this` properites
      // treat it specially 
      switch (upperCase) {
        case "ACCEPT": 
          this.setAccept(value);
          break;
        case "CONTENT-TYPE":
          this.setContentType(value);
          break;
        default:
          this.__requestHeaders.set(key, value);
      }
    },

    /**
     * Removes a request header
     * @param key {String} The header to be removed
     */
    removeRequestHeader: function(key) {
      let upperCase = key.toUpperCase();

      // If the header is set from one of `this` properites
      // treat it specially 
      switch (upperCase) {
        case "ACCEPT":
          this.setAccept(null);
          break;
        case "CONTENT-TYPE":
          this.setContentType(null);
          break;
        default:
          this.getRequestHeaders().delete(key);
      }
    },


    /**
     * Clears all the headers. Please note that it also
     * resets `Accept` and `Content-Type` headers to null.
     *
     */
    clearRequestHeaders: function() {
      // first clear `this` properties
      this.setAccept(null);
      this.setContentType(null);

      // then clear everything else
      this.getRequestHeaders().clear();
    },


    /**
     * Sends the query and returns a promise.
     * @query {String} The query to send
     * @attempts {Integer} The number of attempts to try sending the query
     *                     after failure. Must be a positive integer greater
     *                     than 0. Default is the value of the property attempts
     * @scope {Object} The scope to which the promise object is bound
     * @return {qx.Promise}
     */
    send: function(query, attempts = this.getAttempts() , scope) {
      const request = this.__getRequest();
      request.setUrl(this.getUrl());
      // only POST is supported for now
      request.setMethod("POST");
      request.setTimeout(this.getTimeout());

      this.getRequestHeaders().forEach((value, header) => 
        request.setRequestHeader(header, value));

      // request can keep track of the times it was attempted
      request.setUserData("attempts", attempts);


      request.setRequestData(query.toJson());

      // cache the scope 
      var service = this;

      // The returned promise is bound to caller's scope
      // Event listeners are bound to this object's scope
      return new qx.Promise(function(resolve, reject) {
        // add various listeners
        request.addListener("success", function() {
          var props = [request.getResponse(), null, false, request, request.getPhase()];
          this.fireEvent("success", qxgraphql.event.type.GraphQL, props);
          resolve(request);
        }, service);

        request.addListener("fail", function() {
          debugger;
          var props = [request.getResponse(), null, false, request, request.getPhase()];
          this.fireEvent("error", qxgraphql.event.type.GraphQL, props);

          if (request.getUserData("attempts") > 0) {
            console.log("attempt: " + request.getUserData("attempts"));
            request.setUserData("attempts", request.getUserData("attempts") - 1);
            request.send();
          } else {
            reject(new qx.type.BaseError(request.getResponse()));
          }
        }, service);


        // request.addListener("loadEnd", function() {
        //   request.dispose();
        // }, service);

        // finaly send the request
        request.setUserData("attempts", request.getUserData("attempts") - 1);
        request.send();
      }, scope);
    },



    __getRequest: function() {
      return new qx.io.request.Xhr();
    },



    _validateTimeout: function(value) {
      try {
        qx.core.Assert.assertPositiveInteger(value);
      } catch (e) {
        throw new qx.core.ValidationError(`ValidationError: Time out value must be a positive integer. Found: ${value}.`);
      }
    },

    _validateAttempts: function(value) {
      try {
        qx.core.Assert.assertPositiveInteger(value);
        qx.core.Assert.assertTrue(value > 0);
      } catch (e) {
        throw new qx.core.ValidationError(`ValidationError: Attempts must be a natural number greater than 0. Found: ${value}.`);
      }
    },


    _applyAccept: function(value) {
      if (value === null) {
        this.removeRequestHeader("Accept");
      } else {
        this.getRequestHeaders().set("Accept", value);
      }
    },

    _applyContentType: function(value) {
      if (value === null) {
        this.removeRequestHeader("Content-Type");
      } else {
        this.getRequestHeaders().set("Content-Type", value);
      }
    }
  }
});
