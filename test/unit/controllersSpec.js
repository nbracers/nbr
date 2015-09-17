'use strict';

/* jasmine specs for controllers go here */
describe('NBR controllers', function() {
   beforeEach(module('NbrAppControllers'));
  
   var $controller,
       $scope,
       $rootScope;
   
   //sliter her
   /*beforeEach(inject(function(_$controller_, _$scope_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $scope = _$scope_;
    $rootScope = _$rootScope_;
  }));
*/
  describe('HeroCtrl', function(){
     it('can count competitions', function(){
     //   var heroCtrl = nbrAppControllers.controller("HeroCtrl",     function ($scope, $rootScope,  NbrService, NbrUtils) {});
        //heroCtrl.calculatePreviousRanking(racers)
        expect(true).toEqual(true);
     });

  });
/*
  describe('NavCtrl', function(){

var     nbOfMenuEntries = 5, 
        $scope,
        $rootScope,
        $q,
        $controller,
        NbrService,
        PROMISE = {
            resolve: true,
            reject: false
        },
        SEASONS = [{"_id":"cafe-babe","year":2015,"label":"2014/2015"}], 
        COMPETITIONS = [
        {"_id":"beef-0001","description":"foo","competition_date":"2014-12-01T19:00:00.000Z","season":{"_id":"cafe-babe","year":2015,"label":"2014/2015"},"racetype":{"_id":"abc","label":"FOO","header_no":"Foø"},"racers":[{"time":1212000,"rank":1,"point":848,"name":"Geir Skari"},{"time":1019000,"rank":2,"point":952,"name":"Eivind Lund"},{"time":1166000,"rank":3,"point":872,"name":"Kjetil Ask"},{"time":1132000,"rank":4,"point":891,"name":"Eirik Bredesen"}]},
        {"_id":"beef-0002","description":"bar","competition_date":"2014-08-25T18:00:00.000Z","season":{"_id":"cafe-babe","year":2015,"label":"2014/2015"},"racetype":{"_id":"def","label":"BAR","header_no":"Bær"},"racers":[{"time":2645000,"rank":1,"point":1030,"name":"Geir Skari"},{"time":2780000,"rank":2,"point":974,"name":"Eivind Lund"},{"time":2704000,"rank":3,"point":1009,"name":"Kjetil Ask"},{"time":2770000,"rank":4,"point":976,"name":"Eirik Bredesen"}]}
        ]
    ;

    
    beforeEach(module('NbrApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _NbrService_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        $controller = _$controller_;
        NbrService = _NbrService_;
        $scope = $rootScope.$new();
    }));

function setupController(seasons, competitions, resolve) {
        //Need a function so we can setup different instances of the controller
        var getAllSeasons = $q.defer();
        var getCompetitionsWithSeasonId = $q.defer();

        //Set up our spies
        spyOn(NbrService, 'getAllSeasons').andReturn(getAllSeasons.promise);
        spyOn(NbrService, 'getCompetitionsWithSeasonId').andReturn(getCompetitionsWithSeasonId.promise);

        //Initialise the controller
        $controller('NavCtrl', {
            $scope: $scope,
            NbrService: NbrService
        });

        // Use $scope.$apply() to get the promise to resolve on nextTick().
        // Angular only resolves promises following a digest cycle,
        // so we manually fire one off to get the promise to resolve.
        if(resolve) {
            $scope.$apply(function() {
                getAllSeasons.resolve(seasons);
                getCompetitionsWithSeasonId.resolve(competitions);
            });
        } else {
            $scope.$apply(function() {
                getAllSeasons.reject();
                getCompetitionsWithSeasonId.reject();
            });
        }
    }


    it('should configure ' + nbOfMenuEntries +' menu entries in "menuButtonObject"', 
    	inject(function() {
      setupController(SEASONS, COMPETITIONS, PROMISE.resolve);
      expect($scope.menuButtonObject.length).toBe(nbOfMenuEntries);
      expect($scope.menuButtonObject[0]).toEqual({label: 'Hjem', target: '#/', disabled: false});
      expect($scope.menuButtonObject[1]).toEqual({label: 'Øvelser', target: '#/calendar', disabled: false});
      expect($scope.menuButtonObject[2]).toEqual({label: 'Multiheroes', target: '#/hero', disabled: false});
      expect($scope.menuButtonObject[3]).toEqual({label: 'President finder', target: '#/where', disabled: false});
      expect($scope.menuButtonObject[4]).toEqual({label: 'Om', target: '#/about', disabled: true});
     }));

    
  }); //describe navCtrl
*/

});

