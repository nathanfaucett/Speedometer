module.exports = function(grunt) {

    grunt.initConfig({
        jsbeautifier: {
            files: [
                "**/*.js",
                "!*.min.js",
                "!node_modules/**/*"
            ]
        },
        uglify: {
            compress: {
                options: {
                    output: {
                        beautify: false,
                        space_colon: false,
                        bracketize: true
                    },
                    compress: {
                        sequences: true,
                        hoist_vars: true
                    },
                    preserveLicenseComments: true,
                    mangle: true,

                    generateSourceMaps: false,
                    warnings: true
                },
                files: {
                    "speedometer.min.js": [
                        "speedometer.js"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.registerTask("default", ["jsbeautifier", "uglify"]);
};
