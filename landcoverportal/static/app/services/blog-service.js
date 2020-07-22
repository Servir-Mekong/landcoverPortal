(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('blogService', function ($http, $q) {

        var service = this;

        service.getBlog = function (options) {
            var req = {
                method: 'POST',
                url: '/api/blog/'
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
