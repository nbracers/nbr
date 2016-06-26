/// <reference path="_references.ts"/>
/// <reference path="app.config.ts"/>

/// <reference path="services/dataservice.ts"/>
/// <reference path="services/urlservice.ts"/>
/// <reference path="services/utilityservice.ts"/>

/// <reference path="app.run.ts"/>

/// <reference path="components/landing/landing.ts"/>

/**
 * NbrApp core application module.
 * @preferred
 */
module NbrApp {
    'use strict';

    /**
     * Array of dependencies to be injected in the application "dependencies".
     */
    var dependencies = [
        'ngRoute',
        'ngAria',
        'ngAnimate',
        'ngMaterial'
    ];

    angular.module('NbrApp', dependencies)

        .config(configApp)

        .service('URLService', URLService)
        .service('DataService', DataService)
        .service('UtilityService', UtilityService)
        .controller('LandingController', LandingController)
        .run(runApp);
}
