/**
 * Created by jeremyt on 10/10/14.
 */

nbrAppControllers.controller("NavCtrl", function ($scope, $location, $timeout, $mdSidenav) {

        /*
            scope variables
         */
        $scope.menuSelectedIndex = 0;
        $scope.menuButtonObject = [
            {label: 'Main', target: '#/', disabled: false},
            {label: 'Multihero', target: '#/hero', disabled: false},
            {label: 'President finder', target: '#/president', disabled: true},
            {label: 'About', target: '#/about', disabled: true}
        ];

        /*
            listener for menu change events
         */
        $scope.$on('MENU_CHANGED', function (event, ind) {
            $scope.menuSelectedIndex = ind;
        });

        /*
            toggle open side-menu
        */
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        $scope.close = function() {
            $mdSidenav('left').close();
        };

    }
);


nbrAppControllers.controller("MainCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav) {
        /*
            on activate, fires MENU_CHANGED with correct index
         */
        $rootScope.$broadcast('MENU_CHANGED', 0);

        /*
            scope variables
         */
        $scope.footerText = "main";
        $scope.racers = [
            {name: 'Geir Skari', points: 3000, position: 1},
            {name: 'Kjetil Ask', points: 2999, position: 2},
            {name: 'Frode Nilsen', points: 2998, position: 3}
        ];

        $scope.competitions = [
            {name: 'Triathlon', date: '25/08/2014', location: 'Sørli sletta', completed: true},
            {name: 'Distance running', date: '15/09/2014', location: 'Sørli sletta', completed: true},
            {name: 'Uphill running', date: '27/10/2014', location: 'Sørli sletta', completed: true},
            {name: 'Bankett', date: '31/10/2014', location: 'Xing-Xing', completed: true},
            {name: 'Swimming', date: '01/12/2014', location: 'Libadet', completed: false}
        ];

        $scope.getTrophyColor = function(racer) {
            switch(racer.position) {
                case 2:
                    return 'trophySilver';
                    break;
                case 3:
                    return 'trophyBronze';
                    break;
                default:
                    return 'trophyGold';
            }
        };

        $scope.getCompetitionStatus = function(competition) {
            if(competition.completed) {
                return 'competitionCompleted';
            }
            else {
                return '';
            }
        }
    }
);

nbrAppControllers.controller("HeroCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav) {
        /*
            on activate, fires MENU_CHANGED with correct index
         */
        $rootScope.$broadcast('MENU_CHANGED', 1);

        /*
            scope variables
         */
        $scope.footerText = "hero";
    }
);