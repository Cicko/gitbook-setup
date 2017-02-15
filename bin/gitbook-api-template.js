var tacks = require('tacks')
var dir = Tacks.Dir
var file = Tacks.File
var symlink = Tacks.Symlink




var apiTemplate = new Tacks(Dir({
  'book.json': symlink('../templates/api/book.json'),
  'methods.md': symlink('../templates/api/methods.md')
}))


exports.createAPIBook = function () {
  apiTemplate.create('templates');
}
