(function() {

    'use strict';

    angular.module('landcoverportal')
    .service('CommonService', function (appSettings) {

        this.getAreaVariableOptions = function (option) {

            if (option === 'country') {
                return appSettings.countries;
            } else if (option === 'province') {
                return appSettings.provinces;
            }
        };

    });

})();
