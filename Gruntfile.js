module.exports = function(grunt) {
	var target = grunt.option('target');
	grunt.initConfig({
		compass: {
			dist: {
				options: {
					config:'config/compass.rb',
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
	    copy: {
		  main: {
		    files: [
				{
				    src: 'index.html',
				    dest: 'dist/index.html'
				},
				{
				    src: 'songs.js',
				    dest: 'dist/songs.js'
				},
				{
					expand: true,
					src: ['audio/*'],
					dest: 'dist',
					filter: 'isFile'
				},
				{
					expand: true,
					src: ['libs/*'],
					dest: 'dist',
					filter: 'isFile'
				},
				{
					expand: true,
					src: ['img/*'],
					dest: 'dist',
					filter: 'isFile'
				}
			]
		  },
		},
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', []);
	grunt.registerTask('scss', ['watch']);
	grunt.registerTask('dist', ['uglify', 'compass', 'copy']);
}

