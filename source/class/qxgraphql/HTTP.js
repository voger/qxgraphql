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
    }
  }

});
