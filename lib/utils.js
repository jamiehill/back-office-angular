var fs = require('fs')
  , path = require('path');


/**
 * Returns an array of name/path objects for all bower files
 */
var getBowerFiles = function() {
    var bowerJson = JSON.parse(fs.readFileSync('bower.json'))
      , files = [];

    for(var key in bowerJson.dependencies) {
        var p = path.join('./bower_components', key.toString(), '.bower.json')
          , json = JSON.parse(fs.readFileSync(p))
          , pp = p.replace('/.bower.json', '');

        if (typeof json.main === 'string') {  
            file = path.join(pp, json.main.toString());
            files.push({ name: json.name, path: "./"+file })
        }

        else if (Array.isArray(json.main)) {
            for(var obj in json.main) {
                if (path.extname(obj) === '.js') {
                    file = path.join(pp, obj.toString())
                    files.push({ name: json.name, path: file });
                }
            }
        }

        // files.push({ name: json.name, path: "./"+file });
    }
    return files;
}


/**
 * @param block
 */
var startBlock = function(block) {
    $.util.log($.util.colors.white(block+': ---------------------------'));
}

/**
 * @param block
 */
var endBlock = function() {
    $.util.log($.util.colors.white('----------------------------------------'));
}



module.exports = {
    getBowerFiles : getBowerFiles,
    startBlock : startBlock,
    endBlock : endBlock
}