class window.Popup
  constructor: ->
    @initialize?()

  initialize: (config) =>
    @folderName = ""
    @fileName = ""
    @dbclient = {}

    @folderName = config?.folderName || '/Bookmark'
    @fileName = config?.fileName || 'bookmarks.md'
    @dbclient = config?.client

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

  showError: (error) ->
    console.log "Error: #{error}"
    toast "An error has occured.  Item not saved.", 4000

  formatAsMarkdown: (title, tags, url) ->
    if (tags isnt undefined and tags.length > 0)
      tagList = tags.split(',')
      tags = ''
      tagList.forEach (item) ->
        tags = tags + ' #' + item.trim()
    return '\n' + '[' + title + tags + '](' + url + ')' + '\n'

  getCategoryFileNameOverride: (category) ->
    return category.trim() + '.md'

  readBookmarkFile: () ->
    doesCategoryOverrideExist = $('#txtCategory').val() isnt undefined and
    $('#txtCategory').val().length > 0
    newBookmark = @formatAsMarkdown($('#txtTitle').val(),
    $('#txtTags').val(), $('#txtUrl').val())

    if (doesCategoryOverrideExist)
      @fileName = @getCategoryFileNameOverride($('#txtCategory').val())

    @processEntry(@fileName, @folderName, newBookmark)

  processEntry: (fileName, folderName, bookmark) ->
    client = @dbclient
    client.readdir folderName, (error, entries) =>
      if (error)
        return @showError(error)

      if ($.inArray(fileName, entries) > -1)
        @addToExistingFile(fileName, folderName, bookmark)
      else
        @addNewFile(fileName, folderName, bookmark)
      window.close()

  addToExistingFile: (fileName, folderName, newBookmark) ->
    newFileData = ''
    client = @dbclient
    client.readFile (folderName + '/' + fileName), (error, data) =>
      if (error)
        return @showError(error)
      newFileData = data + newBookmark
      client.writeFile (folderName + '/' + fileName),
      newFileData,
      (error, stat) =>
        if (error)
          return @showError(error)
        console.log('File saved as revision ' + stat.versionTag)

  addNewFile: (fileName, folderName, newBookmark) ->
    newFileData = ''
    client = @dbclient
    title = '#' + fileName.replace('.md', '') + '\n'
    newFileData = title + newFileData + newBookmark

    client.writeFile (folderName + '/' + fileName),
    newFileData,
    (error, stat) =>
      if (error)
        return @showError(error)
      console.log('File saved as revision ' + stat.versionTag)

#Main script
popup = new window.Popup()
nav = new window.Nav(popup.folderName)

chrome.tabs.query {active: true,currentWindow: true},
(tabs) ->
  $('#txtUrl').val(tabs[0].url) #url
  $('#txtTitle').val(tabs[0].title) #title

$('#btnSave').on "click",  ->
  popup.readBookmarkFile()

#side bar nav
$(".button-collapse").sideNav()
