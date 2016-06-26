/// <reference path="../_references.ts"/>
/// <reference path="../models/models.ts"/>

module NbrApp {
    "use strict";

    export interface IUtilityService {
    }

    export class UtilityService implements IUtilityService {
        constructor() {
	        console.log('--> UtilityService started ...');
        }
    }
}
