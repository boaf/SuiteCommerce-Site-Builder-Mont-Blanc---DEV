var fs = require('fs')

module.exports = function (input, extension) {
    const NEW_LINE =  10

    var pos = 0
    var length = input.length
    var tmp = []
    var lines = []
    var allConf = []

    var ret = {
        indentSize: {},
        indentStyle: {},
    }

    while (pos < length) {
        code = input.charCodeAt(pos)

            if (code === NEW_LINE) {
                var str = tmp.join('')
                    if (str !== '') {
                        lines.push(str)
                    }
                tmp = []
            }
            else {
                tmp.push(input[pos])
            }

        pos++
    }

    lines.forEach(function (line, i) {
        if (line.match(/^\[\*\]$/)) {
            var next = lines[++i]
            while (!next.match(/^\[/)) {
                allConf.push(next)
                next = lines[i++]
            }
        }
    })


    var indentSize = []
    allConf.forEach(function (conf) {
        if (conf.match(/indent_size/)) {
            var length = conf.length
            var pos = 0
            var flag = false

            while (pos < length) {
                if (flag) {
                    indentSize.push(conf[pos])
                }
                if (conf[pos] === '=') {
                    flag = true
                }
                pos++
            }
        }
    })
    indentSize = indentSize.join('').trim() - 0

    var indentStyle = []
    allConf.forEach(function (conf) {
        if (conf.match(/indent_style/)) {
            var length = conf.length
            var pos = 0
            var flag = false
            while (pos < length) {
                if (flag) {
                    indentStyle.push(conf[pos])
                }
                if (conf[pos] === '=') {
                    flag = true
                }
                pos++
            }
        }
    })
    indentStyle = indentStyle.join('').trim()

    ret.indentSize.all = indentSize
    ret.indentStyle.all = indentStyle


    if (Array.isArray(extension) && extension.length !== 0) {
        var exConf = {}
        var exIndentSize = {}
        var exIndentStyle = {}

        extension.forEach(function (ex) {

            exConf[ex] = []
            var re = new RegExp("\\*\\." + ex)

            lines.forEach(function (line, i) {
                if (line.match(re)) {
                    var next = lines[++i]
                    while (!next.match(/^\[/)) {
                        exConf[ex].push(next)
                        next = lines[++i]
                    }
                }
            })


            exConf[ex].forEach(function (conf) {
                if (conf.match(/indent_size/)) {
                    var length = conf.length
                    var pos = 0
                    var flag = false

                    exIndentSize[ex] = []

                    while (pos < length) {
                        if (flag) {
                            exIndentSize[ex].push(conf[pos])
                        }
                        if (conf[pos] === '=') {
                            flag = true
                        }
                        pos++
                    }
                }
            })

            if (Array.isArray(exIndentSize[ex])) {
                exIndentSize[ex] = exIndentSize[ex].join('').trim() - 0
            }


            exConf[ex].forEach(function (conf) {
                if (conf.match(/indent_style/)) {
                    var length = conf.length
                    var pos = 0
                    var flag = false

                    exIndentStyle[ex] = []

                    while (pos < length) {
                        if (flag) {
                            exIndentStyle[ex].push(conf[pos])
                        }
                        if (conf[pos] === '=') {
                            flag = true
                        }
                        pos++
                    }
                }
            })

            if (Array.isArray(exIndentStyle[ex])) {
                exIndentStyle[ex] = exIndentStyle[ex].join('').trim()
            }


            ret.indentSize[ex] = exIndentSize[ex] || null
            ret.indentStyle[ex] = exIndentStyle[ex] || null
        })
    }

    return ret
}
