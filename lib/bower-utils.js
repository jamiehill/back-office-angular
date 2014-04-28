'strict'

var fs    = require('fs')
  , path  = require('path')
  , gutil = require('gulp-util')
  , _     = require('lodash')
  , bower = require('bower')
  , through = require('through2')
  , walk = require('walk')


  , PLUGIN_NAME = 'gulp-bower-package';


function BowerUtils (opts) {

    this.opts                = opts = opts || {};
    this.opts.debug          = opts.debug || false;
    this.opts.bowerJson      = opts.bowerJson || "./bower.json";
    this.opts.bowerrc        = opts.bowerrc || "./.bowerrc";
    this.opts.bowerDirectory = opts.bowerDirectory || "./bower_components";
    this.opts.includeDev     = opts.includeDev || true;
    this._packages           = [];

    for(var opt in opts)
        this.log('Options: ', opt + '=' + opts[opt]);
}


_.extend(BowerUtils.prototype, {


    'getBowerInstallDirectory': function() {
        var rc = path.resolve(this.opts.bowerrc))
          , dir = this.opts.bowerDirectory;

        if (fs.existsSync(rc))
            dir = JSON.parse(fs.readFileSync(rc)).directory;

        this.opts.bowerDirectory = path.resolve(dir);
        return this.opts.bowerDirectory;
    },

    'loadBowerConfig': function() {


        if (!fs.existsSync(this.opts.bowerJson))
            throw new gutil.PluginError(PLUGIN_NAME, "bower.json file does not exist at " + this.opts.bowerJson);


        return JSON.parse(fs.readFileSync(this.opts.bowerJson, "utf8"));
    },


    'getPackagePath': function(pkg) {
        var path;
        try {
            var rc = fs.readFileSync('.bowerrc', 'utf8');
            path = JSON.parse(rc).directory || 'bower_components';
        } catch (err) {
            path = 'bower_components';
        }

        path += '/' + pkg + '/';
        var config = fs.readFileSync(path + '.bower.json', 'utf8');
        var main = JSON.parse(config).main;
        return path + main;
    },


    'getInstallDirectory': function() {
        var bowerrc = (this.opts.bowerrc && fs.existsSync(this.opts.bowerrc));
        if (bowerrc)
            this.opts.bowerDirectory = this.getCustomDirectory();

        return this.opts.bowerDirectory;
    },


    'getCustomDirectory': function() {
        var bowerrc = this.opts.bowerrc
          , json    = JSON.parse(fs.readFileSync(bowerrc))
          , dir     = path.dirname(bowerrc)
          , dir     = path.join(dir, "/", json.directory.toString());   

        return dir;
    },


    'getInstalledPackages': function() {
        var bowerJson = this.loadBowerConfig()
          , deps = bowerJson.dependencies || {}
          , devDeps = bowerJson.devDependencies || {};

        var packages = _.keys(deps);
        if (this.opts.includeDev)
            packages.concat(_.keys(devDeps))
     
        return packages;
    },


    'getPackageConfigs': function() {
        var configs = [], packageJson, scope = this;

        _.forEach(this.getInstalledPackages(), function(package) {
            packageJson = path.join('./', scope.opts.bowerDirectory.toString(), "/", package.toString(), 'bower.json');
            packageJson = path.resolve(packageJson);

            if (!fs.existsSync(packageJson))
                packageJson.replace('/bower.json', '/.bower.json');

            configs.push(JSON.parse(fs.readFileSync(packageJson, "utf8")));
        });
        return configs;
    },


    'getPackageProps': function(prop) {
        var props = [];
        _.forEach(this.getPackageConfigs(), function(json) {
            if (json.hasOwnProperty(prop))
                props.push(json[prop]);
        });
        this.log(prop+': ', props.join('|'));
        return props;
    },

    /**
     * Retrieves a given property value from each of the installed bower packages' config files.
     */
    'getPackages': function() {

        var packageJson, scope = this, json;

        _.forEach(this.getInstalledPackages(), function(package) {

            scope.log('Path: ', package);
            packagePath = path.join('./', scope.opts.bowerDirectory.toString(), "/", package.toString());

            packageJson = path.join(packagePath, 'bower.json');
            packageJson = path.resolve(packageJson);

            if (!fs.existsSync(packageJson))
                packageJson.replace('/bower.json', '/.bower.json');

            json = JSON.parse(fs.readFileSync(packageJson, "utf8"));

            packagePaths = (typeof json.main === 'string') ? [json.main] : json.main;
            _.forEach(packagePaths, function(pp){

                packageJS = path.join(packagePath, pp.toString());
                scope._packages[json.name] = path.resolve(packageJS)


            })      
            
        });

        for(var pack in this._packages)
            this.log('Options: ', pack + '=' + this._packages[pack]);

        return _.values(this._packages);
    },


    /**
     * Retrieves a given property value from each of the installed bower packages' config files.
     */
    'getPackagePaths': function() {

        var packageJson, scope = this, json;

        _.forEach(this.getInstalledPackages(), function(package) {

            scope.log('Path: ', package);
            packagePath = path.join('./', scope.opts.bowerDirectory.toString(), "/", package.toString());

            packageJson = path.join(packagePath, 'bower.json');
            packageJson = path.resolve(packageJson);

            if (!fs.existsSync(packageJson))
                packageJson.replace('/bower.json', '/.bower.json');

            json = JSON.parse(fs.readFileSync(packageJson, "utf8"));

            packagePaths = (typeof json.main === 'string') ? [json.main] : json.main;
            _.forEach(packagePaths, function(pp){

                packageJS = path.join(packagePath, pp.toString());
                scope._packages[json.name] = path.resolve(packageJS)


                var BowerPackage = require('./Package');
                new BowerPackage()
            })      
            
        });

        for(var pack in this._packages)
            this.log('Options: ', pack + '=' + this._packages[pack]);

        return _.values(this._packages);
    },


    'log': function(title, message) {
        if (this.opts.debug === true) gutil.log(title + gutil.colors.green(message));
    }
});


module.exports = function(opts) {
    return new BowerUtils(opts);
};




