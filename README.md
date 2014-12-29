gulp-theme-less
===============

A LESS plugin for Gulp. Clean LESS files, to make easy themes.

## Install

```
npm install gulp-less
```

## Usage

> gulpThemeLess(options)

```javascript
'use strict';

var gulp = require('gulp');
var gulpThemeLess = require('gulp-theme-less');

gulp.task('theme-less', function(){
    return gulp.src('./app/styles/main-style.less')
        .pipe(gulpThemeLess({excludeLessFiles: ['variables.less'], removeExcludeLessFiles: true}))
        .pipe(gulp.dest('./app/styles/themes/'));
});
```

## Options

There are some options, by default:

```javascript
var defaults = {
    importLessFiles: true,
    excludeLessFiles: [],
    removeExcludeLessFiles: true
};
```

### importLessFiles

Adds the import LESS files to the content.

> gulpThemeLess({importLessFiles: boolean})

**Example**:

Before

> variables file

```less
    @primaryColor: #eeeeee;
```

> Main file

```less
    /* Import variables */
    @import "all/the/path/to/variables.less";

    .style {
        color: @primaryColor;
    }
```

> Script

```javascript
    gulp.task('theme-less', function(){
        return gulp.src('./app/styles/main-style.less')
            .pipe(gulpThemeLess({excludeLessFiles: ['all/the/path/to/variables.less']}))
            .pipe(gulp.dest('./app/styles/themes/'));
    });
```

After

> Main File

```less
    /* Import variables */
    @primaryColor: #eeeeee;

    .style {
        color: @primaryColor;
    }
```

### excludeLessFiles

Don't adds the file content. By default the import sentence don't stay in the file.

> gulpThemeLess({excludeLessFiles: array})

**Example**:

Before

```less
    /* Import variables */
    @import "all/the/path/to/variables.less";

    .style {
        color: @primaryColor;
    }
```

> Script

```javascript
    gulp.task('theme-less', function(){
        return gulp.src('./app/styles/main-style.less')
            .pipe(gulpThemeLess({excludeLessFiles: ['all/the/path/to/variables.less']}))
            .pipe(gulp.dest('./app/styles/themes/'));
    });
```

After

```less
    /* Import variables */


    .style {
        color: @primaryColor;
    }
```

### removeExcludeLessFiles

If it's false, the import sentence stay in the file.

> gulpThemeLess({removeExcludeLessFiles: boolean})

## License

The MIT License (MIT)

Copyright (c) 2014 Cristian Martín Rios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.