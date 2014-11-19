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
            {label: 'President finder', target: '#/where', disabled: false},
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


nbrAppControllers.controller("MainCtrl", function ($scope, $rootScope, $location, $window, $timeout, $mdSidenav, NbrService, NbrUtils) {

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

        /*
            return correct class if competition date is over
         */
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

        /*
            navigate to hero page
         */
        $scope.gotoHero = function() {
            $window.location.href = $scope.menuButtonObject[1].target;
        };

        /*
            return a pretty date
         */
        $scope.getFormattedDate = function(dateString) {
            return NbrUtils.prettyFormatFullDate(dateString);
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
        $scope.lastSelectedRacer = {};
        $scope.selectedUserResults = [];

        /*
         trophy color based on position
         */
        $scope.getTrophyColor = function(position) {
            return NbrUtils.getTrophyColor(position);
        };

        /*
            refresh the racers based on the tab clicked
         */
        $scope.announceSelected = function(ind) {
            initHero(ind);
        };

        /*
            return correct class for racer
         */
        $scope.getRacerStyle = function(racer) {
            if(racer.selected) {
                return 'racerItemSelect';
            }
            else {
                return 'racerItem';
            }
        };

        /*
            sets the current selected racer (unsets previous one)
         */
        $scope.changeSelected = function(racer) {
            $scope.lastSelectedRacer.selected = false;
            $scope.lastSelectedRacer = racer;
            $scope.lastSelectedRacer.selected = true;
            getRacerResults($scope.lastSelectedRacer);
        };


        function getRacerResults(racer) {
            var resultsServicePromises = [];

            racer.results.forEach(function(result) {
                resultsServicePromises.push(getResultObject(result))
            });

            Promise.all(resultsServicePromises).then(function(resultsArray) {
                console.log('--> successfully retrieved: '+resultsArray.length+' results');
                $scope.selectedUserResults = resultsArray.sort(NbrUtils.sortCompetitionArray);;
                $scope.$apply();
            }).catch(function(err) {
                console.log('heros all promise error: '+err);
            });
        };

        function getResultObject(result) {
            return new Promise(function(resolve, reject) {

                var service = NbrService.getResultWithId(result);
                service.success(function(retrievedResult) {
                    resolve(retrievedResult);
                });
                service.error(function(err) {
                    reject(err);
                });
            })
        };

        /*
            return a pretty date
         */
        $scope.getFormattedDate = function(dateString) {
            return NbrUtils.prettyFormatFullDate(dateString);
        };

        $scope.getFormattedTime = function(t) {
            var d = moment.duration(t, 'milliseconds');
            var hours = String(Math.floor(d.asHours()));
            var mins = String(Math.floor(d.asMinutes()) - hours * 60);
            var secs = String(Math.floor(d.asSeconds()) - hours * 60 - mins * 60);

            if(hours.length == 1 ) {
                hours = '0'+hours;
            }

            if(mins.length == 1) {
                mins = '0'+mins;
            }

            if(secs.length == 1) {
                secs = '0'+secs;
            }

            return hours + ":" + mins + ":" + secs ;
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

nbrAppControllers.controller("WhereCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {
    /*
     on activate, fires MENU_CHANGED with correct index
     */
    $rootScope.$broadcast('MENU_CHANGED', 2);

    $scope.distance = 0;
    $scope.presLat = 0;
    $scope.presLong = 0;
    $scope.isRacerPresident = false;
    $scope.lastUpdated = null;

    var pars = $location.$$search;    //check for URL params: http://xxxx/xx?param

    if(pars.president) {
        $scope.isRacerPresident = true;
    }

    var infowindow = new google.maps.InfoWindow();
    var initPos = new google.maps.LatLng(0,0);
    var presMarker;
    var racerMarker;
    var presPos;

    function updatePresidentCoords() {
        console.log('--> updating president position');
        if($scope.presLat > 0 && $scope.presLong > 0) {
            NbrService.updatePresidentCoordinates({lat: $scope.presLat, long: $scope.presLong});
        }
    };

    function getPresidentCoords() {
        console.log('--> fetching president position');
        NbrService.getPresidentCoordinates().success(function(data) {
            $scope.lastUpdated = moment(Number(data[2])).fromNow();
            presPos = new google.maps.LatLng(data[0],
                data[1]);
            presMarker.setPosition(presPos);
        });
    };

    $scope.$on('mapInitialized', function(event, map) {

        /*
            we place the president's POI
         */
        var presInfowindow = new google.maps.InfoWindow();
        var image = 'img/pres.png';
        presPos = new google.maps.LatLng(60.055447, 10.869426);   //set to Dominique's default home location
        presMarker = new google.maps.Marker({position: presPos, map: map, icon: image});
        getPresidentCoords();
        google.maps.event.addListener(presMarker, 'click', (function(presMarker) {
            return function() {
                presInfowindow.setContent('President');
                presInfowindow.open(map, presMarker);
            }
        })(presMarker));

        if($scope.isRacerPresident) {              //if url contains param 'president'
            //i am the president, therefore I update my coords
            setInterval(updatePresidentCoords, 30000);
        }
        else {
            //i am just a simple racer, therefore I look for the president's position
            racerMarker = new google.maps.Marker({position: initPos, map: map});
            google.maps.event.addListener(racerMarker, 'click', (function(racerMarker) {
                return function() {
                    infowindow.setContent('Me');
                    infowindow.open(map, racerMarker);
                }
            })(racerMarker));

            setInterval(getPresidentCoords, 30000);
        }

        navigator.geolocation.watchPosition(function(position) {
            $scope.presLat = position.coords.latitude;
            $scope.presLong = position.coords.longitude;

            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            if($scope.isRacerPresident) {              //if url contains param 'president'
                presMarker.setPosition(pos);
                map.panTo(pos);
            }
            else {
                racerMarker.setPosition(pos);

                var bounds = new google.maps.LatLngBounds();
                bounds.extend( presMarker.getPosition() );
                bounds.extend( racerMarker.getPosition() );

                map.fitBounds(bounds);

                $scope.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(presPos, pos));
                $scope.$apply();
            }

        });

    });

});