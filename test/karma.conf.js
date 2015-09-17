module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-route/angular-route.js',      
      'public/bower_components/angular-aria/angular-aria.min.js',
      'public/bower_components/angular-animate/angular-animate.js',
      'public/bower_components/hammerjs/hammer.min.js',
      'public/bower_components/angular-material/angular-material.js',
      'public/bower_components/moment/moment.js',
      'public/bower_components/ngmap/build/scripts/ng-map.min.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/js/**/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};