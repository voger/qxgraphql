qx.Class.define("qxl.testtapperdemo.test.Test03BadSetup", {
  extend: qx.dev.unit.TestCase,
  members: {
    setUp: function () {
      this.callUnknownFunctionInSetup();
    },
    "test01: assert 1==1": function () {
        this.assert(1==1,"One equals one");
    }
  }
});
