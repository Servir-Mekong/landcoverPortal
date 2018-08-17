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

        this.capitalizeString = function (string) {
            return string.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };

        this.AnalysisToolControl = function (controlDiv) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.setAttribute('class', 'tool-control text-center');
            controlUI.setAttribute('id', 'analysis-tool-control');
            controlUI.title = 'Toogle Tools Visibility';
            controlUI.innerHTML = "<span class='glyphicon glyphicon-eye-open large-icon' aria-hidden='true'></span>";
            controlDiv.appendChild(controlUI);
            return controlUI;
        };

    });

})();
