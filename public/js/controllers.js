/**
 * Created by jeremyt on 10/10/14.
 */

nbrAppControllers.controller("NavCtrl", function ($scope, $location, $timeout, $mdSidenav) {
        console.log('--> nav started');

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

    }
);


nbrAppControllers.controller("MainCtrl", function ($scope, $location, $timeout, $mdSidenav) {
    }
);

nbrAppControllers.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function() {
        $mdSidenav('left').close();
    };
})