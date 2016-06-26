/// <reference path="_references.ts"/>
/// <reference path="app.config.ts"/>

/// <reference path="services/dataservice.ts"/>
/// <reference path="services/urlservice.ts"/>
/// <reference path="services/utilityservice.ts"/>

/// <reference path="app.run.ts"/>

/// <reference path="components/calendar/calendar.ts"/>
/// <reference path="components/hero/hero.ts"/>
/// <reference path="components/landing/landing.ts"/>
/// <reference path="components/message/message.ts"/>
/// <reference path="components/sidenav/sidenav.ts"/>
/// <reference path="components/toolbar/toolbar.ts"/>
/// <reference path="components/where/where.ts"/>

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
        .controller('CalendarController', CalendarController)
        .controller('HeroController', HeroController)
        .controller('LandingController', LandingController)
        .controller('MessageController', MessageController)
        .controller('SidenavController', SidenavController)
        .controller('ToolbarController', ToolbarController)
        .controller('WhereController', WhereController)
        .run(runApp);
}
