qx.Class.define("qxgraphql.demo.views.pages.FreeQueries", {
  extend: qx.ui.tabview.Page,

  construct: function(label, icon) {
    this.base(arguments, label, icon);
    this.init();
  },

  members: {
    __formController: null,
    __resultController: null,
    __service: null,

    init: function() {
      this.setLayout(new qx.ui.layout.Dock(30));
      this.__service = new qxgraphql.HTTP();

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

      // if service is set then setup binding
      if (this.__service) {
        urlField.bind("changeValue", this.__service, "url", {
          onUpdate: function(e) {
            urlField.setValid(true);
          },
          onSetFail: function(e) {
            urlField.setValid(false);
            urlField.setInvalidMessage(e.toString());
          }
        });
      }

      form.add(urlField, "Server Address", qx.util.Validate.url());


      // FIXME: next line should be removed after we finish with this
      urlField.setValue("https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr");

      return form;
    },

    __createQueryForm: function() {
      var form = new qx.ui.form.Form();

      // Add a box to type the queries
      var queryBox = new qx.ui.form.TextArea();
      queryBox.setRequired(true);
      form.add(queryBox, "Query", null, "query", null, {flex: 4});

      // Add a box to type the variables
      var variablesBox = new qx.ui.form.TextArea();
      form.add(variablesBox, "Variables", null, "variables", null, {flex: 1});

      // Add a button to perform the query
      var execButton = new qx.ui.form.Button("\u25B6");
      execButton.setFont(qx.bom.Font.fromString("24px sans-serif bold"));
      execButton.setCenter(true);

      execButton.addListener("execute", function() {
        // check that the query form is valid and url is not a falsy value
        if (form.validate() && this.__service.getUrl()) {
          this.__formController.updateModel();
          console.log(this.__formController.getModel().toJsonString());

          this.__service.send(this.__formController.getModel(), null, this)
            .then(function(res) {
              let response = res.getResponse(); 
              let result = JSON.stringify(response, null, 2);
              this.__resultController.getModel().setResult(result);
            })
            .catch(function(e) {
              let response = JSON.stringify(e.getComment(), null, 2);
              this.__resultController.getModel().setResult(response);
            });
        }
      }, this);
      form.addButton(execButton);

      // create form model from qxgraphql.Query
      var delegate = {
        getModelClass: function(properties, object) {
          return qxgraphql.Query;
        }
      };

      // Create a model based on the query Object
      var queryObject = new qxgraphql.Query();
      var marshaler = new qx.data.marshal.Json(delegate);
      marshaler.toClass(queryObject);
      var model = marshaler.toModel(queryObject);

      this.__formController = new qx.data.controller.Form(model, form, true);

      var model2target =  {
        converter: function(data, model, source, target) {
          return target.getValue();
        }
      } 

      var target2model = {
        converter: function(data) {
          return JSON.parse(data);
        }
      }

      this.__formController.addBindingOptions("variables", model2target, target2model);
      return form;
    },

    __createResultField: function() {
      var resultField = new qx.ui.form.TextArea();
      resultField.setMarginTop(27);
      resultField.setReadOnly(true);

      var model = qx.data.marshal.Json.createModel({result: null});
      this.__resultController = new qx.data.controller.Object(model);

      // TODO: add logic to beautify JSON
      this.__resultController.addTarget(resultField, "value", "result");
      return resultField;
    },

    __createButtonsField: function() {
      return new qxgraphql.demo.views.ButtonsContainer();
    }
  }
});
