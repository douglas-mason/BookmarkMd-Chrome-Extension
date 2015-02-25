'use strict'

@folderName = ""
@fileName = ""
@dbclient = {}

@showError = (error) ->
  console.log(error)
  $('#btnSave').button('reset')
  $('#errorMessage').text(error)
  $('#alert-container').removeClass('hide')

@formatAsMarkdown = (title, tags, url) ->
  if (tags not undefined and tags.length > 0)
    tagList = tags.split(',')
    tags = ''
    tagList.forEach (item) ->
      tags = tags + ' #' + item.trim()
  return '\n' + '[' + title + tags + '](' + url + ')' + '\n'

@getCategoryFileNameOverride = (category) ->
  return category.trim() + '.md'

@readBookmarkFile = (folderName, fileName) ->
  doesCategoryOverrideExist = $('#txtCategory').val() not undefined and
  $('#txtCategory').val().length > 0
  client = @dbclient
  client.readdir folderName, (error, entries) ->
    if (error)
      return showError(error); # Something went wrong.

    newFileData = ''
    newBookmark = formatAsMarkdown($('#txtTitle').val(),
    $('#txtTags').val(), $('#txtUrl').val())

    if (doesCategoryOverrideExist)
      fileName = getCategoryFileNameOverride($('#txtCategory').val())

    if ($.inArray(fileName, entries) > -1)
      client.readFile folderName + '/' + fileName, (error, data) ->
        if (error)
          return showError(error); # Something went wrong.
        newFileData = data + newBookmark
        client.writeFile folderName + '/' + fileName,
        newFileData,
        (error, stat) ->
          if (error)
            return showError(error); # Something went wrong.
          #todo: DRY this
          console.log('File saved as revision ' + stat.versionTag)
          $('#btnSave').button('reset')
          window.close()

    else
      title = '#' + fileName.replace('.md', '') + '\n'
      newFileData = title + newFileData + newBookmark

      client.writeFile folderName + '/' + fileName,
      newFileData,
      (error, stat) ->
        if (error)
          return showError(error); # Something went wrong.
        console.log('File saved as revision ' + stat.versionTag)
        $('#btnSave').button('reset')
        window.close()

@init = (config) ->
  @folderName = config?.folderName || '/BookmarkMd'
  @fileName = config?.fileName || 'bookmarks.md'
  @dbclient = config?.client
  chrome.tabs.query {active: true,currentWindow: true},
  (tabs) ->
    $('#txtUrl').val(tabs[0].url) #url
    $('#txtTitle').val(tabs[0].title) #title

chrome.runtime.getBackgroundPage (backgroundWindow) ->
  client = backgroundWindow.client
  if (client.isAuthenticated())
    init({
      'folderName': 'Bookmarks',
      'client': client
    })
  else
    client.authenticate (error, client) ->
      if(error)
        return showError(error)

$('#btnSave').click ->
  $('#btnSave').button('saving')
  readBookmarkFile(@folderName, @fileName)

$('#btnCloseAlert').click ->
  $('#alert-container').addClass('hide')

$(->
  $('[data-toggle="popover"]').popover()
)
