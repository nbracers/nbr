/**
 * Created by jeremyt on 10/10/14.
 */

nbrAppDirectives.directive('herotrendDirective', function() {
    return {
        scope: {
            currentrank: "@",
            lastrank: "@",
            ind: "@"
        },
        link: function(scope, element, attrs) {
            var cr = Number(scope.currentrank);
            var lr = Number(scope.lastrank);
            var el;

            if(cr < lr) {
                el = angular.element('<img src="../img/arrowdown.png" width="24" height="24">&nbsp;'+(Number(scope.ind)+1));
            }
            else if(cr > lr) {
                el = angular.element('<img src="../img/arrowup.png" width="24" height="24">&nbsp;'+(Number(scope.ind)+1));
            }
            else {
                el = angular.element('<img src="../img/arrow_grey.png" width="24" height="24">&nbsp;'+(Number(scope.ind)+1));
            }

            element.append(el);
        }
    }
});

nbrAppDirectives.directive('racertrendDirective', function() {
    return {
        scope: {
            result: "@",
            point: "@"
        },
        link: function(scope, element, attrs) {
            var el;

            if(scope.result == "true") {
                el = angular.element('<img src="../img/arrowup.png" width="14" height="14">&nbsp;'+scope.point+' pts');
            }
            else if(scope.result == "false") {
                el = angular.element('<img src="../img/arrowdown.png" width="14" height="14">&nbsp;'+scope.point+' pts');
            }
            else {
                el = angular.element('<img src="../img/arrow.png" width="14" height="14">&nbsp;'+scope.point+' pts');
            }

            element.append(el);
        }
    }
});