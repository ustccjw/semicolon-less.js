#!/usr/bin/env node
'use strict'

var fs = require('fs-extra')
var path = require('path')
var docopt = require('docopt').docopt
var tty = require('tty')
var pkg = require('../package.json')
var less = require('../')

var definitions = fs.readFileSync(__dirname + '/docopt', 'utf-8')
var options = docopt(definitions, {version: pkg.version})

if (options['-'] || !tty.isatty(process.stdin.fd)) {
	less(process.stdin).pipe(process.stdout)
	return
}

if (options['<src>'].length > 0) {
	var dest = options['--out'] || '.'
	console.log(options['<src>'])
	options['<src>'].forEach(function (f) {
		var input = fs.createReadStream(f)
		var destFile = path.join(dest, f)
		fs.ensureFile(destFile, function (err, data) {
			if (err) throw err
			var output = fs.createWriteStream(destFile)
			less(input).pipe(output)
		})
	})
	return
}

console.log(definitions)
