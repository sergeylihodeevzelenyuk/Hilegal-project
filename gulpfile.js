let project_folder = "dist";
let source_folder = "#src";

let path = {
    build: {
        html: project_folder + "/pages/",
        css: project_folder + "/pages/",
        img: project_folder + "/assets/",
    },
    src: {
        html: [source_folder + "/pages/**/{about-us,index,services,service-page,team,team-member-page,contact}.html"],
        css: source_folder + "/pages/**/main.scss",
        img: source_folder + "/assets/**/*.{jpg,jpeg,png,svg}",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/**/*.scss",
        img: source_folder + "/assets/**/*.{jpg,jpeg,png,svg}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    imagemin = require('gulp-imagemin');


function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/pages/homepage/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                     outputStyle: "expanded"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBos: false}],
                interlaced: true,
                optimizationlevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}


function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.img], images);

}

function claen(params) {
    return del(path.clean);
}

let build = gulp.series(claen, gulp.parallel(css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
