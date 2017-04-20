'use strict';

(function () {
    angular.module('crumbs.core').controller('SliderController', ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', SliderController]);

    function SliderController($scope, $rootScope, $ionicSlideBoxDelegate, $ionicSideMenuDelegate) {
        $scope.data = {};

        $scope.$on('$ionicSlides.slideChangeEnd', function (event, data) {
            $scope.activeIndex = data.slider.activeIndex;
            $scope.previousIndex = data.slider.previousIndex;
            $ionicSideMenuDelegate.canDragContent(true);
        });

        var setupSlider = function setupSlider() {
            $scope.data.sliderOptions = {
                initialSlide: $rootScope.activeSlide,
                direction: 'horizontal',
                speed: 300
            };

            $scope.$watch('$root.activeSlide', function (newVal, oldVal) {
                if (newVal != null && $scope.data.sliderDelegate != undefined && $scope.data.sliderDelegate != null) {
                    $scope.data.sliderDelegate.slideTo(newVal, 300);
                }
            });

            $scope.data.sliderDelegate = null;

            $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
                if (newVal != null) {
                    $scope.data.sliderDelegate.on('slideChangeEnd', function () {
                        $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
                        $scope.$apply();
                    });
                }
            });
        };

        setupSlider();
    }
})();