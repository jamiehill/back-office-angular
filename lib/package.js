'strict'

var fs    = require('fs')
  , path  = require('path')
  , gutil = require('gulp-util')
  , _     = require('lodash');


function BowerPackage (opts) {

    this.opts                = opts = opts || {};
    this.id           	     = opts.id || null;
    this.name           	 = opts.name || null;
    this.path                = opts.path || null;
    this.opts.debug          = opts.debug || false;
    this.opts.bowerJson      = opts.bowerJson || "./bower.json";
    this.opts.bowerrc        = opts.bowerrc || "./.bowerrc";
    this.opts.bowerDirectory = opts.bowerDirectory || "./bower_components";
    this.opts.includeDev     = opts.includeDev || true;
    this._files              = {};
    this._configPath		 = null;
    this._json				 = null;
    this._main				 = null;

    for(var opt in opts)
        this.log('Options: ', opt + '=' + opts[opt]);
}


_.extend(BowerPackage.prototype, {
	'getConfig': function() {
		if (this._json)	return this._json;

	    this._configPath = path.join(this.path, 'bower.json');
	    this._configPath = path.resolve(this._configPath);

	    if (!fs.existsSync(packageJson))
	        this._configPath.replace('/bower.json', '/.bower.json');

	    this._json = JSON.parse(fs.readFileSync(this._configPath, "utf8"));
	    return this._json;
	}
}

BowerUtils.prototype.getConfig = function getPackageConfigs() {
	if (this._json)	return this._json;

    this._configPath = path.join(this.path, 'bower.json');
    this._configPath = path.resolve(this._configPath);

    if (!fs.existsSync(packageJson))
        this._configPath.replace('/bower.json', '/.bower.json');

    this._json = JSON.parse(fs.readFileSync(this._configPath, "utf8"));
    return this._json;
}


/**
 * Retrieves the main endtrypoint files for this package
 */
BowerUtils.prototype.getFiles = function getFiles() {

	if (this._files) return this._files;

	var json = getConfig();
	this._main = Array.isArray(json.main) ? json.main : [json.main];

	_.forEach(this._main, function(p){
        file = path.join(path.dirname(this._configPath), p.toString());
        this._files.push(path.resolve(file));

        if (this.opts.debug === true)
        	gutil.log(this.name + gutil.colors.green(file));
    })  

    return this._files;
}


module.exports = BowerPackage;