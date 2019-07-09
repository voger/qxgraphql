qx.Class.define("qxl.testtapperdemo.test.Test07AsyncTest", {
  extend: qx.dev.unit.TestCase,
  members: {
    "test01: in-time": function () {
        window.setTimeout(() => {
            this.resume();
        },500);
        this.wait(2000);
    },
    "test01: timeout": function () {
        this.wait(500);
    }
  }
});
