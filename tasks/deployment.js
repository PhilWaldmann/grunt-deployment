/*
 * grunt-deployment
 * 
 *
 * Copyright (c) 2014 Philipp Waldmann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var spawn = grunt.util.spawn;

  grunt.registerMultiTask('deployment', 'Deploy files to any git branch + tags', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      branch: 'deployment',
      commit: 'auto-commit',
      remote: 'origin'
    });

    var src = this.filesSrc[0];

    if (!grunt.file.isDir(src)) {
      grunt.fail.warn('A source directory is needed.');
      return false;
    }

    //git helper
    function git(args, log) {
      if(log === undefined) log = true;
      return function(next) {
        if(log) grunt.log.writeln('Running ' + args.join(' ').green);
        spawn({
          cmd: 'git',
          args: args,
          opts: {cwd: src}
        }, function(err, result, code){
          if(err){
            var msg = result.stderr;
            if(!msg) msg = result.stdout;
            if(!msg) msg = err;
            grunt.fail.warn('git error: ' + msg + '.');
            return false;
          }
          next(err, result, code)
        });
      };
    }


    //check if tag already exists
    function checkLastTag(next){
      git(['tag'], false)(function(err, result){
        var tags = result.stdout.split('\n');

        if(tags.indexOf(options.tag) !== -1){
          grunt.fail.warn('Tag "' + options.tag + '" already exists');
          return false;
        }
        
        next();
      });
    }
    
    
    function checkBranch(next){
      git(['rev-parse', '--abbrev-ref', 'HEAD'], false)(function(err, result){
        var current_branch = result.stdout;

        if(current_branch != options.branch){
          grunt.fail.warn('Currently not on branch "' + options.branch + '"');
          return false;
        }
        
        next();
      });
    }
    

    var done = this.async();
    
    grunt.util.async.series([
      checkBranch,
      checkLastTag,
      git(['add', '--all']),
      git(['commit', '--message="' + options.commit + '"']),
      git(['tag', options.tag]),
      git(['push', '--tags', options.remote, options.branch])
    ], done);
  });

};
