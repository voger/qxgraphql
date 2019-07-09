qx.Class.define("qxl.testtapperdemo.test.Test08Exception", {
  extend: qx.dev.unit.TestCase,
  members: {
    "test01: die baby die": function () {
        this.callUnknownFunction();
    },
  }
});
