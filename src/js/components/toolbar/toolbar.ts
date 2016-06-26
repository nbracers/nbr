/// <reference path="../../_references.ts"/>

module NbrApp {
	"use strict";
	import ISidenavService = angular.material.ISidenavService;

	export class ToolbarController {
		static $inject = ['$mdSidenav'];

		constructor(
			private $mdSidenav: ISidenavService) {
			console.log('--> ToolbarController: started');
		}

		openSideMenu(): void {
			this.$mdSidenav('left').open();
		}
	}
}
