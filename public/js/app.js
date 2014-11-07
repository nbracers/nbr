/**
 * Created by jeremyt on 10/10/14.
 */

var nbrApp = angular.module('NbrApp', ['ngRoute', 'ngAnimate', 'ngMaterial', 'NbrAppControllers', 'NbrAppServices', 'NbrAppDirectives']);

var nbrAppControllers = angular.module('NbrAppControllers', []);
var nbrAppServices = angular.module('NbrAppServices', []);
var nbrAppDirectives = angular.module('NbrAppDirectives', []);


var options = {};
options.api = {};
options.api.base_url = "http://localhost:8080";

nbrApp.config(['$locationProvider', '$routeProvider',
    function($location, $routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);