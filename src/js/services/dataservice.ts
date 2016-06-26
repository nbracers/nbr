/// <reference path="../_references.ts"/>
/// <reference path="utilityservice.ts"/>
/// <reference path="urlservice.ts"/>
/// <reference path="../models/models.ts"/>

module NbrApp {
    export interface IDataService {
    }

    export class DataService implements IDataService {
        static $inject = [];
        constructor () {
            console.log('--> DataService started ...');
        }
    }
}
