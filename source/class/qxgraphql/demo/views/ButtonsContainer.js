qx.Class.define("qxgraphql.demo.views.ButtonsContainer", {
  extend: qx.ui.container.SlideBar,

  construct: function() {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.HBox(5));

    var button = new qx.ui.form.Button("Headers");
    button.setAllowStretchX(false);
    button.setAllowStretchY(false);
    button.setAlignY("middle");
    this.add(button);
  }
});
