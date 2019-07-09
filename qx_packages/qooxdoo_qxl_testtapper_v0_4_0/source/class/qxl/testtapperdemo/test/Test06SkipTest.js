qx.Class.define("qxl.testtapperdemo.test.Test06SkipTest", {
  extend: qx.dev.unit.TestCase,
  include: [qx.dev.unit.MRequirements],
  members: {
    "hasNevertrue": function () {
        return false;
    },
    "test01: Skip Test": function () {
        this.require(["nevertrue"]);
    },
    "test02: Skip Test followed by Exception": function () {
        this.require(["nevertrue"]);
        this.unknownFunction();
    },
  }

});
