qx.Class.define("qxgraphql.Error", {
  extend: qx.type.BaseError,

  construct: function(comment, failMessage, code){
    this.base(arguments, comment, failMessage);
  }

  statics: {

    /**
     * Locally-detected errors
     */
    localError:
    {
      TIMEOUT: 1,
      ABORT: 2,
      NODATA: 3,
      PARTIAL_DATA: 4
    }
  },


  members:{

    _code: null,

    setCode: function(code) {
      this._code = code ? code : null;
    },

    getCode: function(){
      return this._code;
    },

    toString: function(){
      var code = this._getCode();

      var ret = "Error";

      if (code !== null) {
        ret = ret + " " + this.getCode() + ": ";
      } else {
        ret += ": ";
      }

      ret += this.getComment();
      return ret;
    }
  }
});
