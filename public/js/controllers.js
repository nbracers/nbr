/**
 * Created by jeremyt on 10/10/14.
 */

nbrAppControllers.controller("NavCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {
        console.log('--> NavCtrl loaded');

        options.api.base_url = $location.$$protocol+'://'+$location.$$host+':'+$location.$$port;
        /*
            scope variables
         */
        $scope.menuSelectedIndex = 0;
        $scope.menuButtonObject = [
            {label: 'Main', target: '#/', disabled: false},
            {label: 'Calendar', target: '#/calendar', disabled: false},
            {label: 'Multihero', target: '#/hero', disabled: false},
            {label: 'President finder', target: '#/where', disabled: false},
            {label: 'About', target: '#/about', disabled: true}
        ];
        $scope.allseasons = [];
        $scope.currentSeason = null;
        $scope.competitions = [];
        $scope.nextCompetition = {};
        $scope.showNextCompetition = false;

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

                getThisYearsCompetitionList($scope.currentSeason._id);

                console.log('--> current season: '+$scope.currentSeason.label);
            });

        };

        function getThisYearsCompetitionList(sid) {
            var competitionPromise = NbrService.getCompetitionsWithSeasonId(sid);
            competitionPromise.success(function(data) {
                $scope.competitions = (data).sort(NbrUtils.sortCompetitionArray);
                console.log('--> nbr competitions : '+$scope.competitions.length);

                var comp;
                for(var i=0; i<$scope.competitions.length; i++) {
                    comp = $scope.competitions[i];

                    if(!NbrUtils.isCompleted(comp)) {
                        $scope.nextCompetition = comp;
                        console.log('--> next competition : '+comp);
                        $scope.showNextCompetition = true;
                        break;
                    }
                }
            });
        }

        $scope.getCompetitionLabel = function(competition) {
            if(competition.racetype == undefined) {
                return '';
            }
            else {
                return competition.racetype.label;
            }

        };

        $scope.getFormattedDate = function(dateString) {
            return NbrUtils.prettyFormatFullDate(dateString);
        };

        /*
            listener for menu change events
         */
        $scope.$on('MENU_CHANGED', function (event, ind) {
            $mdSidenav('left').close();
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


nbrAppControllers.controller("MainCtrl", function ($scope, $rootScope, $location, $window, $timeout, $mdSidenav, NbrService, NbrUtils, $mdToast, $animate) {
        console.log('--> MainCtrl loaded');
        /*
            on activate, fires MENU_CHANGED with correct index
         */
        $rootScope.$broadcast('MENU_CHANGED', 0);

        /*
            scope variables
         */
        $scope.footerText = "main";
        $scope.racer1 = {};
        $scope.racer2 = {};
        $scope.racer3 = {};

        /*
            toast popup
         */
        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };
        $scope.showCustomToast = function() {
            $mdToast.show({
                controller: 'NewsCtrl',
                templateUrl: 'partials/components/news.html',
                hideDelay: 0,
                position: $scope.getToastPosition()
            });
        };

        /*
            trophy color based on position
         */
        $scope.getTrophyColor = function(position) {
            return NbrUtils.getTrophyColor(position);
        };

        /*
         return a pretty date
         */
        $scope.getFormattedDate = function(dateString) {
            return NbrUtils.prettyFormatFullDate(dateString);
        };

        /*
            navigate to hero page
         */
        $scope.gotoHero = function() {
            $window.location.href = $scope.menuButtonObject[2].target;
        };



        initMain();

        function initMain() {

            if($scope.currentSeason != null) {
                var podiumPromise = NbrService.getRacerPodiumWithSeasonId($scope.currentSeason._id);
                podiumPromise.success(function(data) {
                    if(data.length == 3) {
                        $scope.racer1 = data[0];
                        $scope.racer2 = data[1];
                        $scope.racer3 = data[2];
                    }
                });

                var messagePromise = NbrService.getLatestMessages();
                messagePromise.success(function(data) {
                    if(data.length > 0) {
                        $rootScope.remainingMessages = data;
                        console.log('--> messages retrieved');

                        $scope.showCustomToast();
                    }
                });


            }
            else {
                /*
                    in case the currentseason is still null when this controller loads
                 */
                setTimeout(initMain, 1000);
            }

        };
    }
);

nbrAppControllers.controller('NewsCtrl', function($scope, $rootScope, $mdToast, NbrUtils) {
    console.log('--> NewsCtrl loaded');

    var rotationIndex = 0;
    var refreshInterval;
    $scope.firstMessage = $rootScope.remainingMessages[rotationIndex];

    function updateToast() {
        refreshInterval = setTimeout(function() {
            $scope.$apply(function() {
                rotationIndex++;
                if(rotationIndex == $rootScope.remainingMessages.length) {
                    rotationIndex = 0;
                }

                $scope.firstMessage = $rootScope.remainingMessages[rotationIndex];

                //avoid unnecessary loops
                if($rootScope.remainingMessages.length > 1) {
                    updateToast();
                }
            });
        }, 5000);
    }

    updateToast();

    $scope.closeToast = function() {
        clearTimeout(refreshInterval);
        $mdToast.hide();
    };

    /*
     return a pretty date
     */
    $scope.getFormattedDate = function(dateString) {
        return NbrUtils.prettyFormatFullDate(dateString);
    };
});

nbrAppControllers.controller("CalCtrl", function ($scope, $rootScope, $location, $window, $timeout, $mdSidenav, NbrService, NbrUtils) {
        console.log('--> CalCtrl loaded');
        /*
         on activate, fires MENU_CHANGED with correct index
         */
        $rootScope.$broadcast('MENU_CHANGED', 1);

        $scope.lastSelectedCompetition = {};
        $scope.selectedCompetitionResults = [];

        /*
         return correct class for racer
         */
        $scope.getCompetitionStyle = function(competition) {
            if(competition.selected) {
                return 'competitionItemSelect';
            }
            else {
                return 'competitionItem';
            }
        };

        $scope.getCompetitionLabelWithStatus = function(competition) {
            return $scope.getCompetitionLabel(competition) + $scope.getCompetitionStatusLabel(competition);
        };
        $scope.getCompetitionLabel = function(competition) {
            return competition.racetype.label;
        };
        $scope.getCompetitionStatusLabel = function(competition) {
            return NbrUtils.isCompleted(competition) ? ' (completed)' : '';
        };

        /*
         return correct class if competition date is over
         */
        $scope.getCompetitionStatus = function(competition) {
            if(NbrUtils.isCompleted(competition) && !competition.selected) {
                return 'competitionCompleted';
            }
            else {
                return '';
            }
        };

        /*
         sets the current selected racer (unsets previous one)
         */
        $scope.changeCompetition = function(competition) {
            $scope.lastSelectedCompetition.selected = false;
            if($scope.lastSelectedCompetition != competition) {
                $scope.lastSelectedCompetition = competition;
                $scope.lastSelectedCompetition.selected = true;
                getCompetitionResults($scope.lastSelectedCompetition);
            }
            else {
                $scope.lastSelectedCompetition = {};
            }
        };

        function getCompetitionResults(competition) {

            var service = NbrService.getRacersByCompetition(competition._id);
            service.success(function(retrievedResult) {
                console.log('--> successfully retrieved: '+retrievedResult.length+' results');
                $scope.selectedCompetitionResults = retrievedResult.sort(NbrUtils.sortCompetitionResult);
            });
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
    }
);

nbrAppControllers.controller("HeroCtrl", function ($scope, $rootScope, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {
        /*
            on activate, fires MENU_CHANGED with correct index
         */
        $rootScope.$broadcast('MENU_CHANGED', 2);

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
            $scope.selectedIndex = ind;
            initHero($scope.selectedIndex);
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
            $scope.selectedUserResults = [];
            $scope.lastSelectedRacer.selected = false;
            if($scope.lastSelectedRacer != racer) {
                $scope.lastSelectedRacer = racer;
                $scope.lastSelectedRacer.selected = true;
                getRacerResults($scope.lastSelectedRacer);
            }
            else {
                $scope.lastSelectedRacer = {};
            }
        };


        function getRacerResults(racer) {
            var resultsServicePromises = [];

            racer.results.forEach(function(result) {
                resultsServicePromises.push(getResultObject(result))
            });

            Promise.all(resultsServicePromises).then(function(resultsArray) {
                console.log('--> successfully retrieved: '+resultsArray.length+' results');
                $scope.selectedUserResults = resultsArray.sort(NbrUtils.sortMultiheroArray);;
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
            $scope.racers = [];
            if($scope.allseasons.length > 0) {
                var heroPromise = NbrService.getRacersWithSeasonId($scope.allseasons[ind]._id);
                heroPromise.success(function(data) {
                    $scope.racers = data;
                    console.log('--> nbr racers : '+$scope.racers.length);
                });
            }
            else {
                setTimeout(initHero, 1000, ind);
            }

        };
    }
);

nbrAppControllers.controller("WhereCtrl", function ($scope, $rootScope, $window, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {
    console.log('--> WhereCtrl loaded');
    /*
     on activate, fires MENU_CHANGED with correct index
     */
    $rootScope.$broadcast('MENU_CHANGED', 3);

    /*
        variables
     */
    $scope.geoOK = true;
    $scope.isRacerPresident = false;
    $scope.lastUpdated = null;
    $scope.distance = 'Calculating ...';

    var presMarker = null;
    var presIcon = 'img/pres.png';
    var presPos = null;
    var presInfowindow = new google.maps.InfoWindow();

    var racerMarker = null;
    var racerPos = new google.maps.LatLng(0,0);
    var racerInfowindow = new google.maps.InfoWindow();
    var gmap = null;
    var pollInterval = null;
    var watchId = null;

    var geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    $scope.$on('mapInitialized', placeRelevantPOIsOnMap);

    //check for URL params: http://xxxx/xx?param
    var pars = $location.$$search;
    if(pars.president) {
        console.log('--> I am president');
        $scope.isRacerPresident = true;
    }


    function placeRelevantPOIsOnMap(event, map) {
        console.log('--> map initialised');
        gmap = map;
        /*
            let's place at least the president
         */
        NbrService.getPresidentCoordinates().success(function(data) {
            $scope.lastUpdated = moment(data.dat).fromNow();
            presPos = new google.maps.LatLng(data.lat, data.long);
            presMarker = new google.maps.Marker({position: presPos, map: gmap, icon: presIcon});
            google.maps.event.addListener(presMarker, 'click', (function(presMarker) {
                return function() {
                    presInfowindow.setContent("<a target='_new' href='http://www.president.fr/'>President</a>");
                    presInfowindow.open(gmap, presMarker);
                }
            })(presMarker));

            /*
                if I am a simple racer, let's place a marker for me too
             */
            if(!$scope.isRacerPresident) {
                console.log('--> I am racer');
                racerMarker = new google.maps.Marker({position: racerPos, map: map});
                google.maps.event.addListener(racerMarker, 'click', (function(racerMarker) {
                    return function() {
                        racerInfowindow.setContent('Me');
                        racerInfowindow.open(gmap, racerMarker);
                    }
                })(racerMarker));
            }

            startTracking();
        });
    };

    function startTracking() {

        console.log('--> startTracking');
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('--> starting getCurrentPosition');
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            if($scope.isRacerPresident) {              //if url contains param 'president'
                updatePresidentCoords(position.coords.latitude, position.coords.longitude, pos);
            }
            else {
                racerMarker.setPosition(pos);
                pollInterval = setInterval(getPresidentCoords, 15000);
            }
        }, showError, geoOptions);

        watchId = navigator.geolocation.watchPosition(function(position) {
            console.log('--> starting watchPosition');
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            if($scope.isRacerPresident) {              //if url contains param 'president'
                updatePresidentCoords(position.coords.latitude, position.coords.longitude, pos);
            }
            else {
                racerMarker.setPosition(pos);
                fitAllIn();
            }

        }, showError);

        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.log('--> User denied the request for Geolocation.');
                    $scope.geoOK = false;
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log('--> Location information is unavailable.');
                    $scope.geoOK = false;
                    break;
                case error.TIMEOUT:
                    console.log('--> The request to get user location timed out.');
                    /*
                     This is a bit of a fix. Case when switching back and forth between the "where" page, it happens that the geolocation does initialise correctly. After a timeout of
                     10 sec, the page will be reloaded, thus forcing a geolocation init. Not pretty, but does the trick.
                     */
                    $window.location.reload();
                    break;
                case error.UNKNOWN_ERROR:
                    console.log('--> An unknown error occurred.');
                    break;
            }


        };
    };


    function fitAllIn() {
        var bounds = new google.maps.LatLngBounds();

        if (presMarker != null && racerMarker != null) {
            bounds.extend(presMarker.getPosition());
            bounds.extend(racerMarker.getPosition());
            gmap.fitBounds(bounds);

            $scope.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(presMarker.getPosition(), racerMarker.getPosition()));
        }
        else if(presMarker != null) {
            gmap.panTo(presMarker.getPosition());
        }
        else if(racerMarker != null) {
            gmap.panTo(racerMarker.getPosition());
        }
    };

    function getPresidentCoords() {
        console.log('--> fetching president position');
        NbrService.getPresidentCoordinates().success(function(data) {
            $scope.lastUpdated = moment(data.dat).fromNow();
            presPos = new google.maps.LatLng(data.lat, data.long);
            presMarker.setPosition(presPos);
            fitAllIn();
        });
    };

    function updatePresidentCoords(la, lo, pos) {
        console.log('--> updating president position');
        NbrService.updatePresidentCoordinates({lat: la, long: lo}).success(function() {
            presMarker.setPosition(pos);
            gmap.panTo(pos);
        });
    };
});

nbrAppControllers.controller("MessageCtrl", function ($scope, $rootScope, $window, $location, $timeout, $mdSidenav, NbrService, NbrUtils) {
    console.log('--> MessageCtrl loaded');
    /*
     on activate, fires MENU_CHANGED with correct index
     */
    $rootScope.$broadcast('MENU_CHANGED', -1);

    $scope.author = '';
    $scope.publishdate = null;
    $scope.content = '';

    $scope.postMessage = function() {

        if($scope.author != '' && $scope.publishdate != null && $scope.content != '') {
            console.log('--> author: '+$scope.author);
            console.log('--> publishdate: '+$scope.publishdate);
            console.log('--> content: '+$scope.content);

            NbrService.postMessage({author: $scope.author, content: $scope.content, dop: $scope.publishdate}).success(function() {
                $scope.author = '';
                $scope.publishdate = null;
                $scope.content = '';
            });

        }
    };

});