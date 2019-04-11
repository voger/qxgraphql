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
      nullable: false
    },

    accept: {
      check: "String",
      init: "application/json",
      nullable: false
    },

    /** The timeout for asynchronous calls in milliseconds.
     * Default (0) means no limit
     */
    timeout: {
      validate: "_validateTimeout",
      nullable: false,
      init: 0

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

    getHeaders: function() {
      return this.__headers;
    },

    /**
     * Adds a request key to the requests.  
     * @param key {String} The name of the header whose value is to be set.
     * @param value {String}  The value to set as the body of the header.
     */
    setRequestHeader: function(key, value) {
      var lowerCase = key.toLowerCase();
      // If the header is set from one of `this` properites
      // treat it specially 
      switch(lowerCase){
        case "accept": 
          this.setAccept(value);
          this.__requestHeaders.set(lowerCase, [key, this.getAccept]);
          break;
        case "content-type":
          this.setContentType(value);
          this.__requestHeaders.set(lowerCase, [key, this.getContentType]);
          break;
        default:
          this.__requestHeaders.set(lowerCase, [key, value]);
      }
    },
    
    getRequestHeader: function(key) {

      var toLower = key.toLowerCase();
       var val = this.__requestHeaders.get(toLower);



    },

    /**
     * Sends the query and returns a promise.
     * @query 
     *
     */
    send: function(query, headers, scope) {
      var request = this.__getRequest();
      request.setUrl(this.getUrl());
      // only POST is supported
      request.setMethod("POST");
      request.setAccept(this.getAccept());
      request.setTimeout(this.getTimeout());
      request.setRequestHeader("Content-Type", this.getContentType());
      request.setRequestData(query.toJson());

      // set the rest of the headers
      // TODO: Add support for default headers object
      headers = headers && headers.isObject() ? headers : {};
      Object.keys(headers).forEach(function(key) {
        request.setRequestHeader(key, request[key]);
      });

      // cache the scope 
      var service = this;

      // The returned promise is bound to caller's scope
      // Event listeners are bound to this object's scope
      return new qx.Promise(function(resolve, reject) {
        // add various listeners
        request.addListenerOnce("success", function() {
          var props = [request.getResponse(), null, false, request, request.getPhase()];
          this.fireEvent("success", qxgraphql.event.type.GraphQL, props);
          resolve(request);
        }, service);

        request.addListenerOnce("fail", function() {
          var props = [request.getResponse(), null, false, request, request.getPhase()];
          this.fireEvent("error", qxgraphql.event.type.GraphQL, props);
          reject(new qx.type.BaseError(request.getResponse()));
        }, service);


        request.addListenerOnce("loadEnd", function() {
          request.dispose();
        }, service);

        // finaly send the request
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
        throw new qx.core.ValidationError("ValidationError: " + value + " must be a positive integer.");
      }
    }
  }
});
