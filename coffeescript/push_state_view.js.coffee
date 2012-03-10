window.PushStateView = Backbone.View.extend

  # Because calling "super" on a prototype chain is a pain and we will likely need to do this
  # often in our views.
  super: (methodName, args...) ->
    PushStateView.prototype[methodName].apply this, args

  initialize: (options) ->
    @el = $(@el)
    @view_id = @el.attr('id')
    @_initialEl = $(@el).clone()
    paramstate = @_queryToObject(options.params)
    _.each paramstate, (v, k) =>
      if _.isArray @defaultState()[k]
        paramstate[k] = v.split(',') if v.length > 0

    @state = @_mergeObjects(_.clone(@defaultState()), paramstate)
    @_bindProxiedMethods()
    @presenter = @presenterForView(options)
    @bindEvents()

  activate: (populate_presenter) ->
    if populate_presenter
      _.each @state, (v, k) =>
        if _.isFunction(@presenter[k])
          @presenter[k](v)

    ko.applyBindings @presenter, @el[0]


  deactivate: ->
    @unbindEvents()
    @el.unbind ".delegateEvents#{@cid}"
    @el.replaceWith(@_initialEl)

  bindEvents: ->

  unbindEvents: ->

  defaultState: ->

  presenterForView: (params) ->
    ko.mapping.fromJS {}

  _bindProxiedMethods: ->
    if @proxied
      methods = _.select @proxied, (methodName) =>
        _.isFunction(@[methodName])
      _.bindAll @, methods...

  _setBlankState: (reset_presenter) ->
    @state = @defaultState()

    if reset_presenter
      _.each @state, (v, k) =>
        if _.isFunction(@presenter[k])
          @presenter[k](v)



  _setStateData: ->
    queryStr = @_objectToQuery(@state)

    Backbone.history.navigate(document.location.pathname+queryStr, false)

  _objectToQuery: (obj) ->
    str = []
    $.each obj, (p) ->
      str.push(p + "=" + encodeURIComponent(obj[p]))
    if(str.length > 0)
      return "?"+str.join("&")
    else
      return ""


  _queryToObject: (str) ->
    if (str)
      myObj = null;
      arr = str.split('&')
      if (arr.length > 0)
        myObj =new Object()
        $.each arr, (index, value) ->
          splitArr = value.split('=')
          myObj[splitArr[0]] = splitArr[1]
      return myObj
    else
      return {}

  _mergeObjects: (obj1, obj2) ->
    return jQuery.extend(obj1, obj2); #will merge obj2 into obj1 and return obj1
