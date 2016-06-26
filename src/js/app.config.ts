/// <reference path="_references.ts"/>

module NbrApp {

    'use strict';
    import IThemingProvider = angular.material.IThemingProvider;

    configApp.$inject = ['$routeProvider', '$mdThemingProvider'];

    /**
     * Application-wide overall configuration
     * @param $routeProvider  Used for defining default routing.
     */
    export function configApp($routeProvider: ng.route.IRouteProvider, $mdThemingProvider: IThemingProvider) {

        // Routes
        $routeProvider.
            when('/', {
                templateUrl : 'js/components/landing/landing.html'
            }).
            when('/calendar', {
                templateUrl: 'js/components/calendar/calendar.html'
            }).
            when('/hero', {
                templateUrl: 'js/components/hero/hero.html'
            }).
            when('/where', {
                templateUrl: 'js/components/where/where.html'
            }).
            when('/message', {
                templateUrl: 'js/components/message/message.html'
            }).
            otherwise({
                redirectTo: '/'
            });

        $mdThemingProvider.theme('deep-orange').primaryPalette('deep-orange');
        $mdThemingProvider.theme('grey').primaryPalette('grey');
    }
}
