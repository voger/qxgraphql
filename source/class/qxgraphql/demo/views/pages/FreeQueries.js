qx.Class.define("qxgraphql.demo.views.pages.FreeQueries", {
  extend: qx.ui.tabview.Page,

  construct: function(label, icon) {
    this.base(arguments, label, icon);
    this.init();
  },

  events: {
    "changeService" :  "qx.event.type.Data"
  },

  properties: {
    service: {
      deferredInit: true,
      event: "changeService"
    }
  },

  members: {
    __formController: null,
    __resultController: null,

    init: function() {
      this.setLayout(new qx.ui.layout.Dock(30));
      this.initService(new qxgraphql.HTTP());

      var urlForm = this.__createUrlForm();
      this.add(new qx.ui.form.renderer.Single(urlForm), {edge: "north"});

      var buttonsField = this.__createButtonsField();
      this.add(buttonsField, {edge: "south", height: "10%"});

      // add the result field
      var resultField = this.__createResultField();
      this.add(resultField, {edge: "east", width: "50%"});

      var queryForm = this.__createQueryForm();
      var renderedForm = new qxgraphql.demo.layout.renderer.FreeQueries(queryForm);
      this.add(renderedForm, {edge: "west", width: "50%"});

    },

    __createUrlForm: function() {
      var form = new qx.ui.form.Form();
      var urlField = new qx.ui.form.TextField();

      urlField.setRequired(true);

      // if service is set then setup binding
      const service = this.getService();
      urlField.bind("changeValue", service, "url");

      form.add(urlField, "Server Address");


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

      variablesBox.addListener("input", function() {
        variablesBox.setValid(true);
      }, this);

      form.add(variablesBox, "Variables", null, "variables", null, {flex: 1});

      // Add a button to perform the query
      var execButton = new qx.ui.form.Button("\u25B6");
      execButton.setFont(qx.bom.Font.fromString("24px sans-serif bold"));
      execButton.setCenter(true);

      execButton.addListener("execute", async function() {
        // check that the query form is valid and url is not a falsy value
        const service = this.getService();
        if (form.validate() && service.getUrl()) {
          const resultModel = this.__resultController.getModel();

          try {
            const formModel = this.__formController.getModel();

            const response = await service.send(formModel);
            const result = JSON.stringify(response, null, 2);
            resultModel.setResult(result);
          } catch (error) {
            const toString = error.toString();
            resultModel.setResult(toString);
          }
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

      var formController = this.__formController = new qx.data.controller.Form(model, form);


      var model2query = {
        converter: function(data, model, source, target) {
          // disable binding back
          return target.getValue();
        }
      };

      formController.addBindingOptions("query", model2query);

      var model2variables = {
        converter: function(data, model, source, target) {
          return target.getValue();
        }
      }; 

      var _this = this;
      var variables2model = {
        onSetFail: function(exception) {
          variablesBox.setValid(false);
          formController.getModel().resetVariables();
        },


        converter: function(data) {
          var result = null;

          if (data === "") {
            result = null;
          } else {
            try {
              result = JSON.parse(data);
            } catch (e) {
              qx.log.Logger.error(_this, "Cannot parse variables data from: ", data);
              // let the model reject it so it can trigger onSetFail
              result = data;
            }
          }
          return result;
        }
      };

      formController.addBindingOptions("variables", model2variables, variables2model);
      return form;
    },

    __createResultField: function() {
      var resultField = new qx.ui.form.TextArea();
      resultField.setMarginTop(27);
      resultField.setReadOnly(true);

      var model = qx.data.marshal.Json.createModel({result: null});
      this.__resultController = new qx.data.controller.Object(model);

      this.__resultController.addTarget(resultField, "value", "result");
      return resultField;
    },

    __createButtonsField: function() {
      return new qxgraphql.demo.views.ButtonsContainer(this);
    }

  }
});
