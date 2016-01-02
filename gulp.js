'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var gcmq = require('./index');

module.exports = function () {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-group-css-media-queries', 'Streaming not supported'));
			return cb();
		}

		try {
			file.contents = new Buffer(gcmq(file.contents.toString()));
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-group-css-media-queries', err));
		}

		this.push(file);
		cb();
	});
};
