var __slice = Array.prototype.slice;

window.ModalDialogView = Backbone.View.extend({
  "super": function() {
    var args, methodName;
    methodName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return ModalDialogView.prototype[methodName].apply(this, args);
  },
  initialize: function(options) {
    var html;
    this.el = $(this.el);
    this._bindProxiedMethods();
    if (options != null) this.closeCallback = options.onClose;
    this.presenter = this.presenterForView(options);
    if (_.isFunction(jQuery.tmpl)) {
      this.formTemplate = $(this.formTemplate);
      this.modal_el = this.formTemplate.tmpl(this.presenter);
    } else {
      html = $(this.formTemplate).html();
      this.modal_el = $(html);
    }
    return this.bindEvents();
  },
  show: function(dialog) {
    if (dialog) {
      this.modal_el.dialog({
        height: dialog.height,
        width: dialog.width,
        modal: dialog.modal,
        title: dialog.title,
        close: this.close,
        buttons: dialog.buttons,
        resizable: dialog.resizable
      });
      return ko.applyBindings(this.presenter, this.modal_el[0]);
    } else {
      throw "Proper dialog options were not passed!";
    }
  },
  close: function() {
    this.modal_el.dialog("destroy");
    $(this.modal_el).remove();
    this.unbindEvents();
    this.el.unbind(".delegateEvents" + this.cid);
    if (this.closeCallback != null) return this.closeCallback();
  },
  bindEvents: function() {},
  unbindEvents: function() {},
  presenterForView: function(params) {
    return ko.mapping.fromJS({});
  },
  _bindProxiedMethods: function() {
    var methods,
      _this = this;
    if (this.proxied) {
      methods = _.select(this.proxied, function(methodName) {
        return _.isFunction(_this[methodName]);
      });
      return _.bindAll.apply(_, [this].concat(__slice.call(methods)));
    }
  }
});
