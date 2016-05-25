var fs = require('fs')
var test = require('tape')
var editorconfigIndent = require('..')
var editorconfig = fs.readFileSync('.editorconfig', 'utf-8')

test('editorconfig-indent', function (t) {
    var expected = {
        indentSize: {
            all: 4
        },
        indentStyle: {
            all: 'space'
        }
    }
    var actual = editorconfigIndent(editorconfig)
    t.same(expected, actual)
    t.end()
})

test('editorconfig-indent', function (t) {
    var expected = {
        indentSize: {
            all: 4,
            css: 2,
            scss: null
        },
        indentStyle: {
            all: 'space',
            css: null,
            scss: null
        }
    }
    var actual = editorconfigIndent(editorconfig, ['css', 'scss'])
    t.same(expected, actual)
    t.end()
})
