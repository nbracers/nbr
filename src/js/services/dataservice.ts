/// <reference path="../_references.ts"/>
/// <reference path="utilityservice.ts"/>
/// <reference path="urlservice.ts"/>
/// <reference path="../models/models.ts"/>

module NbrApp {
    export interface IDataService {
        /**
         * return the current selected button index from the sidenav
         * @return the index
         */
        getSelectedMenuIndex(): number;
        /**
         * change the menu index on the sidenav
         * @param number the new index
         */
        changeMenuIndex(newIndex: number): void;
    }

    export class DataService implements IDataService {
        static $inject = [];

        private menuSelectedIndex: number = 0;

        constructor () {
            console.log('--> DataService started ...');
        }

        getSelectedMenuIndex(): number {
            return this.menuSelectedIndex;
        }

        changeMenuIndex(newIndex: number): void {
            this.menuSelectedIndex = newIndex;
        }
    }
}
