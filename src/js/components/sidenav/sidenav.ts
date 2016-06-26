/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataservice.ts"/>

module NbrApp {
	"use strict";

	export class SidenavController {
		static $inject = ['DataService'];

		private menuButtons: Array<{}> = [
			{label: 'Hjem', target: '#/', disabled: false},
			{label: 'Øvelser', target: '#/calendar', disabled: false},
			{label: 'Multiheroes', target: '#/hero', disabled: false},
			{label: 'President finder', target: '#/where', disabled: false},
			{label: 'Om', target: '#/about', disabled: true}
		];

		constructor(
			private dataService: DataService) {
			console.log('--> SidenavController: started');
		}
	}
}
