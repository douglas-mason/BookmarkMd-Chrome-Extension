'use strict';

var _folderName = "";
var _fileName = "";
var _dbclient = {};

function showError(error) {
    console.log(error);
    $('#errorMessage').text(error);
}

function formatAsMarkdown(title, tags, url) {
    if (tags != undefined && tags.length > 0) {
        var tagList = tags.split(',');
        tags = '';
        tagList.forEach(function (item) {
            tags = tags + ' #' + item.trim();
        });
    }

    return '\n' + '[' + title + tags + '](' + url + ')' + '\n';
}

function getCategoryFileNameOverride(category) {
    return category.trim() + '.md';
}

function readBookmarkFile(folderName, fileName) {
    var doesCategoryOverrideExist = $('#txtCategory').val() !== undefined && $('#txtCategory').val().length > 0;
    var client = _dbclient;
    client.readdir(folderName, function (error, entries) {
        if (error) {
            return showError(error); // Something went wrong.
        }

        var newFileData = '';
        var newBookmark = formatAsMarkdown($('#txtTitle').val(), $('#txtTags').val(), $('#txtUrl').val());

        if (doesCategoryOverrideExist) {
            fileName = getCategoryFileNameOverride($('#txtCategory').val());
        }

        if ($.inArray(fileName, entries) > -1) {
            client.readFile(folderName + '/' + fileName, function (error, data) {
                if (error) {
                    return showError(error); // Something went wrong.
                }
                newFileData = data + newBookmark;
                client.writeFile(folderName + '/' + fileName, newFileData, function (error, stat) {
                    if (error) {
                        return showError(error); // Something went wrong.
                    }
                    //todo: DRY this
                    console.log('File saved as revision ' + stat.versionTag);
                    $('#btnSave').button('reset');
                    window.close();
                });

            });
        } else {
            var title = '#' + fileName.replace('.md', '') + '\n';
            newFileData = title + newFileData + newBookmark;

            client.writeFile(folderName + '/' + fileName, newFileData, function (error, stat) {
                if (error) {
                    return showError(error); // Something went wrong.
                }
                console.log('File saved as revision ' + stat.versionTag);
                $('#btnSave').button('reset')
                window.close();
            });
        }
    });
}

function init(config) {
    config = config || {};
    _folderName = config.folderName || '/BookmarkMd';
    _fileName = config.fileName || 'bookmarks.md';
    _dbclient = config.client;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        $('#txtUrl').val(tabs[0].url); //url
        $('#txtTitle').val(tabs[0].title); //title
    });
}

chrome.runtime.getBackgroundPage(function (backgroundWindow) {
    var client = backgroundWindow.client;
    if (client.isAuthenticated()) {
        init({
            'folderName': 'Bookmarks',
            'client': client
        });
    }
    else{
      client.authenticate(function(error, client){
        if(error){
          return showError(error);
        }
      });
    }
});

$('#btnSave').click(function () {
    $('#btnSave').button('saving');
    readBookmarkFile(_folderName, _fileName);
});

$(function () {
  $('[data-toggle="popover"]').popover()
})
