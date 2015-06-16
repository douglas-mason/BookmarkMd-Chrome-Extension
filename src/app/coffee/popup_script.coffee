class Popup
#'use strict'

  constructor: ->
    @initialize?()

  initialize: (config) =>
    @folderName = ""
    @fileName = ""
    @dbclient = {}

    @folderName = config?.folderName || '/BookmarkMd'
    @fileName = config?.fileName || 'bookmarks.md'
    @dbclient = config?.client
    chrome.tabs.query {active: true,currentWindow: true},
    (tabs) ->
      $('#txtUrl').val(tabs[0].url) #url
      $('#txtTitle').val(tabs[0].title) #title

    $('#btnSave').click =>
      # $('#btnSave').button('saving')
      @readBookmarkFile(@folderName, @fileName)

    $('#btnCloseAlert').click ->
      $('#alert-container').addClass('hide')

    chrome.runtime.getBackgroundPage (backgroundWindow) =>
      client = backgroundWindow.client
      if (client.isAuthenticated())
        @initialize({
          'folderName': 'Bookmarks',
          'client': client
        })
      else
        client.authenticate (error, client) =>
          if(error)
            return @showError(error)
    # $(->
    #   $('[data-toggle="popover"]').popover()
    # )

  showError: (error) ->
    console.log("Error: " + error)
    # $('#btnSave').button('reset')
    $('#errorMessage').text(error)
    $('#alert-container').removeClass('hide')

  formatAsMarkdown: (title, tags, url) ->
    if (tags isnt undefined and tags.length > 0)
      tagList = tags.split(',')
      tags = ''
      tagList.forEach (item) ->
        tags = tags + ' #' + item.trim()
    return '\n' + '[' + title + tags + '](' + url + ')' + '\n'

  getCategoryFileNameOverride: (category) ->
    return category.trim() + '.md'

  readBookmarkFile: (folderName, fileName) ->
    doesCategoryOverrideExist = $('#txtCategory').val() isnt undefined and
    $('#txtCategory').val().length > 0
    folderItems = @getDirectoryContents(folderName)
    newBookmark = @formatAsMarkdown($('#txtTitle').val(),
    $('#txtTags').val(), $('#txtUrl').val())

    if (doesCategoryOverrideExist)
      fileName = @getCategoryFileNameOverride($('#txtCategory').val())

    if ($.inArray(fileName, folderItems) > -1)
      @addToExistingFile(fileName, folderName, newBookmark)
    else
      @addNewFile(fileName, folderName, newBookmark)
    window.close()


  getDirectoryContents: (folderName) ->
    client = @dbclient
    client.readdir folderName, (error, entries) =>
      if (error)
        return @showError(error); # Something went wrong.
      return entries

  addToExistingFile: (fileName, folderName, newBookmark) ->
    newFileData = ''
    client = @dbclient
    client.readFile (folderName + '/' + fileName), (error, data) =>
      if (error)
        return @showError(error); # Something went wrong.
      newFileData = data + newBookmark
      client.writeFile (folderName + '/' + fileName),
      newFileData,
      (error, stat) =>
        if (error)
          return @showError(error); # Something went wrong.
        #todo: DRY this
        console.log('File saved as revision ' + stat.versionTag)
        # $('#btnSave').button('reset')
        # window.close()

  addNewFile: (fileName, folderName, newBookmark) ->
    newFileData = ''
    client = @dbclient
    title = '#' + fileName.replace('.md', '') + '\n'
    newFileData = title + newFileData + newBookmark

    client.writeFile (folderName + '/' + fileName),
    newFileData,
    (error, stat) =>
      if (error)
        return @showError(error); # Something went wrong.
      console.log('File saved as revision ' + stat.versionTag)
      # $('#btnSave').button('reset')


popup = new Popup()
