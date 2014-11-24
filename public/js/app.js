/**
 * Created by jeremyt on 10/10/14.
 */

var nbrApp = angular.module('NbrApp', ['ngRoute', 'ngAnimate', 'ngMaterial', 'NbrAppControllers', 'NbrAppServices', 'NbrAppDirectives', 'ngMap']);

var nbrAppControllers = angular.module('NbrAppControllers', []);
var nbrAppServices = angular.module('NbrAppServices', []);
var nbrAppDirectives = angular.module('NbrAppDirectives', []);


var options = {};
options.api = {};
//options.api.base_url = "http://localhost:8080";
//options.api.base_url = "http://192.168.0.100:8080";
options.api.base_url = "http://nbr-test.herokuapp.com";

nbrApp.config(['$locationProvider', '$routeProvider',
    function($location, $routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            }).
            when('/hero', {
                templateUrl: 'partials/hero.html',
                controller: 'HeroCtrl'
            }).
            when('/where', {
                templateUrl: 'partials/where.html',
                controller: 'WhereCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

nbrApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});