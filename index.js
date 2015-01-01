'use strict';
var fs = require('fs');
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

var PLUGIN_NAME = 'gulp-theme-less';

var defaults = {
    importLessFiles: true,
    excludeLessFiles: [],
    removeExcludeLessFiles: true
};

// plugin level function (dealing with files)
function gulpThemeColors(options) {

    options = _.extend({}, defaults, options);

    var objectStream = through.obj(function(file, enc, cb){
        var _this = this;

        if (file.isStream()) {
            _this.emit('error', pluginError('Streaming not supported'));
            return cb();
        }

        try {
            var data = file.isNull() ? '' : file.contents.toString();

            if(options.importLessFiles){
                data = importLessFiles(data, options, file);
            }

            data = cleanPropertiesWithoutVariables(cleanStaticMixins(data));

            file.contents = new Buffer(data);

            _this.push(file);

        } catch (err) {
            err.fileName = file.path;
            _this.emit('error', pluginError(err));
        }

        cb();
    });

    return objectStream;
}

/**
 * Take less files to import and include in the file
 */
function importLessFiles(data, options, file){

    var filesToImport = [];

    while(filesToImport !== false){
        _.forEach(filesToImport, function(toImport){

            var importData = readFile(path.resolve(file.base, toImport.filePath));

            data = data.replace(new RegExp(toImport.sentence), importData);
        });

        var temp = searchFilesToImport(data, options, file);

        data = temp.data;

        filesToImport = temp.filesToImport;
    }

    return data;
}

/**
 * Search files than need to be imported.
 * Return the new data, and an array of filesToImport, or false.
 */
function searchFilesToImport(data, options, file){
    //Take @import sentences
    var imports = data.match(/@import.+\.less['|"];/g);

    //Array with of objects with 'sentence' and 'filePath'
    var filesToImport = _.map(imports, function(importSentence){

        return {sentence: importSentence, filePath: importSentence.match(/'.*?'|".*?"/)[0].replace(/['"]/g, '')};
    });

    if(options.excludeLessFiles.length > 0)
        filesToImport = _.filter(filesToImport, function(toImport){

            var filter = _.indexOf(options.excludeLessFiles, toImport.filePath) === -1;

            if(options.removeExcludeLessFiles && !filter)
                //Remove sentence from file
                data = data.replace(new RegExp(toImport.sentence), '');

            return filter;
        });

    return {data: data, filesToImport: filesToImport.length > 0 ? filesToImport : false};
}

/**
 * Check if mixin is static, and delete it.
 */
function cleanStaticMixins(data){

    var searchMixins = data.match(/^[^:;@]+;/gm);

    //Clean and take unique mixins
    var mixins = _.uniq(_.map(searchMixins, function(mixin){
        return mixin.replace(/;/, '').trim();
    }));

    _.forEach(mixins, function(value){
        //If the mixin doesn't have a variable, delete it.
        if(data.match(new RegExp('\\B\\'+value+'[ ]+\\{[^}@]+}', 'gm'))){
            data = data.replace(new RegExp('\\B\\'+value+'([ ]+|);', 'gm'), '');
        }
    });

    return data;
}

/**
 * If a property doesn't have a '@', then is static and can be deleted.
 * Only properties, no mixins.
 */
function cleanPropertiesWithoutVariables(data){

    data = data.replace(/^[^@{}]+:[^@{};]+;/gm, '');

    return cleanSelectorsWithoutRules(data);
}

/**
 * If a selector have a property, then have a semicolon ';'. If not, the selector is empty.
 */
function cleanSelectorsWithoutRules(data){

    var oldLength = 0;

    while(data.length !== oldLength){
        oldLength = data.length;

        data = data.replace(/^[^;{}]+\{[^;{}]+}/gm, '');
    }

    return data;
}

function readFile(path){
    return fs.readFileSync(path, 'utf8')
}

function pluginError(msg) {
    return new gutil.PluginError(PLUGIN_NAME, msg);
}

// exporting the plugin main function
module.exports = gulpThemeColors;
