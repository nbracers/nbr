/**
 * Created by jeremyt on 10/10/14.
 */

nbrAppServices.factory('TokenInterceptor', function ($q, $window, $location, $rootScope) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer Reblochon';

            return config;
        },

        requestError: function (rejection) {
            return $q.reject(rejection);
        }
    };
});

nbrAppServices.factory('NbrService', function ($http) {
    return {
        getAllSeasons: function () {
            return $http.get(options.api.base_url + '/season');
        },

        getHeroWithSeasonId: function (data) {
            return $http.get(options.api.base_url + '/hero/'+data);
        },

        getRacersWithSeasonId: function (data) {
            return $http.get(options.api.base_url + '/racer/'+data);
        },

        getRacerPodiumWithSeasonId: function (data) {
            return $http.get(options.api.base_url + '/racer/podium/'+data);
        }
    }
});

nbrAppServices.factory('NbrUtils', function () {
    return {
        sortSeasonArray: function (a,b) {
            if (a.start_year < b.start_year)
                return -1;
            if (a.start_year > b.start_year)
                return 1;
            return 0;
        },

        sortCompetitionArray: function (a,b) {
            if (a.competition_date < b.competition_date)
                return -1;
            if (a.competition_date > b.competition_date)
                return 1;
            return 0;
        },

        getTrophyColor: function(position) {
            switch(position) {
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
        }
    }
});