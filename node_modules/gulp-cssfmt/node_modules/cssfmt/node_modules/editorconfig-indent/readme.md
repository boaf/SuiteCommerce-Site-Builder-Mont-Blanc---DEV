# editorconfig-indent [![Build Status](https://travis-ci.org/morishitter/editorconfig-indent.svg)](https://travis-ci.org/morishitter/editorconfig-indent)

get `indent_size` and `indent_style` from `.editorconfig` file

## Installation

```shell
$ npm install editorconfig-indent
```

## Usage

```js
var fs = require('fs')
var getIndent = require('editorconfig-indent')
var editorconfig = fs.readFileSync('.editorconfig', 'utf-8')

getIndent(editorconfig)

/*
{
    indentSize: {
        all: 4
    },
    indentStyle: {
        all: 'space'
    }
}
*/


/* specify the file extension */
getIndent(editorconfig, ['css', 'scss'])

/*
{
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
*/
```

## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
