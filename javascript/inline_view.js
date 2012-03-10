var __slice = Array.prototype.slice;

window.InlineView = Backbone.View.extend({
  "super": function() {
    var args, methodName;
    methodName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return InlineView.prototype[methodName].apply(this, args);
  },
  initialize: function(options) {
    this.el = $(this.el);
    this._bindProxiedMethods();
    this.presenter = this.presenterForView(options);
    this.bindEvents();
    return ko.applyBindings(this.presenter, this.el[0]);
  },
  destroy: function() {
    return this.unbindEvents();
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
