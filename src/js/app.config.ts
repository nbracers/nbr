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
            });

        $mdThemingProvider.theme('deep-orange').primaryPalette('deep-orange');
        $mdThemingProvider.theme('grey').primaryPalette('grey');
    }
}
