# grunt-deployment

> Deploy files to any git branch + tags

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-deployment --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-deployment');
```

## The "deployment" task

### Overview
In your project's Gruntfile, add a section named `deployment` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  
  deployment: {
    options: {
      branch: 'deployment',
      tag: 'v<%= pkg.version %>',
      commit: 'deploy <%= pkg.version %>'
    },
    src: 'directory/to/deploy'
  },
});
```

### Options

#### options.branch
Type: `String`
Default value: `deployment`

The branch to push to.

#### options.commit
Type: `String`
Default value: `auto-commit`

The commit message

#### options.tag
Type: `String`
Default value: null

The tag name

#### options.remote
Type: `String`
Default value: `origin`

The remote name


## The "clone" task

### Overview
In your project's Gruntfile, add a section named `clone` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  
  clone: {
    options: {
      branch: 'deployment'
    },
    src: 'directory/to/deploy'
  },
});
```

### Options

#### options.branch
Type: `String`
Default value: `deployment`

The branch to clone.

#### options.remote
Type: `String`
Default value: `origin`

The remote name

#### options.url
Type: `String`
Default value: `null`

By default it will take the url of the remote of the current directory.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
