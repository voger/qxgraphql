qx.Class.define("qxgraphql.event.type.GraphQL", {
  extend: qx.event.type.Data,

  properties: {
    /**
     * The request of the event
     */
    request: {
      check: "qx.io.request.AbstractRequest"
    },

    /**
     * 
     */
    phase: {
      check: "String"
    }
  },

  members: {
    /**
     * Initializes an event object
     */
    init: function(data, old, cancelable, request, phase) {
      this.base(arguments, data, old, cancelable);

      this.setRequest(request);
      this.setPhase(phase);

      return this;
    },

    /**
     * Get a copy of this object
     */
    clone: function(embryo) {
      var clone = this.base(arguments, embryo);
      clone.setPhase(this.getPhase());
      clone.setRequest(this.getRequest());
    }
  }
});
