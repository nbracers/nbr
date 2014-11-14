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
        $scope.racers = [];
        $scope.competitions = [];

        /*
            trophy color based on position
         */
        $scope.getTrophyColor = function(position) {
            return NbrUtils.getTrophyColor(position);
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

            var podiumPromise = NbrService.getRacerPodiumWithSeasonId($scope.currentSeason._id);
            podiumPromise.success(function(data) {
                $scope.racers = data;
            });

        };
    }
);

nbrAppControllers.controller("HeroCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {
        /*
            on activate, fires MENU_CHANGED with correct index
         */
        $rootScope.$broadcast('MENU_CHANGED', 1);

        /*
            scope variables
         */
        $scope.footerText = "hero";
        $scope.selectedIndex = 0;
        $scope.racers = [];

        /*
         trophy color based on position
         */
        $scope.getTrophyColor = function(position) {
            return NbrUtils.getTrophyColor(position);
        };

        $scope.announceSelected = function(ind) {
            initHero(ind);
        };

        initHero($scope.selectedIndex);
        function initHero(ind) {

            var heroPromise = NbrService.getRacersWithSeasonId($scope.allseasons[ind]._id);
            heroPromise.success(function(data) {
                $scope.racers = data;
                console.log('--> nbr racers : '+$scope.racers.length);
            });

        };
    }
);