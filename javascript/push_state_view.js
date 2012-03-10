var __slice = Array.prototype.slice;

window.PushStateView = Backbone.View.extend({
  "super": function() {
    var args, methodName;
    methodName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return PushStateView.prototype[methodName].apply(this, args);
  },
  initialize: function(options) {
    var paramstate,
      _this = this;
    this.el = $(this.el);
    this.view_id = this.el.attr('id');
    this._initialEl = $(this.el).clone();
    paramstate = this._queryToObject(options.params);
    _.each(paramstate, function(v, k) {
      if (_.isArray(_this.defaultState()[k])) {
        if (v.length > 0) return paramstate[k] = v.split(',');
      }
    });
    this.state = this._mergeObjects(_.clone(this.defaultState()), paramstate);
    this._bindProxiedMethods();
    this.presenter = this.presenterForView(options);
    return this.bindEvents();
  },
  activate: function(populate_presenter) {
    var _this = this;
    if (populate_presenter) {
      _.each(this.state, function(v, k) {
        if (_.isFunction(_this.presenter[k])) return _this.presenter[k](v);
      });
    }
    return ko.applyBindings(this.presenter, this.el[0]);
  },
  deactivate: function() {
    this.unbindEvents();
    this.el.unbind(".delegateEvents" + this.cid);
    return this.el.replaceWith(this._initialEl);
  },
  bindEvents: function() {},
  unbindEvents: function() {},
  defaultState: function() {},
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
  },
  _setBlankState: function(reset_presenter) {
    var _this = this;
    this.state = this.defaultState();
    if (reset_presenter) {
      return _.each(this.state, function(v, k) {
        if (_.isFunction(_this.presenter[k])) return _this.presenter[k](v);
      });
    }
  },
  _setStateData: function() {
    var queryStr;
    queryStr = this._objectToQuery(this.state);
    return Backbone.history.navigate(document.location.pathname + queryStr, false);
  },
  _objectToQuery: function(obj) {
    var str;
    str = [];
    $.each(obj, function(p) {
      return str.push(p + "=" + encodeURIComponent(obj[p]));
    });
    if (str.length > 0) {
      return "?" + str.join("&");
    } else {
      return "";
    }
  },
  _queryToObject: function(str) {
    var arr, myObj;
    if (str) {
      myObj = null;
      arr = str.split('&');
      if (arr.length > 0) {
        myObj = new Object();
        $.each(arr, function(index, value) {
          var splitArr;
          splitArr = value.split('=');
          return myObj[splitArr[0]] = splitArr[1];
        });
      }
      return myObj;
    } else {
      return {};
    }
  },
  _mergeObjects: function(obj1, obj2) {
    return jQuery.extend(obj1, obj2);
  }
});
