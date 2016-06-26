/// <reference path="../_references.ts"/>

module NbrApp {
    "use strict";

    export interface IURLService {
    }

    export class URLService implements IURLService {
        static $inject = [];
        constructor() {
            console.log('--> URLService started ...');
        }
    }
}
