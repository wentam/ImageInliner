module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      build: {
        src: ['library/ImageInliner.js'],
        dest: 'build/ImageInliner.js'
      }
    },
    uglify: {
      build: {
        files: {
          'build/ImageInliner.min.js' : ['build/ImageInliner.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat','uglify']);
};
