(function() {

    'use strict';
    angular.module('landcoverportal')
        .controller('utilsController', function ($rootScope, $scope, appSettings) {

            $scope.menus = appSettings.menus;
            $scope.applicationName = appSettings.applicationName;
            $scope.footerLinks = appSettings.footerLinks;
            $scope.partnersHeader = appSettings.partnersHeader;
            $scope.partnersFooter = appSettings.partnersFooter;
            $scope.serviceApplicationsCards = appSettings.serviceApplicationsCards;
            $scope.descriptionModalBody = '';
            $scope.descriptionModalTitle = '';
            $scope.toggleHandleClass = 'fa-chevron-up';

            $scope.trimDescription = function(description) {
                return String(description).substring(0, 200);
            };

            // Modal Close Function
            $scope.closeModal = function() {
                $('#descriptionModal').modal('hide');
            };

            // Modal Open Function
            $scope.showModal = function(title, description) {
                $scope.descriptionModalTitle = title;
                $scope.descriptionModalBody = description;
                $('#descriptionModal').modal('show');
            };

            // Close the Modal
            $('.modal-close').click(function() {
                $scope.closeModal();
            });

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target === $('#descriptionModal')[0]) {
                    $scope.closeModal();
                }
            };

            $('#carousel').carousel({
                interval: 2000
            });

            $scope.toggleFullScreen = function () {
                if ($('.map').hasClass('col-md-9')) {
                    $rootScope.$broadcast('toggleFullScreen', { mapClass: 'col-md-12 col-lg-12', sideClass: 'col-md-0 col-lg-0' });
                } else {
                    $rootScope.$broadcast('toggleFullScreen', { mapClass: 'col-md-9 col-lg-9', sideClass: 'col-md-3 col-lg-3' });
                }
            };

            $scope.toggleLogoBar = function () {
                if ($('.banner-container').hasClass('display-none')) {
                    $('.banner-container').removeClass('display-none');
                    $scope.toggleHandleClass = 'fa-chevron-up';
                    $('body').css({'margin-top': '110px'});
                    $('.nav-side-menu').css({'height': 'calc(100vh - 110px)'});
                    $('.map').css({'height': 'calc(100vh - 110px)'});
                } else {
                    $('.banner-container').addClass('display-none');
                    $scope.toggleHandleClass = 'fa-chevron-down';
                    $('body').css({'margin-top': '55px'});
                    $('.nav-side-menu').css({'height': 'calc(100vh - 55px)'});
                    $('.map').css({'height': 'calc(100vh - 55px)'});
                }
            };

        });

})();