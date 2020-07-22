(function () {

    'use strict';

    angular.module('landcoverportal')
    .service('eventsService', function ($http, $q) {

        var service = this;

        service.getEvents = function (options) {
            var req = {
                method: 'POST',
                url: '/api/events/'
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
