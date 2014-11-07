/**
 * Created by jeremyt on 10/10/14.
 */


nbrAppControllers.controller("MainCtrl", function ($scope, $location, $timeout, $mdSidenav) {
        console.log('--> main started');

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

    }
);

nbrAppControllers.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function() {
        $mdSidenav('left').close();
    };
})