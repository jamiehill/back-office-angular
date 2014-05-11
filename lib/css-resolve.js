'strict'

var path = require('path'),
	packager = require('./packager')();


var cssResolve = function(file, cwd, callback) {


	var bowerDir = path.resolve(path.cwd+'bower_components'

	var relativePath = path.dirname(path.relative(path.resolve(cwd+'bower_components', file.path));

        // CSS path resolving
        // Taken from https://github.com/enyojs/enyo/blob/master/tools/minifier/minify.js
        var contents = file.contents.toString().replace(/url\([^)]*\)/g, function(match) {
          // find the url path, ignore quotes in url string
          var matches = /url\s*\(\s*(('([^']*)')|("([^"]*)")|([^'"]*))\s*\)/.exec(match),
            url = matches[3] || matches[5] || matches[6];

          // Don't modify data and http(s) urls
          if (/^data:/.test(url) || /^http(:?s)?:/.test(url)) {
            return "url(" + url + ")";
          }
          return "url(" + path.join(path.relative(settings.build.bower, settings.build.app), settings.build.bower, relativePath, url) + ")";
        });
        file.contents = new Buffer(contents);

        callback(null, file)
      }


module.exports = cssResolve;