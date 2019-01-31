qx.Class.define("qxgraphql.GraphQL",
  {
    extend: qx.core.Object,

    construct: function(url)
    {
      this.base(arguments);

      if (this.url !== undefined) {
        this.setUrl(url);
      }

    },

    properties: {

      /* if the request is cross domain */
      crossDomain: {
        check: "Boolean",
        init: false
      },

      /* The GraphQL endpoint in the server */
      url: {
        check: "String",
        nullable: true
      },

      /* The data format to send. Could be "POST" or "JSON" */
      dataSendFormat: {
        init: "POST",
        nullable: false,
        transform: "_transformDataSendFormat",
        apply: "_applyDataSendFormat",
        check: 'value in ["POST", "JSON"]'
      },

    },

    memebers: {

      __contentType: null,

      // TODO: Add support for GET requests
      /**
       * Create a new request. 
       *
       */
      createRequest: function(){
        var request = new qx.io.request.Xhr(this.getUrl(), "POST");
        request.setAccept('application/json');
        request.setRequestHeader("Content-Type", this.__contentType);
        return request;
      },

      createQuery: function

      _transformDataSendFormat: function(value, old) {
        return qx.lang.Type.isString(value) ? value.toUpperCase() : value;
      }

      _applyDataSendFormat(val, old){
        switch(val){
          case "POST": 
            this.__contentType = "application/x-www-form-urlencoded";
            break;
          case "JSON":
            this.__contentType = "application/json";
            break;
          default: throw "this shouldn't happen";
        }
      }
    }
  });
