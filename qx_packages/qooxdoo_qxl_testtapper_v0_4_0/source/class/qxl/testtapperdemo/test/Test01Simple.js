qx.Class.define("qxl.testtapperdemo.test.Test01Simple", {
  extend: qx.dev.unit.TestCase,
  members: {
    setUp: function () {
      console.debug("# Setup for TestCase");
    },
    tearDown: function () {
      console.debug("# Teardown for TestCase");
    },
    "test02: got array ?": function () {
        this.assertArray([],"This is an array");
    },
    "test01: assert 1==1": function () {
      this.assert(1==1,"One equals one");
    }
  }
});
