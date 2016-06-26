/// <reference path="../../_references.ts"/>
/// <reference path="../../services/urlservice.ts"/>
/// <reference path="../../services/dataservice.ts"/>

module NbrApp {
	"use strict";

	export class WhereController {
		static $inject = ['URLService', 'DataService'];

		constructor(
			private urlService: IURLService,
			private dataService: DataService) {
			console.log('--> WhereController: started');
		}
	}
}
