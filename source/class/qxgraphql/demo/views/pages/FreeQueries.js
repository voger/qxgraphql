qx.Class.define("qxgraphql.demo.views.pages.FreeQueries", {
  extend: qx.ui.tabview.Page,

  construct: function(label, icon) {
    this.base(arguments, label, icon);
    this.init();
  },

  members: {
    init: function() {
      this.setLayout(new qx.ui.layout.Dock(30));

      var urlForm = this.__createUrlForm();
      this.add(new qx.ui.form.renderer.Single(urlForm), {edge: "north"});

      var buttonsField = this.__createButtonsField();
      this.add(buttonsField, {edge: "south", height: "10%"});

      var queryForm = this.__createQueryForm();
      var renderedForm = new qxgraphql.demo.layout.renderer.FreeQueries(queryForm);
      this.add(renderedForm, {edge: "west", width: "50%"});


      // add the result field
      var resultField = this.__createResultField();
      this.add(resultField, {edge: "east", width: "50%"});
    },

    __createUrlForm: function() {
      var form = new qx.ui.form.Form();
      var urlField = new qx.ui.form.TextField();
      urlField.setRequired(true);
      form.add(urlField, "Server Address", qx.util.Validate.url());
      return form;
    },

    __createQueryForm: function() {
      var form = new qx.ui.form.Form();

      var queryBox = new qx.ui.form.TextArea();
      queryBox.setRequired(true);
      form.add(queryBox, "Query", null, "query", null, {flex: 4});

      var variablesBox = new qx.ui.form.TextArea();
      form.add(variablesBox, "Variables", null, "variables", null, {flex: 1});

      var execButton = new qx.ui.form.Button("\u25B6");
      execButton.setFont(qx.bom.Font.fromString("24px sans-serif bold"));
      execButton.setCenter(true);
      form.addButton(execButton);
      return form;
    },

    __createResultField: function() {
      var resultField = new qx.ui.form.TextArea();
      resultField.setMarginTop(27);
      resultField.setReadOnly(true);
      return resultField;
    },

    __createButtonsField: function() {
      return new qxgraphql.demo.views.ButtonsContainer();
    }
  }
});
