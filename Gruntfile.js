var serveStatic = require('serve-static');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            allBaseInOne: {
                src: [
                    'src/content/js/base_dev/error.js',
                    'src/content/js/base_dev/config-dev.js',
                    'src/content/js/base_dev/config.js',
                    'src/content/js/base_dev/ajax.js',
                    'src/content/js/base_dev/cookie.js',
                    'src/content/js/base_dev/log.js',
                    'src/content/js/base_dev/guid.js',
                    'src/content/js/base_dev/pay.js',
                    'src/content/js/base_dev/second-page.js',
                    'src/content/js/base_dev/storage.js',
                    'src/content/js/base_dev/string.js',
                    'src/content/js/base_dev/template-helper.js',
                    'src/content/js/base_dev/tools.js',
                    'src/content/js/base_dev/go.js',
                    'src/content/js/base_dev/common.js',
                    'src/content/js/base_dev/wechat.js',
                    'src/content/js/base_dev/shopping.js',
                    'src/content/js/base_dev/html.js'
                ],
                dest: 'src/content/js/base/global.js'
            },
            allBaseInOnePro: {
                src: [
                    'src/content/js/base_dev/error.js',
                    'src/content/js/base_dev/config-pro.js',
                    'src/content/js/base_dev/config.js',
                    'src/content/js/base_dev/ajax.js',
                    'src/content/js/base_dev/cookie.js',
                    'src/content/js/base_dev/pay.js',
                    'src/content/js/base_dev/log.js',
                    'src/content/js/base_dev/guid.js',
                    'src/content/js/base_dev/second-page.js',
                    'src/content/js/base_dev/storage.js',
                    'src/content/js/base_dev/string.js',
                    'src/content/js/base_dev/template-helper.js',
                    'src/content/js/base_dev/tools.js',
                    'src/content/js/base_dev/go.js',
                    'src/content/js/base_dev/common.js',
                    'src/content/js/base_dev/wechat.js',
                    'src/content/js/base_dev/shopping.js',
                    'src/content/js/base_dev/html.js'
                ],
                dest: 'src/content/js/base/global.js'
            },
            allJsInOne: {
                src: [
                    'dist/content/js/lib/zepto.min.js',
                    'dist/content/js/lib/fastclick.min.js',
                    'dist/content/js/lib/template.js',
                    'dist/content/swiper/swiper.min.js'
                ],
                dest: 'dist/content/js/lib/libs.js'
            },
            allCssInOne: {
                options: {
                    separator: ''
                },
                // src: ['dist/content/css/**/*.css'],
                src: [
                    'dist/content/css/base/reset.css',
                    'dist/content/css/base/general.css',
                    'dist/content/css/base/structure.css',
                    'dist/content/css/base/components.css',
                    'dist/content/css/base/goods-nav-list.css',
                    'dist/content/css/base/shopping-suborder.css',
                    'dist/content/css/**/*.css'
                ],
                dest: 'dist/content/css/taiji.css'
            },
            deploy: {
                src: ['dist/.build/**/*.js'],
                dest: 'dist/app/main.js'
            }
        },
        copy: {
            deploy: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist'
                }]
            },
            afterDeploy: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        'content/images/common/logo.png',
                        'content/images/common/headicon.png',
                        'content/images/common/kongshuju@2x.png',
                        'content/images/common/d9x5.png',
                        'content/images/common/blank.png',
                        'content/images/common/default.png',
                        'content/images/common/head_54.png',
                        'content/images/common/icon-group-member.png',
                        'content/images/common/img_home_meigologo@2x.png'
                    ],
                    dest: 'dist'
                }]
            }
        },
        uglify: {
            deploy: { //按照原来的目录结构压缩所有JS文件
                options: {
                    mangle: {
                        except: ['_hmt'] //指定不进行压缩的标识符
                    },
                    compress: {
                        drop_console: true
                    },
                    report: "min" //输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: 'dist/content/js', //js目录
                    src: ['**/*.js', '!**/*.min.js'], //所有js文件
                    dest: 'dist/content/js', //输出到此目录下
                    ext: '.js' //指定扩展名
                }]
            }
        },
        cssmin: {
            deploy: {
                files: [{
                    expand: true,
                    cwd: 'dist/content/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/content/css',
                    ext: '.min.css'
                }]
            }
        },
        sass: {
            options: {
                style: 'expanded',
                unixNewlines: true,
                sourcemap: 'auto'
            },
            dist: {
                files: {
                    'src/content/css1/*.css': 'src/content/sass/*.sass'
                }
            },
            deploy: {
                files: [{
                    expand: true,
                    cwd: 'src/content/sass/',
                    src: ['*.sass', '*.scss'],
                    dest: 'src/content/css',
                    ext: '.css'
                }]
            }
        },

        watch: {
            javascript: {
                files: ['src/js/**/*.js'],
                tasks: ['concat:allInOne', 'uglify:buildsrc', 'uglify:buildrelease'],
                options: {
                    spawn: true,
                    interrupt: true,
                    livereload_bk: true
                }
            },
            global: {
                files: ['src/content/js/base_dev/*.js'],
                tasks: ['concat:allBaseInOne'],
                options: {
                    spawn: true,
                    interrupt: true,
                    livereload_bk: true
                }
            },
            sass: {
                files: [
                    'src/content/sass/**/*.sass',
                    'src/content/sass/**/*.scss'
                ],
                tasks: ['sass:deploy'],
                options: {
                    livereload_bk: true
                }
            },
            html: {
                files: [
                    'src/**/*.html',
                    'src/content/js/**/*.js'
                ],
                options: {
                    livereload_bk: true
                }
            }
        },
        clean: {
            all: ['dist/*'],
            removeDev: ['dist/content/css/common_dev', 'dist/content/js/global_dev'],
            removeCss: ['dist/content/css/*', '!dist/content/css/taiji.css'],
            removeJs: ['dist/content/js/base_dev'],
            removeSass: ['dist/content/sass'],
            deploy: ['dist/app/**/*.js', 'dist/.build', '!dist/app/main.js'],
            options: {
                force: true
            },
            afterDeploy: ['dist/sftp-config.json']
        },

        fixturesPath: "dist/content",

        htmlbuild: {
            deploy: {
                src: 'dist/**/*.html',
                dest: 'dist/',
                options: {
                    beautify: false,
                    prefix: '../',
                    relative: true,
                    replace: true,
                    styles: {
                        bundle: [
                            '<%= fixturesPath %>/css/rby.min.css'
                        ]
                    }
                }
            }
        },

        useminPrepare: {
            html: 'dist/index.html',
            options: {}
        },

        usemin: {
            html: 'dist/**/*.html',
            css: 'dist/content/css/*',
            options: {}
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            images: {
                src: ['dist/content/images/**/*']
            },
            js: {
                src: 'dist/content/js/**/*'
            },
            css: {
                src: 'dist/content/css/**/*'
            }
        },

        filerev_replace: {
            options: {
                assets_root: 'dist/content/'
            },
            compiled_assets: {
                src: 'dist/content/**/*.{css,js}'
            },
            views: {
                options: {
                    views_root: '/dist/content'
                },
                src: 'dist/**/*.html'
            }
        },

        connect: {
            options: {
                port: 8082,
                open: true,
                livereload_bk: 35729,
                hostname: '*'
            },
            server: {
                options: {
                    base: './src',
                    middleware: function(connect, options, middlewares) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            serveStatic('./src'),
                            proxy,
                        ];
                    }
                },
                proxies: [{
                    context: '/api',
                    host: '106.14.239.198',
                    port: 8080,
                    https: false,
                    changeOrigin: true,
                    headers: {
                        // host: 'm.meigooo.com'
                    },
                    rewrite: {
                        '^/api': '',
                    }
                }]
            },
            livereload_bk: {
                options: {
                    middleware: function(connect, options) {
                        var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];
                        return [
                            serveStatic('./src'),
                            middlewares,
                        ];
                        return middlewares;
                    }
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-filerev-replace');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('deploy', '打包发布', function(param) {
        param = param || 'pro';
        var tasks = ['concat:allBaseInOnePro'];
        if (param == 'dev') {
            tasks = ['concat:allBaseInOne'];
        }
        tasks = tasks.concat([
            'sass:deploy',
            'useminPrepare',
            'clean:all',
            'copy:deploy',
            'concat:allJsInOne',
            'clean:removeDev',
            'clean:removeJs',
            'clean:removeSass',
            'concat:allCssInOne',
            'clean:removeCss',
            'cssmin:deploy',
            'uglify:deploy',
            'htmlbuild:deploy',
            'filerev',
            'filerev_replace',
            'usemin',
            'copy:afterDeploy',
            'clean:afterDeploy'
        ]);
        grunt.task.run(tasks)
    });

    grunt.registerTask('server', '合并文件、启动开发服务、设置代理、开启监听', function() {
        grunt.task.run([
            // 'clean:server',
            'concat:allBaseInOne',
            'sass:deploy',
            'configureProxies:server',
            // 'connect:livereload_bk',
            'connect:server',
            'watch'
        ]);
    });

};
