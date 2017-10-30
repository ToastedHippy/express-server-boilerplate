var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("compile", () => {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('../maps',{includeContent: false, sourceRoot: '../src'}))
        .pipe(gulp.dest("bin"));
});

gulp.task("default", ['compile', 'watch']);

gulp.task('watch', ['compile'], () => {
  gulp.watch('src/**/*.ts', ['compile']);
});