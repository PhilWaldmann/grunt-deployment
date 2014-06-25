/*
 * grunt-deployment
 * 
 *
 * Copyright (c) 2014 Philipp Waldmann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Configuration to be run (and then tested).
    deployment: {
      default_options: {
        options: {
          branch: 'deployment',
          tag: 'v<%= pkg.version %>',
          commit: 'deploy <%= pkg.version %>'
        },
        src: 'deployment'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['deployment']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
