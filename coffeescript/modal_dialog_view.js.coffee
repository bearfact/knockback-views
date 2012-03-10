window.ModalDialogView = Backbone.View.extend

  # Because calling "super" on a prototype chain is a pain and we will likely need to do this
  # often in our views.
  super: (methodName, args...) ->
    ModalDialogView.prototype[methodName].apply this, args

  initialize: (options) ->
    @el = $(@el)
    @_bindProxiedMethods()
    @closeCallback = options.onClose if options?
    @presenter = @presenterForView(options)
    if _.isFunction(jQuery.tmpl)
      @formTemplate = $(@formTemplate)
      @modal_el = @formTemplate.tmpl( @presenter)
    else
      html = $(@formTemplate).html()
      @modal_el = $(html)
    @bindEvents()

  show: (dialog) ->  # assuming the use of jquery modal dialog / could be swapped for others
    if dialog
      @modal_el.dialog
        height: dialog.height
        width: dialog.width
        modal: dialog.modal
        title: dialog.title
        close: @close
        buttons: dialog.buttons
        resizable: dialog.resizable

      ko.applyBindings @presenter, @modal_el[0]
    else
      throw "Proper dialog options were not passed!"

  close: ->
    @modal_el.dialog("destroy")
    $(@modal_el).remove()
    @unbindEvents()
    @el.unbind ".delegateEvents#{@cid}"
    @closeCallback() if @closeCallback?

  bindEvents: ->

  unbindEvents: ->

  presenterForView: (params) ->
    ko.mapping.fromJS {}

  _bindProxiedMethods: ->
    if @proxied
      methods = _.select @proxied, (methodName) =>
        _.isFunction(@[methodName])
      _.bindAll @, methods...

