(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('trainingService', function ($http, $q) {

        var service = this;

        service.getTraining = function (options) {
            var req = {
                method: 'POST',
                url: '/api/training/'
            };
            var promise = $http(req)
            .then(function (response) {
                return response.data;
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e.data;
            });
            return promise;
        };
    });

})();
