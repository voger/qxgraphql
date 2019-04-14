qx.Class.define("qxgraphql.demo.views.widgets.HeadersList", {
  extend : qx.ui.core.scroll.AbstractScrollArea,
  include: [
    qx.ui.core.MChildrenHandling
  ],
  implement : [
    qx.ui.form.IModel
  ],

  construct: function(model) {
    this.base(arguments);

    // create the marshaler
    const marshalerDelegate = {
      getModelMixins: function() {
        return qxgraphql.demo.views.widgets.MHeadersListModel;
      }
    };

    this.__marshaler = new qx.data.marshal.Json(marshalerDelegate);
    this.__marshaler.toClass({key: null, value: null}, true);


    this._setLayout(new qx.ui.layout.VBox(5));


    const _this = this;
    const delegate = {
      bindItem: function (controller, item, id) {
        controller.bindProperty("", "model", null, item, id);
        controller.bindProperty("key", "key", null, item, id);
        controller.bindPropertyReverse("key", "key", null, item, id);
        controller.bindProperty("value", "value", null, item, id);
        controller.bindPropertyReverse("value", "value", null, item, id);
      },
      createItem: function () {
        return new qxgraphql.demo.views.widgets.HeadersListItem();
      },
      configureItem: function(item) {
        item.addListener("delete", function(e) {
          const model = this.getModel();
          const itemModel = item.getModel();
          model.remove(itemModel);
        }, _this);
      }
    };

    this.__controller = new qx.data.controller.List(null, this);
    this.__controller.setDelegate(delegate);

    this.initModel(model);
  },

  properties: {
    model: {
      nullable: true,
      event: "changeModel",
      apply: "_applyModel",
      transform: "_transformModel",
      check: function(value) { 
        return qx.Class.isSubClassOf(value.constructor, qx.data.Array) || 
          (qx.Bootstrap.getClass(value) === "Map");  
      },
      dereference: true,
      deferredInit: true
    }
  },

  members: {

    __controller: null,
    // overridden

    __marshaler: null, 

    getChildrenContainer : function() {
      return this.getChildControl("pane");
    },

    _applyModel: function(value, old) {
      // initialize 
      if (value) {
        this.__trailWithEmpty();
        value.addListener("changeBubble", this.__trailWithEmpty, this);
        value.addListener("changeBubble", function(e) {
          console.log(e.getData);
        }, this);
      }

      this.__controller.setModel(value);

      if (old && !old.isDisposed()) {
        old.dispose();
      }
    },

    /**
     * Transforms incoming value. 
     * * If the incoming value is of type `qx.data.Array` it returns it as it is.
     * * If the incoming value is of type `Map` it returns a `qx.data.Array` array of models.
     * @param value {qx.data.Array|Map|null}
     * @return qx.data.Array
     */
    _transformModel: function(value) {
      let array;
      if (value === null) {
        array = null;
      } else if (qx.Class.isSubClassOf(value.constructor, qx.data.Array)) {
        array = value;
      } else {
        // model is a Map()
        array = new qx.data.Array();
        array.setAutoDisposeItems(true);
        for (const [key, value] of value.entries()) {
          const model = this.createModelItem(key, value);
          array.push(model);
        }  
      }
      return array;
    },

    // appends an empty item at the end of the model if needed
    __trailWithEmpty() {
      const model = this.getModel();
      const length = model.getLength();
      const last = model.getItem(length - 1);

      if (!last || !last.isEmpty()) {
        const empty = this.__createEmptyModelItem();
        model.push(empty);
      }
    },

    //  returns an empty model item to add to the end
    __createEmptyModelItem: function() {
      return this.createModelItem(null, null);
    },

    createModelItem: function(key, value) {
      return this.__marshaler.toModel({key: key, value: value});
    },



    _deleteItem: function(item) {
      this.remove(item);
      item.destroy();
    }

  },

  destruct: function() {
    this._disposeObjects("__controller");
  }

});
