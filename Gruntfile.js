module.exports = function(grunt) {
	var target = grunt.option('target');
	grunt.initConfig({
		compass: {
			dist: {
				options: {
					config:'config.rb',
					cssDir: 'dist/css',
					outputStyle: 'compressed' //expanded, nested, compact, or compressed
				}
			}
		},
		watch: {
			css: {
				files: 'sass/*.scss',
				tasks: ['compass']
			}
		},
		uglify: {
	      dist: {
	        src: 'js/main.js',
	        dest: 'dist/js/main.js'
	      }
	    },
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', []);
	grunt.registerTask('scss', ['watch']);
	grunt.registerTask('dist', ['uglify', 'compass']);
}

