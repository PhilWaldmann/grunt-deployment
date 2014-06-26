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


  //git helper
  function git(args, src, log) {
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
  
  

  grunt.registerMultiTask('clone', 'Clone the current report to another location with a specific branch', function() {
    var options = this.options({
      branch: 'deployment',
      remote: 'origin'
    });
        
    var src = this.filesSrc[0];
    
    
    if (src) {
      grunt.file.delete(src);
    }
    
    var done = this.async();
    git(['config', '--get', 'remote.' + options.remote + '.url'], '.', false)(function(err, result){
      var url = result.stdout;
      
      git(['clone', url, '-b', options.branch, src])(done);
      
    });
    
  });




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

  

    //check if tag already exists
    function checkLastTag(next){
      git(['tag'], src, false)(function(err, result){
        var tags = result.stdout.split('\n');

        if(tags.indexOf(options.tag) !== -1){
          grunt.fail.warn('Tag "' + options.tag + '" already exists');
          return false;
        }
        
        next();
      });
    }
    
    
    function checkBranch(next){
      git(['rev-parse', '--abbrev-ref', 'HEAD'], src, false)(function(err, result){
        var current_branch = result.stdout;

        if(current_branch != options.branch){
          grunt.fail.warn('Currently not on branch "' + options.branch + '"');
          return false;
        }
        
        next();
      });
    }
    

    var done = this.async();
    var tasks = [
      checkBranch,
      checkLastTag,
      git(['add', '--all'], src),
      git(['commit', '--message="' + options.commit + '"'], src),
      git(['tag', options.tag], src),
      git(['push', '--tags', options.remote, options.branch], src)
    ];
    
    if(!options.tag){
      tasks.splice(4, 1);
    }
    
    grunt.util.async.series(tasks, done);
  });

};
