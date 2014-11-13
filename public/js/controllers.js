/**
 * Created by jeremyt on 10/10/14.
 */

nbrAppControllers.controller("NavCtrl", function ($scope, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {

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
        $scope.allseasons = [];
        $scope.currentSeason = null;

        initNav();
        function initNav() {
            /*
                let's get all seasons and current season at the top level controller
             */
            var d = new Date();
            var thisyear = d.getFullYear();

            console.log('--> this year: '+thisyear);
            var allseasonsPromise = NbrService.getAllSeasons();
            allseasonsPromise.success(function(data) {
                console.log('--> number of seasons: '+data.length);

                /*
                    seasons get ordered from newest to oldest
                 */
                $scope.allseasons = data.sort(NbrUtils.sortSeasonArray).reverse();
                $scope.currentSeason = $scope.allseasons[0];

                console.log('--> current season: '+$scope.currentSeason.label);
            });

        };

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


nbrAppControllers.controller("MainCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {

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

        /*
            trophy color based on position
         */
        $scope.getTrophyColor = function(racer) {
            switch(racer.position) {
                case 1:
                    return 'trophyGold';
                    break;
                case 2:
                    return 'trophySilver';
                    break;
                case 3:
                    return 'trophyBronze';
                    break;
                default:
                    return '';
            }
        };

        $scope.getCompetitionStatus = function(dateString) {
            var momentDate = moment(dateString);
            var momentNow = moment();

            if(momentNow.diff(momentDate) > 0) {
                return 'competitionCompleted';
            }
            else {
                return '';
            }
        };

        $scope.getFormattedDate = function(dateString) {
            var momentDate = moment(dateString);
            return momentDate.format('DD/MM/YYYY');
        };

        initMain();
        function initMain() {

            var heroPromise = NbrService.getHeroWithSeasonId($scope.currentSeason._id);
            heroPromise.success(function(data) {
                console.log('--> this years hero: '+data._id);
                $scope.competitions = (data.competitions).sort(NbrUtils.sortCompetitionArray);
                console.log('--> nbr competitions : '+$scope.competitions.length);
            });

        };
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