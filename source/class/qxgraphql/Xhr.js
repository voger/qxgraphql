qx.Class.define("qxgraphql.Xhr",
{
  extend : qx.io.request.Xhr,
  construct : function(url)
  {
    this.base(arguments, url, "POST");
    this.setAccept("application/json");
    this.setRequestHeader("Content-Type", "application/json");
  }
});
