window.InlineView = Backbone.View.extend

  # Because calling "super" on a prototype chain is a pain and we will likely need to do this
  # often in our views.
  super: (methodName, args...) ->
    InlineView.prototype[methodName].apply this, args

  initialize: (options) ->
    @el = $(@el)
    @_bindProxiedMethods()
    @presenter = @presenterForView(options)
    @bindEvents()
    ko.applyBindings(@presenter, @el[0])


  destroy: -> # could be called deactivate
    @unbindEvents()

  bindEvents: ->

  unbindEvents: ->

  presenterForView: (params) ->
    ko.mapping.fromJS {}

  _bindProxiedMethods: ->
    if @proxied
      methods = _.select @proxied, (methodName) =>
        _.isFunction(@[methodName])
      _.bindAll @, methods...


