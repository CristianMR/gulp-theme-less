var should = require('should');
var fs = require('fs');
var gulpThemeLess = require('../');
var gutil = require('gulp-util');
var path = require('path');

function createVinyl(lessFileName, contents) {
    var base = path.join(__dirname, 'lessFiles');
    var filePath = path.join(base, lessFileName);

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: contents || fs.readFileSync(filePath)
    });
}

describe('gulp-theme-less', function () {
    describe('gulpThemeLess()', function () {

        it('should have empty content file when it isNull()', function (done) {
            var stream = gulpThemeLess();
            var emptyFile = {
                isNull: function () { return true; },
                isStream: function () { return false; }
            };
            stream.on('data', function (data) {
                data.contents.toString().should.equal('');
                done();
            });
            stream.write(emptyFile);
        });

        it('should emit error when file isStream()', function (done) {
            var stream = gulpThemeLess();
            var streamFile = {
                isNull: function () { return false; },
                isStream: function () { return true; }
            };
            stream.on('error', function (err) {
                err.message.should.equal('Streaming not supported');
                done();
            });
            stream.write(streamFile);
        });

        it('should compile single less file', function (done) {
            var lessFile = createVinyl('single.less');

            var stream = gulpThemeLess();
            stream.on('data', function (lessFile) {
                should.exist(lessFile);
                should.exist(lessFile.path);
                should.exist(lessFile.relative);
                should.exist(lessFile.contents);
                lessFile.path.should.equal(path.join(__dirname, 'lessFiles', 'single.less'));
                String(lessFile.contents).should.equal(
                    fs.readFileSync(path.join(__dirname, 'expect/single.less'), 'utf8'));
                done();
            });
            stream.write(lessFile);
        });

        it('should emit error when import not found', function (done) {
            var stream = gulpThemeLess();
            var errorFile = createVinyl('somefile.less',
                new Buffer('@import \'kamchatka-is-a-country.less\';'));
            stream.on('error', function (err) {
                done();
            });
            stream.write(errorFile);
        });

        it('should import less files', function (done) {
            var lessFile = createVinyl('main.less');

            var stream = gulpThemeLess();

            stream.on('data', function (lessFile) {
                should.exist(lessFile);
                should.exist(lessFile.path);
                should.exist(lessFile.relative);
                should.exist(lessFile.contents);
                lessFile.path.should.equal(path.join(__dirname, 'lessFiles', 'main.less'));
                String(lessFile.contents).should.equal(
                    fs.readFileSync(path.join(__dirname, 'expect/main.less'), 'utf8'));
                done();
            });

            stream.write(lessFile);
        });

        it('should not import less files because importLessFiles is false', function (done) {
            var lessFile = createVinyl('main.less');

            var stream = gulpThemeLess({importLessFiles: false});

            stream.on('data', function (lessFile) {
                should.exist(lessFile);
                should.exist(lessFile.path);
                should.exist(lessFile.relative);
                should.exist(lessFile.contents);
                lessFile.path.should.equal(path.join(__dirname, 'lessFiles', 'main.less'));
                String(lessFile.contents).should.equal(
                    fs.readFileSync(path.join(__dirname, 'lessFiles', 'main.less'), 'utf8'));
                done();
            });

            stream.write(lessFile);
        });

        it('should not import less files because file is ignore and not remove import sentence', function (done) {
            var lessFile = createVinyl('main.less');

            var stream = gulpThemeLess({excludeLessFiles: ['single.less'], removeExcludeLessFiles: false});

            stream.on('data', function (lessFile) {
                should.exist(lessFile);
                should.exist(lessFile.path);
                should.exist(lessFile.relative);
                should.exist(lessFile.contents);
                lessFile.path.should.equal(path.join(__dirname, 'lessFiles', 'main.less'));
                String(lessFile.contents).should.equal(
                    fs.readFileSync(path.join(__dirname, 'lessFiles', 'main.less'), 'utf8'));
                done();
            });

            stream.write(lessFile);
        });
    });
});