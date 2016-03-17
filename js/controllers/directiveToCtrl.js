/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
angular.module('directiveToCtrl', [])
    .controller('dtctrl', function ($scope) {
        //方法1
        $scope.sayHi = function () {
            alert("hi");
        };
        //方法2
        this.sayHi1 = function () {
            alert("hi1");
        };
        return $scope.dtctrl = this;
    });