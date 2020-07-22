(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('tensorService', function ($http, $q) {

        var service = this;

        service.getTFContent = function (options) {
            var req = {
                method: 'POST',
                url: '/api/tf-content/'
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
