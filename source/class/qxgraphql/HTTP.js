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

    // Maximum delay between retries 3 seconds
    this.setMaxDelay(3000);

    // set defaults
    this.setRequestHeader("Accept", "application/json");
    this.setRequestHeader("Content-Type", "application/json");
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
      init: 15
    },

    url: {
      check: "String",
      event: "changeUrl",
      init: null
    }
  },

  members: {

    __requestHeaders: null,
    
    // maximum delay between retries is 3 seconds
    __MAX_DELAY: null,


    __BASE_DELAY: 50,


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
      this.__requestHeaders.set(key, value);
    },

    /**
     * Removes a request header
     * @param key {String} The header to be removed
     */
    removeRequestHeader: function(key) {
      this.getRequestHeaders().delete(key);
    },


    /**
     * Clears all the request headers.
     *
     */
    clearRequestHeaders: function() {
      this.getRequestHeaders().clear();
    },


    /**
     * Sends the query and returns a promise.
     * @query {String} The query to send
     * @attempts {Integer}  The number of attempts to try sending the query
     *                      after failure. Must be a positive integer greater
     *                      than 0. Default is the value of the property attempts
     * @return {qx.Promise} A promise that resolves with the result of the request 
     * 
     */
    send: function(query, attempts = this.getAttempts()) {
      const request = this.__getRequest();
      request.setUrl(this.getUrl());

      // only POST is supported for now
      request.setMethod("POST");
      request.setTimeout(this.getTimeout());
      this.getRequestHeaders().forEach((value, header) => { 
        request.setRequestHeader(header, value) 
      });


      request.setRequestData(query.toJson());

      return this.__performAttempts(request, attempts);
    },

    /**
     * Set the maximum delay between retries
     * 
     * @delay {Integer} The delay to set
     */
    setMaxDelay: function(delay) {
      this.__MAX_DELAY = delay;
    },

    /**
     * Get the maximum delay between retries
     *
     * @return {Integer} the maximum delay between retries
     */
    getMaxDelay: function(delay) {
      return this.__MAX_DELAY;
    },

    /**
     * Perform the send attempts. If the request fails with a 
     * retirable error, then it is tried again using backoff with jitter.
     *
     * @request {qx.io.request.AbstractRequest} The request to attempt
     * @attempts {Integer} The number of attempts
     * @delay {Integer} The first delay between the retries.
     * @runs {Integer} The times it has run so far. This parametter is used to help 
     *                 with the backtracking algorithm and the deafult value of `1`
     *                 shouldn't be changed.
     * @return {qx.Promise} A promise that resolves with the result of the request 
     */
    __performAttempts: function(request, attempts, delay = this.__BASE_DELAY, runs = 1) {
      return request.sendWithPromise().catch((error) => {
        if (attempts === 1) {
          throw error;
        }

        if (!this._isRetriable(request)) {
          throw error;
        }

        // return a promise that waits for `delay` milisecconds
        // then returns the __performAttempts methos
        return new qx.Promise(function(resolve) {
          qx.event.Timer.once(function() {
            resolve(delay);
          }, this, delay)
        })
        .then(() => { 

          // calculate the new delay that may be needed for the next iteration
          const min = 0;
          const max = Math.min(this.getMaxDelay(), this.__BASE_DELAY * Math.pow(2, runs));
          const newDelay = Math.floor(Math.random() * (max - min + 1)) + min;

          return this.__performAttempts(request, attempts - 1, newDelay, runs + 1);
        })
      });
    },


    /**
     * Return a new request object
     *
     */
    __getRequest: function() {
      return new qx.io.request.Xhr();
    },

    /**
     * Returns true if the `request` status is one of the 
     * HTTP status codes that makes sense to retry sending the 
     * request or if the request failed with timeout.
     * 
     * @param {qx.io.request.AbstractRequest} The request to check 
     * @return {Boolean} Whether is retriable or not
     */
    _isRetriable: function(request) {
      return [0, 408, 502, 503, 504].includes(request.getStatus()) || request.getPhase() === "timeout";
    },


    _validateTimeout: function(value) {
      try {
        qx.core.Assert.assertPositiveInteger(value);
      } catch (e) {
        throw new qx.core.ValidationError(`ValidationError`, 
          `Time out value must be a positive integer. Found: ${value}.`);
      }
    },

    _validateAttempts: function(value) {
      try {
        qx.core.Assert.assertPositiveInteger(value);
        qx.core.Assert.assertTrue(value > 0);
      } catch (e) {
        throw new qx.core.ValidationError(`ValidationError`,
        `Attempts must be a natural number greater than 0. Found: ${value}.`);
      }
    }
  }
});
